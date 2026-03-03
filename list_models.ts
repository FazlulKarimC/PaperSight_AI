import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function listModels() {
    try {
        const models = await ai.models.list();
        for await (const model of models) {
            if (model.name.includes("embed") || model.name.includes("text")) {
                console.log(`- ${model.name}`);
                console.log(`  Supported generation methods: ${model.supportedGenerationMethods.join(", ")}`);
            }
        }
    } catch (e) {
        console.error(e);
    }
}

listModels();
