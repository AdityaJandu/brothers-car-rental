import Image from "next/image";
import { ChevronsRight, ShieldCheck } from "lucide-react";
import { GetOne } from "@/modules/user/browse/types";

interface SummaryCardProps {
    car: GetOne;
}

export function SummaryCard({ car }: SummaryCardProps) {
    return (
        <div className="flex flex-col gap-4">

            {/* Dark Card */}
            <div className="bg-[#172033] rounded-3xl overflow-hidden shadow-xl border border-slate-800">

                {/* Image */}
                <div className="relative w-full h-56 bg-[#0A0F1A]">
                    <Image
                        src={car.headerImage}
                        alt={car.name}
                        fill
                        loading="eager"
                        className="object-cover opacity-90"
                    />

                    <div className="absolute inset-0 bg-linear-to-t from-[#172033] to-transparent" />

                    {/* TODO: replace with car.tier */}
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

                        <p className="text-xs text-slate-400">
                            {car.fuelType.toUpperCase()} • {car.year} {/* DB ✅ */}
                        </p>
                    </div>

                    {/* TODO: replace with real booking dates */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="text-sm text-slate-400">
                            Select dates to calculate price
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="flex flex-col gap-3 pt-6 border-t border-slate-700/60 mb-6">

                        {/* TODO: dynamic days */}
                        <div className="flex justify-between">
                            <span className="text-slate-400">
                                Daily Rate
                            </span>
                            <span className="text-white font-bold">
                                ${car.pricePerDay}
                            </span>
                        </div>

                        {/* TODO: move to DB */}
                        <div className="flex justify-between">
                            <span className="text-slate-400">Insurance</span>
                            <span className="text-white">Included</span>
                        </div>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center pt-5 border-t border-slate-700/60">
                        <span className="text-lg font-bold text-white">
                            Total Price
                        </span>

                        {/* TODO: dynamic calculation */}
                        <span className="text-3xl font-extrabold text-[#D97706]">
                            ${car.pricePerDay}
                        </span>
                    </div>

                </div>
            </div>

            {/* Refund Notice */}
            <div className="bg-[#F8F9FA] border rounded-xl p-4 flex gap-3">
                <ShieldCheck className="w-5 h-5 text-[#D97706]" />

                {/* TODO: move to config */}
                <p className="text-xs text-slate-600">
                    Full refund available if cancelled 24 hours prior.
                </p>
            </div>

            <div className="pb-8 md:hidden"></div>
        </div>
    );
}