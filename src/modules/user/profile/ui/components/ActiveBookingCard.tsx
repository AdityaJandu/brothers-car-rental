import { Calendar, MapPin, CarFront } from "lucide-react";
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

// Helper to display the correct badge text based on DB status
const getStatusLabel = (status?: string | null) => {
    switch (status) {
        case "pending": return "Pending Approval";
        case "confirmed": return "Current Rental";
        case "completed": return "Completed";
        case "cancelled": return "Cancelled";
        default: return "Active Booking";
    }
};

export const ActiveBookingCard = () => {
    const trpc = useTRPC();
    const { data: latestBooking, isLoading } = useQuery(
        trpc.userBookings.getLatestBooking.queryOptions()
    );

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl p-4 lg:col-span-2 shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-6 items-center animate-pulse">
                <div className="w-full sm:w-1/2 min-h-55 h-48 bg-slate-100 rounded-xl" />
                <div className="w-full sm:w-1/2 flex flex-col gap-3 py-4 pr-4">
                    <div className="h-6 bg-slate-100 rounded w-3/4" />
                    <div className="h-4 bg-slate-100 rounded w-1/2" />
                    <div className="h-4 bg-slate-100 rounded w-2/3 mt-4" />
                    <div className="h-4 bg-slate-100 rounded w-2/3" />
                    <div className="h-12 bg-slate-100 rounded-xl mt-auto" />
                </div>
            </div>
        );
    }

    if (!latestBooking || !latestBooking.car) {
        return (
            <div className="bg-white rounded-2xl p-4 lg:col-span-2 shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-6 items-center">
                <div className="relative w-full sm:w-1/2 h-48 sm:h-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl overflow-hidden min-h-55 flex items-center justify-center">
                    <span className="bg-white/90 backdrop-blur text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest text-slate-500 shadow-sm">
                        No Active Booking
                    </span>
                </div>
                <div className="w-full sm:w-1/2 flex flex-col py-4 pr-4">
                    <h3 className="text-xl font-bold text-[#0F172A]">No Active Booking</h3>
                    <p className="text-slate-500 text-sm mb-6 mt-1">
                        Book a car to see your active rental here
                    </p>
                    <Button
                        asChild
                        variant="outline"
                        className="w-full border-2 border-[#1E293B] text-[#1E293B] hover:bg-slate-50 font-bold h-12 rounded-xl mt-auto"
                    >
                        <Link href="/browse">
                            Browse Cars
                        </Link>
                    </Button>
                </div>
            </div>
        );
    };

    const { car, booking } = latestBooking;

    return (
        <div className="bg-white rounded-2xl p-4 lg:col-span-2 shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-6 items-center group transition-all hover:border-slate-200">
            <div className="relative w-full sm:w-1/2 h-48 sm:h-full bg-slate-100 rounded-xl overflow-hidden min-h-55">
                <span className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest text-[#0F172A] shadow-sm">
                    {getStatusLabel(latestBooking.booking.status)}
                </span>
                {latestBooking.car.headerImage ? (
                    <Image
                        src={latestBooking.car.headerImage}
                        alt={latestBooking.car.name ?? "Rental car"}
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
                        <span className="text-sm font-medium text-slate-700 truncate" title={booking.dropOffLocation || booking.pickUpLocation || "See booking details"}>
                            {booking.dropOffLocation || booking.pickUpLocation || "See booking details"}
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