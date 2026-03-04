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
        } catch (error: any) {
            const isRetryable =
                error?.status === 503 ||
                error?.status === 429 ||
                error?.toString().includes("503") ||
                error?.toString().includes("UNAVAILABLE");
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
