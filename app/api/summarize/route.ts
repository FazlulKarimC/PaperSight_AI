import { NextRequest } from "next/server";
import { generateContentStreamUsingGemini, type SummaryStyle } from "@/lib/gemini";
import parse from "@/lib/parse";
import { countWords } from "@/lib/utils";
import { resolveUser } from "@/lib/resolve-user";
import { createSSEStream, SSE_HEADERS } from "@/lib/sse";

// Use Node.js runtime (not edge) because PDF parsing needs node:module
export const maxDuration = 60;

export async function POST(req: NextRequest) {
    try {
        // Resolve user (Clerk or guest) with rate limiting
        const userResult = await resolveUser(req);
        if (userResult instanceof Response) return userResult;

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

        const originalWordCount = countWords(pdfText);

        // Get streaming response from Gemini
        const stream = await generateContentStreamUsingGemini(pdfText, style);

        // Create SSE stream with metadata
        const sseStream = createSSEStream(stream, {
            metadata: () => ({ originalWordCount }),
        });

        const headers = new Headers(SSE_HEADERS);
        for (const cookie of userResult.cookieHeaders) {
            headers.append("Set-Cookie", cookie);
        }

        return new Response(sseStream, { headers });
    } catch (error) {
        console.error("Error in summarize stream:", error);
        const msg = error instanceof Error ? error.message : "An unexpected error occurred";
        return new Response(
            JSON.stringify({ error: msg }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
