"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
    { name: "Home", href: "/" },
    { name: "Browse", href: "/browse" },
    { name: "Bookings", href: "/bookings" },
    { name: "Profile", href: "/profile" },
];

export function Header() {
    const pathname = usePathname();

    return (
        <header className="w-full sticky top-0 z-50 bg-background/70 backdrop-blur-xl">
            <div className="flex items-center justify-between px-6 py-5 lg:px-12 lg:py-6">

                {/* Left */}
                <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-primary font-heading tracking-tight">
                        Brothers
                    </span>
                </div>

                {/* Center Nav */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-primary">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "transition-all duration-300",
                                    isActive
                                        ? "text-secondary border-b-2 border-secondary pb-1"
                                        : "hover:text-accent"
                                )}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right CTA */}
                <div className="flex items-center gap-3">
                    <Button className="btn-primary hidden sm:flex">
                        Get Started
                    </Button>

                    <Button className="btn-primary sm:hidden px-4 py-2 text-sm">
                        Start
                    </Button>
                </div>
            </div>
        </header>
    );
}