/**
 * Client-safe guest rate limit utilities.
 * This file contains ONLY client-side functions that can be imported by "use client" components.
 * For server-side rate limit checks, import from "@/lib/guest-rate-limit" directly.
 */

import {
    RATE_LIMIT_COOKIE,
    MAX_GUEST_SUMMARIES_PER_DAY,
    type GuestUsage,
    type RateLimitResult,
} from "@/lib/guest-constants";

export type { RateLimitResult };

/**
 * Client-side: Read the guestUsage cookie and check quota.
 * Call this from components/hooks before starting an upload.
 */
export function checkGuestQuotaClient(): RateLimitResult {
    if (typeof document === "undefined") {
        return { allowed: true, remaining: MAX_GUEST_SUMMARIES_PER_DAY, limit: MAX_GUEST_SUMMARIES_PER_DAY };
    }

    const match = document.cookie
        .split("; ")
        .find((c) => c.startsWith(`${RATE_LIMIT_COOKIE}=`));

    if (!match) {
        return { allowed: true, remaining: MAX_GUEST_SUMMARIES_PER_DAY, limit: MAX_GUEST_SUMMARIES_PER_DAY };
    }

    try {
        const raw = decodeURIComponent(match.split("=").slice(1).join("="));
        const usage: GuestUsage = JSON.parse(raw);
        const resetTime = new Date(usage.resetAt).getTime();

        if (Date.now() >= resetTime) {
            return { allowed: true, remaining: MAX_GUEST_SUMMARIES_PER_DAY, limit: MAX_GUEST_SUMMARIES_PER_DAY };
        }

        const remaining = Math.max(0, MAX_GUEST_SUMMARIES_PER_DAY - usage.count);
        return { allowed: remaining > 0, remaining, limit: MAX_GUEST_SUMMARIES_PER_DAY };
    } catch {
        return { allowed: true, remaining: MAX_GUEST_SUMMARIES_PER_DAY, limit: MAX_GUEST_SUMMARIES_PER_DAY };
    }
}
