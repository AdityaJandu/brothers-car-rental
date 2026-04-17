import { Zap, BatteryCharging, Gauge, Users, Car } from "lucide-react";
import Image from "next/image";

interface BookedCarCardProps {
    car: {
        make: string;
        model: string;
        year: number;
        tier: string;
        category: string;
        transmission: string;
        fuelType: string;
        seats: number;
        headerImage: string;
    } | null;
}

export const BookedCarCard = ({ car }: BookedCarCardProps) => {
    if (!car) {
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
        <div className="bg-white rounded-3xl p-2 pb-2 shadow-sm flex flex-col h-full border border-slate-100">
            {/* Hero Image Section */}
            <div className="relative w-full h-65 sm:h-75 rounded-[20px] overflow-hidden shrink-0">
                <Image
                    src={car.headerImage || "https://images.pexels.com/photos/14667492/pexels-photo-14667492.jpeg"}
                    alt={`${car.make} ${car.model}`}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-[#0B0F3B] via-[#0B0F3B]/50 to-transparent" />

                <div className="absolute bottom-5 left-6 right-6">
                    <h2 className="text-white text-3xl font-extrabold tracking-tight mb-1">
                        {car.make} {car.model}
                    </h2>
                    <p className="text-white/80 font-medium text-sm">
                        {car.year} • {car.tier} {car.category}
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 px-1 flex-1 pb-1">
                <div className="bg-[#F8F9FA] rounded-[16px] p-4 flex flex-col justify-center">
                    <Zap className="w-4 h-4 text-[#FF8C00] mb-2" />
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Transmission</span>
                    <span className="font-bold text-[#0B0F3B] capitalize text-[13px]">{car.transmission}</span>
                </div>

                <div className="bg-[#F8F9FA] rounded-[16px] p-4 flex flex-col justify-center">
                    <BatteryCharging className="w-4 h-4 text-[#B87A3D] mb-2" />
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Fuel Type</span>
                    <span className="font-bold text-[#0B0F3B] capitalize text-[13px]">{car.fuelType}</span>
                </div>

                <div className="bg-[#F8F9FA] rounded-[16px] p-4 flex flex-col justify-center">
                    <Gauge className="w-4 h-4 text-[#B87A3D] mb-2" />
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Category</span>
                    <span className="font-bold text-[#0B0F3B] capitalize text-[13px]">{car.category}</span>
                </div>

                <div className="bg-[#F8F9FA] rounded-[16px] p-4 flex flex-col justify-center">
                    <Users className="w-4 h-4 text-[#B87A3D] mb-2" />
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Capacity</span>
                    <span className="font-bold text-[#0B0F3B] capitalize text-[13px]">{car.seats} Seats</span>
                </div>
            </div>
        </div>
    );
};