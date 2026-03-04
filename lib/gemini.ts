import { GoogleGenAI } from "@google/genai";
import { getSystemPrompt, type SummaryStyle } from "@/lib/utils";
import { withRetry } from "@/lib/retry";

export type { SummaryStyle };

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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
