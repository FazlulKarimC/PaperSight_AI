/**
 * Server-side guest rate limit utilities.
 * This file uses `next/headers` and can ONLY be imported in server components / API routes.
 * For client-side checks, use "@/lib/guest-rate-limit-client".
 */

import { cookies } from "next/headers";
import {
    RATE_LIMIT_COOKIE,
    MAX_GUEST_SUMMARIES_PER_DAY,
    WINDOW_MS,
    type GuestUsage,
    type RateLimitResult,
} from "@/lib/guest-constants";

export type { RateLimitResult };

// ── Server-side check ──────────────────────────────────────────────

/**
 * Server-side: Check if a guest has remaining quota.
 * Reads the `guestUsage` cookie.
 */
export async function checkGuestRateLimit(): Promise<RateLimitResult> {
    const cookieStore = await cookies();
    const raw = cookieStore.get(RATE_LIMIT_COOKIE)?.value;

    if (!raw) {
        return { allowed: true, remaining: MAX_GUEST_SUMMARIES_PER_DAY, limit: MAX_GUEST_SUMMARIES_PER_DAY };
    }

    try {
        const usage: GuestUsage = JSON.parse(raw);
        const resetTime = new Date(usage.resetAt).getTime();

        // Window expired — reset
        if (Date.now() >= resetTime) {
            return { allowed: true, remaining: MAX_GUEST_SUMMARIES_PER_DAY, limit: MAX_GUEST_SUMMARIES_PER_DAY };
        }

        const remaining = Math.max(0, MAX_GUEST_SUMMARIES_PER_DAY - usage.count);
        return { allowed: remaining > 0, remaining, limit: MAX_GUEST_SUMMARIES_PER_DAY };
    } catch {
        // Corrupted cookie — allow and reset
        return { allowed: true, remaining: MAX_GUEST_SUMMARIES_PER_DAY, limit: MAX_GUEST_SUMMARIES_PER_DAY };
    }
}

/**
 * Build a Set-Cookie header that increments the guest usage counter.
 * Reads existing usage from the raw cookie value and increments by 1.
 */
export function buildIncrementedUsageCookieHeaderFrom(existingRaw: string | undefined): string {
    let count = 1;
    let resetAt = new Date(Date.now() + WINDOW_MS).toISOString();

    if (existingRaw) {
        try {
            const existing: GuestUsage = JSON.parse(existingRaw);
            const resetTime = new Date(existing.resetAt).getTime();

            if (Date.now() < resetTime) {
                // Window still active — increment
                count = existing.count + 1;
                resetAt = existing.resetAt; // keep same window
            }
            // else: window expired — start fresh (count=1, new resetAt)
        } catch {
            // Corrupted — start fresh
        }
    }

    const value: GuestUsage = { count, resetAt };
    const maxAge = Math.ceil(WINDOW_MS / 1000);
    return `${RATE_LIMIT_COOKIE}=${encodeURIComponent(JSON.stringify(value))}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}
