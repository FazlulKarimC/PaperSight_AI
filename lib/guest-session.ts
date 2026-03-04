import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { GUEST_COOKIE_NAME, GUEST_PREFIX } from "./guest-constants";

// ── Constants ──────────────────────────────────────────────────────
const GUEST_COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

// ── Helpers ────────────────────────────────────────────────────────

/** Check if a userId belongs to a guest */
export function isGuestUser(userId: string): boolean {
    return userId.startsWith(GUEST_PREFIX);
}

/**
 * Server-side: Read or create a guestId from cookies.
 * Call this in API routes / server components.
 */
export async function getOrCreateGuestId(): Promise<string> {
    const cookieStore = await cookies();
    const existing = cookieStore.get(GUEST_COOKIE_NAME)?.value;

    if (existing && existing.startsWith(GUEST_PREFIX)) {
        return existing;
    }

    return `${GUEST_PREFIX}${uuidv4()}`;
}

/**
 * Helper to build a Set-Cookie header value for the guestId.
 * Use this when returning a Response from API routes.
 */
export function buildGuestIdCookieHeader(guestId: string): string {
    return `${GUEST_COOKIE_NAME}=${guestId}; Path=/; Max-Age=${GUEST_COOKIE_MAX_AGE}; SameSite=Lax`;
}
