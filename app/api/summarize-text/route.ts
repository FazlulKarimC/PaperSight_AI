import { NextRequest } from "next/server";
import { generateContentStreamUsingGemini, type SummaryStyle } from "@/lib/gemini";
import { countWords } from "@/lib/utils";
import { resolveUser } from "@/lib/resolve-user";
import { createSSEStream, SSE_HEADERS } from "@/lib/sse";

/**
 * POST /api/summarize-text
 *
 * Accepts pre-parsed text (from client-side PDF extraction) and streams a Gemini summary.
 * Supports both single and batch (multi-PDF) summaries.
 *
 * Body: { text: string, style?: SummaryStyle, fileNames?: string[] }
 */

export const maxDuration = 60;

// Limits
const MAX_TEXT_CHARS = 500_000; // ~100k words
const MAX_TEXT_WORDS = 100_000;

export async function POST(req: NextRequest) {
    try {
        // Resolve user (Clerk or guest) with rate limiting
        const userResult = await resolveUser(req);
        if (userResult instanceof Response) return userResult;

        const body = await req.json();
        const { text, style = "viral", fileNames = [] } = body as {
            text: string;
            style?: SummaryStyle;
            fileNames?: string[];
        };

        if (!text || text.trim().length === 0) {
            return new Response(
                JSON.stringify({ error: "No text content provided. The PDFs may contain only images or scanned pages." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Validate text size
        const wordCount = countWords(text);

        if (text.length > MAX_TEXT_CHARS || wordCount > MAX_TEXT_WORDS) {
            return new Response(
                JSON.stringify({
                    error: `Combined PDF text is too large (${wordCount.toLocaleString()} words). Maximum is ${MAX_TEXT_WORDS.toLocaleString()} words for the free tier. Try with fewer or smaller PDFs.`,
                    code: "CONTEXT_TOO_LARGE",
                }),
                { status: 413, headers: { "Content-Type": "application/json" } }
            );
        }

        const originalWordCount = wordCount;

        // Build prompt with file context if multiple files
        let promptText = text;
        if (fileNames.length > 1) {
            promptText = `The following text is extracted from ${fileNames.length} PDF documents: ${fileNames.join(", ")}. Please create a unified summary covering all documents.\n\n${text}`;
        }

        // Stream Gemini summary
        const stream = await generateContentStreamUsingGemini(promptText, style);

        // Create SSE stream with metadata
        const sseStream = createSSEStream(stream, {
            metadata: () => ({ originalWordCount, fileCount: fileNames.length }),
        });

        const headers = new Headers(SSE_HEADERS);
        for (const cookie of userResult.cookieHeaders) {
            headers.append("Set-Cookie", cookie);
        }

        return new Response(sseStream, { headers });
    } catch (error) {
        console.error("Error in summarize-text stream:", error);
        const msg = error instanceof Error ? error.message : "An unexpected error occurred";
        return new Response(
            JSON.stringify({ error: msg }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
