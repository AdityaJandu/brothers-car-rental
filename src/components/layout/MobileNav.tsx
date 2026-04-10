"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CarFront, Calendar, User } from "lucide-react";

const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Browse", href: "/browse", icon: CarFront },
    { name: "Bookings", href: "/bookings", icon: Calendar },
    { name: "Profile", href: "/profile", icon: User },
];

export function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-6 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] flex justify-between items-center rounded-t-xl bg-white/70 backdrop-blur-xl shadow-[0_-10px_40px_rgba(26,43,72,0.05)]">
            {navItems.map((item) => {
                // FIX: Exact match for home, startsWith for nested routes (like /browse/123)
                const isActive = item.href === "/"
                    ? pathname === "/"
                    : pathname === item.href || pathname.startsWith(item.href + "/");

                const Icon = item.icon;

                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        prefetch={true}
                        aria-current={isActive ? "page" : undefined}
                        className="flex flex-col items-center gap-1 min-w-[64px]"
                    >
                        <div
                            className={`p-2 rounded-md transition-all duration-150 active:scale-90 ${isActive
                                    ? "bg-primary text-white"
                                    : "text-muted-foreground"
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                        </div>

                        <span
                            className={`text-[10px] font-bold uppercase tracking-wider ${isActive
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                }`}
                        >
                            {item.name}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}
