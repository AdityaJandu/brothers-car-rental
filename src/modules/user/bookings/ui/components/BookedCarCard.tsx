"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Zap, BatteryCharging, Gauge, Users, Car } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

interface BookedCarCardProps {
    carId: string;
}

export const BookedCarCard = ({ carId }: BookedCarCardProps) => {
    const trpc = useTRPC();
    
    const { data: car, isLoading, error } = useQuery(
        trpc.userBrowse.getOne.queryOptions({
            id: carId
        })
    );

    if (isLoading) {
        return (
            <div className="bg-white rounded-3xl p-2 pb-6 shadow-sm border border-slate-100">
                <Skeleton className="w-full h-[300px] rounded-2xl" />
                <div className="grid grid-cols-4 gap-3 mt-4 px-4">
                    <Skeleton className="h-[80px] rounded-xl" />
                    <Skeleton className="h-[80px] rounded-xl" />
                    <Skeleton className="h-[80px] rounded-xl" />
                    <Skeleton className="h-[80px] rounded-xl" />
                </div>
            </div>
        );
    }

    if (error || !car) {
        return (
             <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center justify-center h-[300px]">
                 <div className="flex flex-col items-center text-slate-400">
                     <Car className="w-10 h-10 mb-2" />
                     <p className="font-medium">Car details unavailable</p>
                 </div>
             </div>
        );
    }

    return (
        <div className="bg-white rounded-[32px] p-2 pb-5 shadow-sm border border-slate-100/60">
            {/* Hero Image Section */}
            <div className="relative w-full h-[280px] sm:h-[350px] rounded-[28px] overflow-hidden">
                <Image 
                    src={car.headerImage} 
                    alt={`${car.make} ${car.model}`}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F3B]/90 via-[#0B0F3B]/30 to-transparent" />
                
                <div className="absolute bottom-6 left-8 right-8">
                    <h2 className="text-white text-3xl sm:text-[40px] font-bold tracking-tight mb-1 leading-none shadow-sm">
                        {car.make} {car.model}
                    </h2>
                    <p className="text-white/80 font-medium text-sm sm:text-base">
                        {car.year} • {car.tier} {car.category}
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 px-3">
                
                <div className="bg-[#F8F9FA] rounded-2xl p-4 flex flex-col justify-center">
                    <Zap className="w-5 h-5 text-[#FF8C00] mb-2" />
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Transmission</span>
                    <span className="font-bold text-[#0B0F3B] capitalize text-sm">{car.transmission}</span>
                </div>

                <div className="bg-[#F8F9FA] rounded-2xl p-4 flex flex-col justify-center">
                    <BatteryCharging className="w-5 h-5 text-[#D94444] mb-2" />
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Fuel Type</span>
                    <span className="font-bold text-[#0B0F3B] capitalize text-sm">{car.fuelType}</span>
                </div>

                <div className="bg-[#F8F9FA] rounded-2xl p-4 flex flex-col justify-center">
                    <Gauge className="w-5 h-5 text-[#4B5DE4] mb-2" />
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Category</span>
                    <span className="font-bold text-[#0B0F3B] capitalize text-sm">{car.category}</span>
                </div>

                <div className="bg-[#F8F9FA] rounded-2xl p-4 flex flex-col justify-center">
                    <Users className="w-5 h-5 text-amber-700 mb-2" />
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Capacity</span>
                    <span className="font-bold text-[#0B0F3B] capitalize text-sm">{car.seats} Seats</span>
                </div>

            </div>
        </div>
    );
};
