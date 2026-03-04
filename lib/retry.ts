/**
 * Shared retry utility with exponential backoff.
 * Handles free-tier API 503/429 errors from Gemini and similar services.
 */
export async function withRetry<T>(
    fn: () => Promise<T>,
    retries = 3,
    delayMs = 1000
): Promise<T> {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error: unknown) {
            const errObj = error as { status?: number; toString?: () => string };
            const errStr = typeof errObj?.toString === "function" ? errObj.toString() : "";
            const isRetryable =
                errObj?.status === 503 ||
                errObj?.status === 429 ||
                errStr.includes("503") ||
                errStr.includes("UNAVAILABLE");
            if (!isRetryable || i === retries - 1) throw error;

            console.warn(
                `[GEMINI API] 503/429 Model overloaded. Retrying in ${delayMs / 1000}s... (Attempt ${i + 1}/${retries})`
            );
            await new Promise((resolve) => setTimeout(resolve, delayMs));
            delayMs *= 2; // exponential backoff
        }
    }
    throw new Error("Max retries exceeded");
}
