import { auth } from '@/lib/auth';
import { initTRPC, TRPCError } from '@trpc/server';
import { headers } from 'next/headers';
import { cache } from 'react';
import { generalRateLimit } from '@/lib/ratelimit';

/**
 * This context creator accepts `headers` so it can be reused in both
 * the RSC server caller (where you pass `next/headers`) and the
 * API route handler (where you pass the request headers).
 */
export const createTRPCContext = async (_opts: { headers: Headers }) => {
    // const user = await auth(opts.headers);
    return { userId: 'user_123' };
};

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC
    .context<Awaited<ReturnType<typeof createTRPCContext>>>()
    .create({
        /**
         * @see https://trpc.io/docs/server/data-transformers
         */
        // transformer: superjson,
    });

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

/**
 * React cache() deduplicates the session fetch within a single server request.
 * This means the tRPC middleware will reuse the session already fetched
 * by the page-level getSession() call, avoiding a redundant DB roundtrip.
 */
const getCachedSession = cache(async () => {
    return auth.api.getSession({
        headers: await headers(),
    });
});

// Create a protected procedure that requires authentication
// using base procedure and middleware -> auth check middleware
// Now at every point we'll use this protectedProcedure, we can be sure the user is authenticated:
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
    const session = await getCachedSession();

    if (!session) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
    }

    return next({ ctx: { ...ctx, auth: session } });
});

/**
 * Rate-limited protected procedure.
 * Applies the general rate limiter (30 req/min) keyed on userId + path.
 * Use this instead of protectedProcedure wherever you want per-user limits.
 */
export const rateLimitedProtectedProcedure = protectedProcedure.use(
    async ({ ctx, path, next }) => {
        const identifier = `${ctx.auth.user.id}:${path}`;
        const { success } = await generalRateLimit.limit(identifier);

        if (!success) {
            throw new TRPCError({
                code: "TOO_MANY_REQUESTS",
                message: "Too many requests. Please slow down and try again shortly.",
            });
        }

        return next({ ctx });
    }
);