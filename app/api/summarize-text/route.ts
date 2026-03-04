import { NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { generateContentStreamUsingGemini, type SummaryStyle } from "@/lib/gemini";
import { getOrCreateGuestId, buildGuestIdCookieHeader } from "@/lib/guest-session";
import { checkGuestRateLimit, buildIncrementedUsageCookieHeaderFrom } from "@/lib/guest-rate-limit";

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
    const responseCookies: string[] = [];

    try {
        // Resolve userId: Clerk auth for signed-in users, cookie for guests
        const { userId: clerkUserId } = getAuth(req);
        let userId = clerkUserId;

        if (!userId) {
            // Guest user — rate limit check
            const rateLimit = await checkGuestRateLimit();
            if (!rateLimit.allowed) {
                return new Response(
                    JSON.stringify({
                        error: "Daily limit reached (10/day). Try again tomorrow or sign in for unlimited access!",
                        code: "RATE_LIMIT_EXCEEDED",
                    }),
                    { status: 429, headers: { "Content-Type": "application/json" } }
                );
            }

            userId = await getOrCreateGuestId();
            responseCookies.push(buildGuestIdCookieHeader(userId));

            const existingUsage = req.cookies.get("guestUsage")?.value;
            responseCookies.push(buildIncrementedUsageCookieHeaderFrom(existingUsage));
        }

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
        const wordCount = text.split(/\s+/).filter(Boolean).length;

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

        const encoder = new TextEncoder();
        const sseStream = new ReadableStream({
            async start(controller) {
                // Send metadata
                controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ type: "meta", originalWordCount, fileCount: fileNames.length })}\n\n`)
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

        const headers = new Headers({
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        });
        for (const cookie of responseCookies) {
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
