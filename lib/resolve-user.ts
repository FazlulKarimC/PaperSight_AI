import { getAuth } from "@clerk/nextjs/server";
import { type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getOrCreateGuestId, buildGuestIdCookieHeader } from "@/lib/guest-session";
import { checkGuestRateLimit, buildIncrementedUsageCookieHeaderFrom } from "@/lib/guest-rate-limit";
import { RATE_LIMIT_COOKIE, type RateLimitResult } from "@/lib/guest-constants";

export interface ResolvedUser {
    userId: string;
    isGuest: boolean;
    /** Extra Set-Cookie headers to include in the response (e.g. guest ID cookie) */
    cookieHeaders: string[];
    /** Rate-limit result — populated for guests, null for authenticated users */
    rateLimit: RateLimitResult | null;
    /** Pre-built usage cookie header for incrementing guest usage after success */
    incrementedUsageCookieHeader: string | null;
}

/**
 * Resolves the current user from a request, supporting both Clerk auth and guest sessions.
 * For guests, also checks rate limits.
 *
 * Returns a ResolvedUser object or a Response (if rate-limited).
 */
export async function resolveUser(req: NextRequest): Promise<ResolvedUser | Response> {
    const { userId: clerkUserId } = getAuth(req);

    // Authenticated user — no rate limiting
    if (clerkUserId) {
        return {
            userId: clerkUserId,
            isGuest: false,
            cookieHeaders: [],
            rateLimit: null,
            incrementedUsageCookieHeader: null,
        };
    }

    // Guest user — check rate limit
    const guestId = await getOrCreateGuestId();
    const rl = await checkGuestRateLimit();

    if (!rl.allowed) {
        return new Response(
            JSON.stringify({ error: `Daily limit reached (${rl.remaining} remaining). Sign in for unlimited access.` }),
            {
                status: 429,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    // Read the raw cookie to increment the usage counter
    const cookieStore = await cookies();
    const existingUsageRaw = cookieStore.get(RATE_LIMIT_COOKIE)?.value;
    const incrementedCookie = buildIncrementedUsageCookieHeaderFrom(existingUsageRaw);

    return {
        userId: guestId,
        isGuest: true,
        cookieHeaders: [buildGuestIdCookieHeader(guestId), incrementedCookie],
        rateLimit: rl,
        incrementedUsageCookieHeader: incrementedCookie,
    };
}
