import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";

export async function AuthButtons() {
    // 1. Fetch the session
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const isLoggedIn = !!session;
    const userRole = session?.user?.role;

    // 2. Determine routing and text logic cleanly
    let primaryHref = "/sign-up";
    let primaryText = "Get Started";

    if (isLoggedIn) {
        if (userRole === "admin") {
            primaryHref = "/admin/dashboard";
            primaryText = "Go to Dashboard";
        } else {
            // Standard logged-in user
            primaryHref = "/browse";
            primaryText = "Browse Fleet";
        }
    }

    return (
        <div className="flex flex-wrap items-center gap-4">
            {/* Primary Action Button */}
            <Link href={primaryHref}>
                <Button className="btn-executive-primary h-14 rounded-md px-8 text-base">
                    {primaryText}
                </Button>
            </Link>

            {/* Secondary Action Button */}
            <Link href={isLoggedIn ? "/browse" : "/sign-in"}>
                <Button
                    variant="outline"
                    className="h-14 px-8 text-base bg-white font-medium text-primary rounded-md hover:bg-muted/50 transition-colors"
                >
                    View Fleet
                </Button>
            </Link>
        </div>
    );
}

// Optional: A fallback skeleton to show for the 100ms it takes to check auth
export function AuthButtonsSkeleton() {
    return (
        <div className="flex flex-wrap items-center gap-4">
            <div className="h-14 w-40 bg-muted animate-pulse rounded-md" />
            <div className="h-14 w-40 bg-muted animate-pulse rounded-md" />
        </div>
    );
}