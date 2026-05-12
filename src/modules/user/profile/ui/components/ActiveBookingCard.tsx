import { Calendar, MapPin, CarFront, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-GB", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const getStatusLabel = (status?: string | null) => {
    switch (status) {
        case "pending": return "Pending Approval";
        case "confirmed": return "Current Rental";
        case "completed": return "Completed";
        case "cancelled": return "Cancelled";
        default: return "Active Booking";
    }
};

const getStatusColor = (status?: string | null) => {
    switch (status) {
        case "confirmed": return "bg-emerald-50 text-emerald-700 border border-emerald-200";
        case "pending": return "bg-amber-50 text-amber-700 border border-amber-200";
        default: return "bg-white/90 text-[#0F172A]";
    }
};

// ─── Loading skeleton ────────────────────────────────────────────────────────

const LoadingSkeleton = () => (
    <div className="bg-white rounded-2xl p-4 lg:col-span-2 shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-6 items-center animate-pulse">
        <div className="w-full sm:w-1/2 min-h-55 h-48 bg-slate-100 rounded-xl" />
        <div className="w-full sm:w-1/2 flex flex-col gap-3 py-4 pr-4">
            <div className="h-5 bg-slate-100 rounded-full w-24 mb-1" />
            <div className="h-6 bg-slate-100 rounded w-3/4" />
            <div className="h-4 bg-slate-100 rounded w-1/2" />
            <div className="h-4 bg-slate-100 rounded w-2/3 mt-4" />
            <div className="h-4 bg-slate-100 rounded w-2/3" />
            <div className="h-12 bg-slate-100 rounded-xl mt-auto" />
        </div>
    </div>
);

// ─── Empty state ─────────────────────────────────────────────────────────────

const EmptyBookingState = () => (
    <div className="bg-white rounded-2xl p-4 lg:col-span-2 shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-6 items-center overflow-hidden">
        {/* Illustration panel */}
        <div className="relative w-full sm:w-1/2 min-h-55 h-48 sm:h-full rounded-xl overflow-hidden bg-linear-to-br from-slate-50 via-[#FFF7ED] to-slate-100 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-slate-200">
            {/* Animated rings */}
            <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="w-32 h-32 rounded-full border border-slate-200 animate-ping opacity-20 absolute" />
                <span className="w-20 h-20 rounded-full border border-[#FF8C00]/20 animate-ping opacity-30 absolute [animation-delay:0.4s]" />
            </span>
            <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center">
                    <CarFront className="w-8 h-8 text-[#FF8C00]" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    No Active Booking
                </span>
            </div>
        </div>

        {/* Text + CTA panel */}
        <div className="w-full sm:w-1/2 flex flex-col py-4 pr-4">
            <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[#FF8C00]" />
                <span className="text-xs font-semibold text-[#FF8C00] uppercase tracking-widest">
                    Ready to ride?
                </span>
            </div>
            <h3 className="text-xl font-bold text-[#0F172A] leading-snug">
                No current or upcoming bookings
            </h3>
            <p className="text-slate-500 text-sm mt-2 mb-6 leading-relaxed">
                Looks like you&apos;re free! Browse our fleet and lock in your next rental — from sleek sedans to rugged SUVs.
            </p>

            <Button
                asChild
                className="w-full bg-[#0F172A] hover:bg-[#1e293b] text-white font-bold h-12 rounded-xl mt-auto flex items-center gap-2 transition-all"
            >
                <Link href="/browse">
                    Explore our fleet
                    <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
            </Button>
        </div>
    </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

export const ActiveBookingCard = () => {
    const trpc = useTRPC();
    const { data: activeBooking, isLoading } = useQuery(
        trpc.userBookings.getActiveOrUpcomingBooking.queryOptions()
    );

    if (isLoading) return <LoadingSkeleton />;

    if (!activeBooking || !activeBooking.car) return <EmptyBookingState />;

    const { car, booking } = activeBooking;

    return (
        <div className="bg-white rounded-md p-4 lg:col-span-2 shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-6 items-center group transition-all hover:border-slate-200">
            <div className="relative w-full sm:w-1/2 h-48 sm:h-full bg-slate-100 rounded-md overflow-hidden min-h-55">
                <span className={`absolute top-4 left-4 z-10 backdrop-blur text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-widest shadow-sm ${getStatusColor(booking.status)}`}>
                    {getStatusLabel(booking.status)}
                </span>
                {car.headerImage ? (
                    <Image
                        src={car.headerImage}
                        alt={car.name ?? "Rental car"}
                        fill
                        priority
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-sm bg-slate-50">
                        <CarFront className="w-10 h-10 mb-2 opacity-20" />
                        <span>No image available</span>
                    </div>
                )}
            </div>

            <div className="w-full sm:w-1/2 flex flex-col py-4 pr-4">
                <h3 className="text-xl font-bold text-[#0F172A] truncate" title={car.name ?? "Your Vehicle"}>
                    {car.name ?? "Your Vehicle"}
                </h3>
                <p className="text-slate-500 text-sm mb-6 mt-1 capitalize">
                    {car.category ?? "Rental Vehicle"}
                </p>

                <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-[#FF8C00] shrink-0" />
                        <span className="text-sm font-medium text-slate-700">
                            Start: {formatDate(booking.startDate)}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-[#FF8C00] shrink-0" />
                        <span className="text-sm font-medium text-slate-700">
                            Return: {formatDate(booking.endDate)}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-[#FF8C00] shrink-0" />
                        <span className="text-sm font-medium text-slate-700 truncate" title={activeBooking.dropOffLocationName || activeBooking.pickUpLocationName || "See booking details"}>
                            {activeBooking.dropOffLocationName || activeBooking.pickUpLocationName || "See booking details"}
                        </span>
                    </div>
                </div>

                <Button
                    asChild
                    variant="outline"
                    className="w-full border-2 border-[#1E293B] text-[#1E293B] hover:bg-slate-50 font-bold h-12 rounded-xl mt-auto"
                >
                    <Link href={`/bookings/${booking.id}`}>
                        Manage Booking
                    </Link>
                </Button>
            </div>
        </div>
    );
};