/**
 * Server-side SSE stream helpers
 *
 * Creates a ReadableStream that emits Server-Sent Events from a Gemini streaming response.
 * Consolidates the SSE encoding pattern used across /api/summarize, /api/summarize-text, and /api/chat.
 */

const encoder = new TextEncoder();

function sseEvent(data: Record<string, unknown>): Uint8Array {
    return encoder.encode(`data: ${JSON.stringify(data)}\n\n`);
}

type SSEEventHandlers = {
    /** Called before streaming starts. Return metadata payload to send as first event. */
    metadata?: () => Record<string, unknown>;
};

/**
 * Creates a ReadableStream that wraps a Gemini streaming response as SSE events.
 *
 * Usage:
 * ```ts
 * const stream = await generateContentStreamUsingGemini(text, style);
 * return new Response(
 *     createSSEStream(stream, { metadata: () => ({ originalWordCount: 1234 }) }),
 *     { headers: SSE_HEADERS }
 * );
 * ```
 */
export function createSSEStream(
    geminiStream: ReadableStream<string>,
    handlers?: SSEEventHandlers
): ReadableStream<Uint8Array> {
    return new ReadableStream({
        async start(controller) {
            try {
                // Send metadata event if provided
                if (handlers?.metadata) {
                    controller.enqueue(sseEvent({ type: "meta", ...handlers.metadata() }));
                }

                // Stream chunks from the ReadableStream
                const reader = geminiStream.getReader();
                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        if (value) {
                            controller.enqueue(sseEvent({ type: "chunk", text: value }));
                        }
                    }
                } finally {
                    reader.releaseLock();
                }

                // Signal completion
                controller.enqueue(sseEvent({ type: "done" }));
            } catch (err) {
                const message = err instanceof Error ? err.message : "Streaming error";
                controller.enqueue(sseEvent({ type: "error", error: message }));
            } finally {
                controller.close();
            }
        },
    });
}

/**
 * Standard SSE response headers
 */
export const SSE_HEADERS: HeadersInit = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
};
