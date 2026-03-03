import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function listModels() {
    try {
        const models = await ai.models.list();
        for await (const model of models) {
            const name = model.name ?? '';
            if (name.includes("embed") || name.includes("text")) {
                console.log(`- ${name}`);
                const methods = (model as any).supportedGenerationMethods;
                if (methods) {
                    console.log(`  Supported generation methods: ${methods.join(", ")}`);
                }
            }
        }
    } catch (e) {
        console.error(e);
    }
}

listModels();
