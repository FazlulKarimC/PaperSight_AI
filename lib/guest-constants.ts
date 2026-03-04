/**
 * Shared guest rate limit constants.
 * Used by both server-side (guest-rate-limit.ts) and client-side (guest-rate-limit-client.ts).
 * This file must NOT import any server-only modules (e.g. next/headers).
 */

export const RATE_LIMIT_COOKIE = "guestUsage";
export const GUEST_COOKIE_NAME = "guestId";
export const GUEST_PREFIX = "guest-";

export const MAX_GUEST_SUMMARIES_PER_DAY = 10;
export const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface GuestUsage {
    count: number;
    resetAt: string; // ISO timestamp
}

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    limit: number;
}
