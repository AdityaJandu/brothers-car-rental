import { NextRequest, NextResponse } from "next/server";
import { authRateLimit } from "@/lib/ratelimit";

export async function rateLimitMiddleware(req: NextRequest): Promise<NextResponse> {
    // Rate limit auth endpoints only
    if (req.nextUrl.pathname.startsWith("/api/auth")) {
        // Prefer real IP from proxy header (Vercel, Cloudflare, etc.)
        const ip =
            req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
            req.headers.get("x-real-ip") ??
            "127.0.0.1";

        const { success, limit, remaining, reset } = await authRateLimit.limit(ip);

        if (!success) {
            return new NextResponse(
                JSON.stringify({
                    error: "Too many requests",
                    message: "You have exceeded the rate limit. Please try again later.",
                }),
                {
                    status: 429,
                    headers: {
                        "Content-Type": "application/json",
                        "X-RateLimit-Limit": limit.toString(),
                        "X-RateLimit-Remaining": remaining.toString(),
                        "X-RateLimit-Reset": reset.toString(),
                        "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
                    },
                }
            );
        }
    }

    return NextResponse.next();
}

// This tells Next.js to run the middleware for all requests that match the pattern.
// Important line:
export const config = {
    matcher: ["/api/auth/:path*"],
};
