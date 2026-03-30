"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";



interface HeaderClientProps {
    session: {
        user?: {
            id: string;
            email: string;
            name?: string | null;
            image?: string | null;
        };
    } | null;
}

export function HeaderClient({ session }: HeaderClientProps) {
    const pathname = usePathname();
    const router = useRouter();

    const isLoggedIn = !!session?.user;

    const navItems = [
        { name: "Home", href: "/" },
        { name: "Browse", href: "/browse" },
        { name: "Bookings", href: "/bookings" },
        { name: "Profile", href: "/profile" },
    ];

    return (
        <header className="w-full sticky top-0 z-50 bg-background/70 backdrop-blur-xl">
            <div className="flex items-center justify-between px-6 py-5 lg:px-12 lg:py-6">

                {/* Logo */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link href="/">
                            <span className="text-2xl font-bold text-primary font-heading">
                                Brothers
                            </span>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Home</p>
                    </TooltipContent>
                </Tooltip>

                {/* Nav */}
                <nav className="hidden md:flex gap-8 text-sm font-medium text-primary">
                    {navItems.map((item) => {
                        if (item.href === "/") return null;

                        const isActive = pathname === item.href;
                        return (
                            <Link
                                prefetch
                                key={item.name}
                                href={isLoggedIn ? item.href : "/sign-in"}
                                className={cn(
                                    "transition-all duration-300",
                                    isActive
                                        ? "text-secondary border-b-2 border-secondary pb-1"
                                        : "hover:text-ring"
                                )}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* CTA */}
                <div className="flex gap-3">
                    {isLoggedIn ? (
                        <Button onClick={() => router.push("/profile")}>
                            Dashboard
                        </Button>
                    ) : (
                        <>
                            <Button
                                variant="outline"
                                onClick={() => router.push("/sign-in")}
                            >
                                Sign In
                            </Button>
                            <Button onClick={() => router.push("/sign-up")}>
                                Get Started
                            </Button>
                        </>
                    )}
                </div>

            </div>
        </header>
    );
}