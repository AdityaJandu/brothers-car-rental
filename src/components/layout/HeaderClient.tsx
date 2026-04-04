"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface HeaderClientProps {
    session: {
        user?: {
            id: string;
            email: string;
            name?: string | null;
            image?: string | null;
            role?: string | null;
        };
    } | null;
}

export function HeaderClient({ session }: HeaderClientProps) {
    const pathname = usePathname();
    const router = useRouter();

    const isLoggedIn = !!session?.user;
    const user = session?.user;

    // Added requireAuth flag so guests can still click "Browse"
    const navItems = [
        { name: "Home", href: "/", requireAuth: false },
        { name: "Browse", href: "/browse", requireAuth: false },
        { name: "Bookings", href: "/bookings", requireAuth: true },
        { name: "Profile", href: "/profile", requireAuth: true },
    ];

    return (
        <header className="w-full sticky top-0 z-50 bg-background/70 backdrop-blur-xl">
            <div className="flex items-center justify-between px-6 py-5 lg:px-12 lg:py-6">

                {/* Logo */}
                <TooltipProvider>
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
                </TooltipProvider>

                {/* Nav */}
                <nav className="hidden md:flex gap-8 text-sm font-medium text-primary">
                    {navItems.map((item) => {
                        if (item.href === "/") return null;

                        const isActive = pathname === item.href;

                        // If the route requires auth and they aren't logged in, redirect to sign-in
                        const targetHref = item.requireAuth && !isLoggedIn ? "/sign-in" : item.href;

                        return (
                            <Link
                                prefetch
                                key={item.name}
                                href={targetHref}
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
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded mt-0.5 border border-indigo-500/20">
                                {user?.name || "User"}
                            </span>

                            {/* Dynamic Avatar (Uses image from DB, or falls back to Initial) */}
                            {user?.image ? (
                                <Link href={"/profile"}>
                                    <Avatar className="size-9" >
                                        <AvatarImage src={user.image} />
                                        <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </Link>
                            ) : (
                                <Link href={"/profile"}>
                                    <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold border border-indigo-400">
                                        {user?.name?.charAt(0).toUpperCase() || "A"}
                                    </div>
                                </Link>
                            )}
                        </div>
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