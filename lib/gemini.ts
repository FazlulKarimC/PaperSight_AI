import { GoogleGenAI } from "@google/genai";
import { SUMMARY_SYSTEM_PROMPT } from "@/lib/utils";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateContentUsingGemini = async (pdfText: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `your role: ${SUMMARY_SYSTEM_PROMPT}\n\n summarize the following pdftext and give response in markdown as per above mentioned format: \n\n${pdfText}`,
    config: {
      temperature: 0.5,
      maxOutputTokens: 1500,
    },
  });
  return response.text;
}



