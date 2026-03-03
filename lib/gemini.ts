import { GoogleGenAI } from "@google/genai";
import { getSystemPrompt, type SummaryStyle } from "@/lib/utils";

export type { SummaryStyle };

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Helper to retry promises with exponential backoff to handle free-tier API 503/429 errors.
 */
async function withRetry<T>(fn: () => Promise<T>, retries = 3, delayMs = 1000): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      const isRetryable = error?.status === 503 || error?.status === 429 || error?.toString().includes("503") || error?.toString().includes("UNAVAILABLE");
      if (!isRetryable || i === retries - 1) throw error;

      console.warn(`[GEMINI API] 503/429 Model overloaded. Retrying in ${delayMs / 1000}s... (Attempt ${i + 1}/${retries})`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      delayMs *= 2; // exponential backoff
    }
  }
  throw new Error("Max retries exceeded");
}

export const generateContentUsingGemini = async (
  pdfText: string,
  style: SummaryStyle = "viral"
) => {
  try {
    console.log(`Generating ${style} summary with Gemini, text length:`, pdfText.length);

    const systemPrompt = getSystemPrompt(style);

    const response = await withRetry(() => ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `your role: ${systemPrompt}\n\n summarize the following pdftext and give response in markdown as per above mentioned format: \n\n${pdfText}`,
      config: {
        temperature: style === "academic" ? 0.3 : style === "viral" ? 0.6 : 0.5,
        maxOutputTokens: style === "detailed" ? 3000 : style === "concise" ? 800 : 1500,
      },
    }));

    const text = response.text;
    console.log("Gemini response received, length:", text?.length || 0);

    if (!text) {
      console.error("Gemini returned empty response");
      throw new Error("Gemini returned empty response");
    }

    return text;
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    throw error;
  }
}

/**
 * Streaming variant — returns a ReadableStream<string> for Edge functions
 */
export const generateContentStreamUsingGemini = async (
  pdfText: string,
  style: SummaryStyle = "viral"
): Promise<ReadableStream<string>> => {
  const systemPrompt = getSystemPrompt(style);

  const response = await withRetry(() => ai.models.generateContentStream({
    model: "gemini-3-flash-preview",
    contents: `your role: ${systemPrompt}\n\n summarize the following pdftext and give response in markdown as per above mentioned format: \n\n${pdfText}`,
    config: {
      temperature: style === "academic" ? 0.3 : style === "viral" ? 0.6 : 0.5,
      maxOutputTokens: style === "detailed" ? 3000 : style === "concise" ? 800 : 1500,
    },
  }));

  return new ReadableStream<string>({
    async start(controller) {
      try {
        for await (const chunk of response) {
          const text = chunk.text;
          if (text) controller.enqueue(text);
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });
}
