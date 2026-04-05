import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

/**
 * Auth endpoints — IP-based, used in Next.js edge middleware
 * 10 requests per 60 seconds (sliding window)
 */
export const authRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "60 s"),
    analytics: true,
    prefix: "rl:auth",
});

/**
 * General tRPC procedures — user-based
 * 30 requests per 60 seconds (fixed window)
 */
export const generalRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(30, "60 s"),
    analytics: true,
    prefix: "rl:trpc",
});

/**
 * Booking mutation — stricter, user-based
 * 5 bookings per 60 seconds (fixed window)
 */
export const bookingRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(5, "60 s"),
    analytics: true,
    prefix: "rl:booking",
});
