"use client";

import Image from "next/image";
import { ChevronsRight, ShieldCheck } from "lucide-react";
import { CarGetOne } from "@/modules/user/browse/types";
import { format } from "date-fns";
import { useFormContext } from "react-hook-form";
import * as z from "zod";
import { bookingInsertSchema } from "../../schemas";

interface SummaryCardProps {
    car: CarGetOne;
}

export function SummaryCard({ car }: SummaryCardProps) {
    // Tap into the live form state
    const form = useFormContext<z.infer<typeof bookingInsertSchema>>();

    const startDate = form.watch("startDate");
    const endDate = form.watch("endDate");
    const days = form.watch("days");
    const dailyRate = form.watch("dailyRate");
    const totalPrice = form.watch("totalPrice");

    // Optional: Number formatter for Indian Rupees
    const formatINR = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="flex flex-col gap-4">

            {/* Dark Card */}
            <div className="bg-[#172033] rounded-md overflow-hidden shadow-xl border border-slate-800">

                {/* Image */}
                <div className="relative w-full h-56 bg-[#0A0F1A]">
                    <Image
                        src={car.headerImage}
                        alt={car.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        loading="eager"
                        className="object-cover opacity-90"
                    />

                    <div className="absolute inset-0 bg-linear-to-t from-[#172033] to-transparent" />

                    <div className="absolute bottom-4 left-0 bg-[#D97706] text-white text-[10px] font-bold px-3 py-1.5 rounded-r-md">
                        {car.category}
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 pb-7 pt-2 flex flex-col">

                    {/* Header */}
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold text-white">
                            {car.make} {car.model}
                        </h3>
                        <p className="text-xs text-slate-400 uppercase tracking-wider">
                            {car.fuelType} • {car.year}
                        </p>
                    </div>

                    {/* Dynamic Dates */}
                    <div className="flex items-center justify-between mb-8">
                        {startDate && endDate ? (
                            <>
                                <div className="flex flex-col w-[45%]">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Pick-Up</span>
                                    <span className="text-sm font-bold text-white mb-0.5">{format(startDate, "MMM dd")}</span>
                                </div>
                                <div className="flex items-center justify-center text-[#D97706] px-2">
                                    <ChevronsRight className="w-5 h-5 opacity-70" />
                                </div>
                                <div className="flex flex-col w-[45%] text-right">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Drop-Off</span>
                                    <span className="text-sm font-bold text-white mb-0.5">{format(endDate, "MMM dd")}</span>
                                </div>
                            </>
                        ) : (
                            <div className="text-sm text-slate-400">
                                Select dates to calculate price
                            </div>
                        )}
                    </div>

                    {/* Pricing */}
                    <div className="flex flex-col gap-3 pt-6 border-t border-slate-700/60 mb-6">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400 text-sm">
                                Daily Rate ({days} {days === 1 ? 'day' : 'days'})
                            </span>
                            <span className="text-white font-bold text-sm">
                                {formatINR(dailyRate * days)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400 text-sm">Insurance</span>
                            <span className="text-white text-sm">Included</span>
                        </div>
                        {/* Note: If you want to display protection/surcharge fee lines like earlier, add them here */}
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center pt-5 border-t border-slate-700/60">
                        <span className="text-lg font-bold text-white">
                            Total Price
                        </span>
                        <div className="flex flex-col items-end">
                            <span className="text-3xl font-extrabold text-[#D97706]">
                                {formatINR(totalPrice)}
                            </span>
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                                Taxes Included
                            </span>
                        </div>
                    </div>

                </div>
            </div>

            {/* Refund Notice */}
            <div className="bg-[#F8F9FA] border rounded-md p-4 flex gap-3">
                <ShieldCheck className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600 leading-relaxed">
                    Full refund available if cancelled 24 hours prior to pick-up.
                </p>
            </div>

            <div className="pb-8 md:hidden"></div>
        </div>
    );
}