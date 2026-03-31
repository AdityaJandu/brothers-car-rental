"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft, Car, LayoutDashboard, Users, CalendarDays, Settings } from "lucide-react";

interface HeaderAdminProps {
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

export function HeaderAdmin({ session }: HeaderAdminProps) {
    const pathname = usePathname();
    const user = session?.user;

    const adminNav = [
        { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { name: "Fleet", href: "/fleet", icon: Car },
        { name: "Bookings", href: "/bookings", icon: CalendarDays },
        { name: "Customers", href: "/customers", icon: Users },
        { name: "Settings", href: "/settings", icon: Settings },
    ];

    return (
        <header className="w-full sticky top-0 z-50 bg-[#0A0F1C] text-slate-200 border-b border-slate-800 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between px-6 py-4 gap-4">

                {/* Left: Branding & Main Site Link */}
                <div className="flex items-center gap-6">
                    <Link href="/admin/dashboard" className="flex items-center gap-2">
                        <span className="text-xl font-bold text-white tracking-tight">
                            Brothers <span className="text-indigo-400 font-normal">Admin</span>
                        </span>
                    </Link>

                    <div className="hidden md:block h-5 w-px bg-slate-700"></div>

                    <Link href="/">
                        <Button variant="link" className="text-slate-400 hover:text-white px-0 h-auto gap-2">
                            <ArrowLeft size={14} />
                            View Main Site
                        </Button>
                    </Link>
                </div>

                {/* Center: Admin Navigation (Desktop) */}
                <nav className="hidden md:flex gap-1 items-center bg-slate-900/50 p-1 rounded-lg border border-slate-800">
                    {adminNav.map((item) => {
                        const Icon = item.icon;
                        // Match exact path OR sub-paths (e.g., active on both /admin/fleet AND /admin/fleet/new)
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                        return (
                            <Link key={item.name} href={item.href}>
                                <div className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                                    isActive
                                        ? "bg-indigo-500/10 text-indigo-400"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                                )}>
                                    <Icon size={16} />
                                    {item.name}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Right: User Profile Indicator */}
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex flex-col items-end">
                        <span className="text-sm font-medium text-white">
                            {user?.name || "Admin User"}
                        </span>
                        {/* Dynamic Role Badge */}
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded mt-0.5 border border-indigo-500/20">
                            {user?.role || "Admin"}
                        </span>
                    </div>

                    {/* Dynamic Avatar (Uses image from DB, or falls back to Initial) */}
                    {user?.image ? (
                        <img
                            src={user.image}
                            alt={user.name || "Profile"}
                            className="h-9 w-9 rounded-full object-cover border border-slate-700"
                            referrerPolicy="no-referrer"
                        />
                    ) : (
                        <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold border border-indigo-400">
                            {user?.name?.charAt(0).toUpperCase() || "A"}
                        </div>
                    )}
                </div>

            </div>

            {/* Mobile Navigation (Scrollable row under main header) */}
            <nav className="md:hidden flex overflow-x-auto gap-2 px-6 pb-4 scrollbar-hide">
                {adminNav.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                        <Link key={item.name} href={item.href} className="shrink-0">
                            <div className={cn(
                                "px-4 py-2 rounded-full text-xs font-medium border",
                                isActive
                                    ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
                                    : "bg-slate-900 border-slate-800 text-slate-400"
                            )}>
                                {item.name}
                            </div>
                        </Link>
                    );
                })}
            </nav>
        </header>
    );
}