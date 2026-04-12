"use client";

import { Button } from "@/components/ui/button";
import { CarGetOne } from "@/modules/user/browse/types";
import Link from "next/link";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock } from "lucide-react";
import { format } from "date-fns";
import { useMemo } from "react";

interface PricingCarProps {
    car: CarGetOne
}

export const PricingCard = ({ car }: PricingCarProps) => {
    const trpc = useTRPC();

    // Fetch unavailable dates to determine current availability
    const { data: unavailableDates } = useQuery(
        trpc.userCheckout.getUnavailableDates.queryOptions({ carId: car.id })
    );

    // Determine if the car is currently available (not blocked today)
    const availabilityInfo = useMemo(() => {
        if (!unavailableDates || unavailableDates.length === 0) {
            return { isAvailableNow: true, nextAvailable: null };
        }

        const now = new Date();
        let isAvailableNow = true;
        let nextAvailable: Date | null = null;

        for (const range of unavailableDates) {
            const start = new Date(range.startDate);
            const end = new Date(range.endDate);

            if (now >= start && now < end) {
                isAvailableNow = false;
                // The car becomes available at the end of this range
                nextAvailable = end;
                break;
            }
        }

        return { isAvailableNow, nextAvailable };
    }, [unavailableDates]);

    return (
        <>
            <div className="bg-[#1E2A44] text-white rounded-md p-7 shadow-2xl font-display">
                {/* Price Section */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <p className="text-sm text-slate-400">Daily Rate</p>

                        <p className="text-4xl font-extrabold">
                            &#8377;{car.pricePerDay}
                            <span className="text-sm text-slate-400 font-medium"> /day</span>
                        </p>
                    </div>
                </div>

                {/* Info */}
                <div className="space-y-4 text-sm mb-8">
                    {/* Availability Indicator */}
                    <div className="flex justify-between items-center border-t border-white/10 pt-4">
                        <span className="text-slate-400">Availability</span>
                        {availabilityInfo.isAvailableNow ? (
                            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Available Now
                            </span>
                        ) : (
                            <span className="flex items-center gap-1.5 text-amber-400 font-medium text-xs">
                                <Clock className="w-3.5 h-3.5" />
                                {availabilityInfo.nextAvailable
                                    ? `From ${format(availabilityInfo.nextAvailable, "MMM dd")}`
                                    : "Currently Booked"
                                }
                            </span>
                        )}
                    </div>

                    <div className="flex justify-between border-t border-white/10 pt-4">
                        <span className="text-slate-400">Status</span>
                        <span className="capitalize">{car.status}</span>
                    </div>

                    <div className="flex justify-between border-t border-white/10 pt-4">
                        <span className="text-slate-400">Plate</span>

                        <span>{car.plateNumber}</span>
                    </div>

                    {/* TODO: add insurance field in DB */}
                    <div className="flex justify-between border-t border-white/10 pt-4">
                        <span className="text-slate-400">Insurance</span>
                        <span>Included</span>
                    </div>
                </div>

                <Link href={`/check-out/${car.id}`}>
                    <Button className="w-full h-16 bg-[#FF8C00] hover:bg-[#E67E00] text-white text-lg font-bold rounded-md shadow-lg transition-all">
                        Book Now
                    </Button>
                </Link>

                <p className="text-xs text-center text-slate-400 mt-4">
                    No hidden fees • 24/7 concierge support
                </p>


            </div>

            {/* Little space so that doesn't mess up with the nav bar */}
            <div className="pb-10 md:hidden" ></div>
        </>

    );
};