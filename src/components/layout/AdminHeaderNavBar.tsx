"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Car, LayoutDashboard, CalendarDays, PlusCircle, ShieldAlert, MapPin } from "lucide-react";

export function AdminNavbar() {
    const pathname = usePathname();

    const navLinks = [
        {
            name: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard
        },
        {
            name: "Bookings",
            href: "/admin-booking",
            icon: CalendarDays
        },
        {
            name: "Add Vehicle",
            href: "/add-car",
            icon: PlusCircle
        },
        {
            name: "Hubs",
            href: "/admin-locations",
            icon: MapPin
        },
        {
            name: "Audit Logs",
            href: "/audit-log",
            icon: ShieldAlert
        }
    ];

    return (
        <>
            {/* TOP HEADER (Shared by Desktop & Mobile) */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
                <div className="flex h-16 items-center justify-between px-4 md:px-8 max-w-7xl mx-auto">

                    {/* BRANDING LOGO */}
                    <Link href="/dashboard" className="flex items-center gap-2 group transition-transform hover:scale-105">
                        <div className="bg-[#172033] p-1.5 rounded-md shadow-sm group-hover:bg-[#0B0F3B] transition-colors">
                            <Car className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-extrabold text-lg leading-none tracking-tight text-[#0B0F3B]">
                                FleetAdmin
                            </span>
                            <span className="text-[9px] font-bold text-[#D97706] uppercase tracking-widest mt-0.5">
                                Management
                            </span>
                        </div>
                    </Link>

                    {/* DESKTOP NAVIGATION (Hidden on Mobile) */}
                    <nav className="hidden md:flex items-center gap-1 h-full absolute left-1/2 -translate-x-1/2">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            // Check if exact match OR sub-page (e.g., /dashboard/edit/1)
                            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    prefetch={true}
                                    className={cn(
                                        "flex items-center gap-2 px-4 h-full text-sm font-semibold transition-all relative group",
                                        isActive
                                            ? "text-[#0B0F3B]"
                                            : "text-slate-500 hover:text-[#0B0F3B] hover:bg-slate-50"
                                    )}
                                >
                                    <Icon className={cn("h-4 w-4 transition-colors", isActive ? "text-[#D97706]" : "text-slate-400 group-hover:text-[#0B0F3B]")} />
                                    {link.name}

                                    {/* Desktop Active Bottom Border Indicator */}
                                    {isActive && (
                                        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#D97706] rounded-t-full shadow-[0_-2px_10px_rgba(217,119,6,0.3)]" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* PROFILE/SETTINGS */}
                    <div className="flex items-center gap-3">
                        <div className="flex-col text-right hidden sm:flex">
                            <span className="text-sm font-bold text-[#0B0F3B] leading-none">Aditya</span>
                            <span className="text-[10px] text-slate-500 font-medium">Super Admin</span>
                        </div>
                        {/* Profile Avatar */}
                        <div className="h-9 w-9 rounded-full bg-slate-100 border-2 border-white shadow-sm ring-1 ring-slate-200 flex items-center justify-center text-[#0B0F3B] font-bold overflow-hidden cursor-pointer hover:ring-slate-300 transition-all">
                            <ShieldAlert className="h-4 w-4 text-slate-400" />
                        </div>
                    </div>
                </div>
            </header>

            {/* MOBILE BOTTOM NAVIGATION (Hidden on Desktop) */}
            {/* pb-[env(safe-area-inset-bottom)] ensures it doesn't overlap with iPhone home bars */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] pb-[env(safe-area-inset-bottom)]">
                <div className="flex items-center justify-around h-16 px-2">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                                    isActive
                                        ? "text-[#D97706]"
                                        : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                <div className={cn(
                                    "p-1.5 rounded-full transition-all duration-300",
                                    isActive ? "bg-orange-50" : "bg-transparent"
                                )}>
                                    <Icon className={cn("h-5 w-5", isActive ? "text-[#D97706] drop-shadow-sm" : "")} />
                                </div>
                                <span className={cn(
                                    "text-[10px] font-semibold transition-all",
                                    isActive ? "text-[#D97706]" : "text-slate-500"
                                )}>
                                    {link.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}