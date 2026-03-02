import { NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { generateContentStreamUsingGemini, type SummaryStyle } from "@/lib/gemini";
import parse from "@/lib/parse";

// Use Node.js runtime (not edge) because PDF parsing needs node:module
export const maxDuration = 60;

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
        const { fileUrl, style = "viral" } = body as { fileUrl: string; style?: SummaryStyle };

        if (!fileUrl) {
            return new Response(
                JSON.stringify({ error: "File URL is required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Parse PDF text
        const pdfText = await parse(fileUrl);
        if (!pdfText) {
            return new Response(
                JSON.stringify({ error: "Failed to parse PDF" }),
                { status: 422, headers: { "Content-Type": "application/json" } }
            );
        }

        const originalWordCount = pdfText.split(/\s+/).filter(Boolean).length;

        // Get streaming response from Gemini
        const stream = await generateContentStreamUsingGemini(pdfText, style);

        // Transform into SSE format with metadata header
        const encoder = new TextEncoder();
        const sseStream = new ReadableStream({
            async start(controller) {
                // Send metadata as first event
                controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ type: "meta", originalWordCount })}\n\n`)
                );

                const reader = stream.getReader();
                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        controller.enqueue(
                            encoder.encode(`data: ${JSON.stringify({ type: "chunk", text: value })}\n\n`)
                        );
                    }
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
                    controller.close();
                } catch (err) {
                    const errorMsg = err instanceof Error ? err.message : "Stream error";
                    controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify({ type: "error", error: errorMsg })}\n\n`)
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
        console.error("Error in summarize stream:", error);
        const msg = error instanceof Error ? error.message : "An unexpected error occurred";
        return new Response(
            JSON.stringify({ error: msg }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
