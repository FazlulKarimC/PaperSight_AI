import { NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import { prisma } from "@/lib/prisma";
import {
    generateEmbedding,
    searchSimilarChunks,
    hasEmbeddings,
    storeEmbeddings,
} from "@/lib/embeddings";

export const maxDuration = 60;

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

/**
 * POST /api/chat
 *
 * RAG chat endpoint:
 * 1. Embeds the user's question
 * 2. Searches for similar chunks in the summary's embeddings
 * 3. Builds a grounded prompt with the relevant context
 * 4. Streams Gemini's response back as SSE
 */
export async function POST(req: NextRequest) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return new Response(
                JSON.stringify({ error: "User not authenticated" }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }

        const body = await req.json();
        const { summaryId, message, history = [] } = body as {
            summaryId: string;
            message: string;
            history?: { role: string; content: string }[];
        };

        if (!summaryId || !message) {
            return new Response(
                JSON.stringify({ error: "summaryId and message are required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Verify the summary belongs to this user
        const summary = await prisma.pdfSummary.findFirst({
            where: { id: summaryId, userId },
        });

        if (!summary) {
            return new Response(
                JSON.stringify({ error: "Summary not found" }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        // Auto-index: if embeddings don't exist yet, generate them now
        const indexed = await hasEmbeddings(summaryId);
        if (!indexed) {
            // Combine title + summary text for richer embeddings
            const fullText = [summary.title, summary.summaryText]
                .filter(Boolean)
                .join("\n\n");
            await storeEmbeddings(summaryId, userId, fullText);
        }

        // 1. Generate embedding for user question
        const queryEmbedding = await generateEmbedding(message);

        // 2. Retrieve relevant chunks via vector similarity
        const relevantChunks = await searchSimilarChunks(
            summaryId,
            queryEmbedding,
            5
        );

        const context = relevantChunks
            .map((c, i) => `[Chunk ${i + 1}] ${c.chunkText}`)
            .join("\n\n");

        // 3. Build the RAG system prompt
        const systemPrompt = `You are an intelligent research assistant for the document titled "${summary.title ?? "Untitled"}".
You help users understand, analyze, and explore the content of their PDF document.

RELEVANT CONTEXT FROM THE DOCUMENT:
${context}

INSTRUCTIONS:
- Answer the user's question based ONLY on the provided document context above.
- If the answer is not found in the context, say so honestly — do not make up information.
- Use clear, well-structured markdown formatting in your responses.
- When referencing specific parts, mention what section or topic it relates to.
- Be conversational but precise.
- If the user asks for a summary of a specific section, provide it from the context.`;

        // 4. Build conversation history for multi-turn
        const conversationHistory = history.slice(-6).map((msg) => ({
            role: msg.role as "user" | "model",
            parts: [{ text: msg.content }],
        }));

        // Save user message to database
        await prisma.chatMessage.create({
            data: {
                summaryId,
                userId,
                role: "user",
                content: message,
            },
        });

        // 5. Stream response from Gemini with automatic retry for 503 spikes
        const response = await withRetry(() =>
            ai.models.generateContentStream({
                model: "gemini-3-flash-preview",
                contents: [
                    ...conversationHistory,
                    { role: "user", parts: [{ text: message }] },
                ],
                config: {
                    systemInstruction: systemPrompt,
                    temperature: 0.4,
                    maxOutputTokens: 2000,
                },
            })
        );

        // 6. Transform into SSE stream and save assistant response
        const encoder = new TextEncoder();
        let fullResponse = "";

        const sseStream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of response) {
                        const text = chunk.text;
                        if (text) {
                            fullResponse += text;
                            controller.enqueue(
                                encoder.encode(
                                    `data: ${JSON.stringify({ type: "chunk", text })}\n\n`
                                )
                            );
                        }
                    }

                    // Save assistant response to database
                    await prisma.chatMessage.create({
                        data: {
                            summaryId,
                            userId,
                            role: "model",
                            content: fullResponse,
                        },
                    });

                    controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`)
                    );
                    controller.close();
                } catch (err) {
                    const errorMsg =
                        err instanceof Error ? err.message : "Stream error";
                    controller.enqueue(
                        encoder.encode(
                            `data: ${JSON.stringify({ type: "error", error: errorMsg })}\n\n`
                        )
                    );
                    controller.close();
                }
            },
        });

        return new Response(sseStream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            },
        });
    } catch (error) {
        console.error("Error in chat endpoint:", error);
        const msg =
            error instanceof Error ? error.message : "An unexpected error occurred";
        return new Response(JSON.stringify({ error: msg }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

/**
 * GET /api/chat?summaryId=xxx
 *
 * Retrieves chat history for a summary.
 */
export async function GET(req: NextRequest) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return new Response(
                JSON.stringify({ error: "User not authenticated" }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }

        const { searchParams } = new URL(req.url);
        const summaryId = searchParams.get("summaryId");

        if (!summaryId) {
            return new Response(
                JSON.stringify({ error: "summaryId is required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const messages = await prisma.chatMessage.findMany({
            where: { summaryId, userId },
            orderBy: { createdAt: "asc" },
            select: {
                id: true,
                role: true,
                content: true,
                createdAt: true,
            },
        });

        return new Response(JSON.stringify({ messages }), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching chat history:", error);
        return new Response(
            JSON.stringify({ error: "Failed to fetch chat history" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
