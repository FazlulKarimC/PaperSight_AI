import { GoogleGenAI } from "@google/genai";
import { getSystemPrompt, type SummaryStyle } from "@/lib/utils";
import { withRetry } from "@/lib/retry";

export type { SummaryStyle };

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Streaming variant — returns a ReadableStream<string> for SSE responses.
 *
 * Uses Gemini's `systemInstruction` config field (not content concatenation)
 * to prevent adversarial PDF content from overriding the system prompt.
 */
export const generateContentStreamUsingGemini = async (
  pdfText: string,
  style: SummaryStyle = "viral"
): Promise<ReadableStream<string>> => {
  const systemPrompt = getSystemPrompt(style);

  const response = await withRetry(() => ai.models.generateContentStream({
    model: "gemini-3-flash-preview",
    contents: `Summarize the following document text and respond in markdown as per the format specified in your instructions:\n\n${pdfText}`,
    config: {
      systemInstruction: systemPrompt,
      temperature: style === "academic" ? 0.3 : style === "viral" ? 0.6 : 0.5,
      maxOutputTokens: ({
        concise: 1000,
        viral: 2000,
        'bullet-points': 2000,
        academic: 2000,
        detailed: 3000,
      } as Record<string, number>)[style] ?? 2000,
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
