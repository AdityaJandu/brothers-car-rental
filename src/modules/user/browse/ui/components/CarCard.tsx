import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CarGetAll } from "../../types";
import Link from "next/link";
import { Star, User, Settings2 } from "lucide-react";

type SingleCar = CarGetAll[0];

interface CarCardProps {
    car: SingleCar;
}

export function CarCard({ car }: CarCardProps) {
    // Determines badge style based on fuel type to match the image
    const getBadgeStyle = (category: string) => {
        const cat = category?.toLowerCase();
        if (cat === 'electric') return 'bg-[#FDF3E7] text-[#D97706]';
        return 'bg-slate-100 text-slate-500';
    };

    return (
        <div className="bg-white rounded-md p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group">

            {/* --- IMAGE & BADGE --- */}
            <div className="relative w-full aspect-[1.6] bg-slate-100 rounded-md overflow-hidden mb-5">

                {/* Rating Badge */}
                <div className="absolute top-3 right-3 z-10 bg-white px-2.5 py-1.5 rounded-md flex items-center gap-1.5 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-[#D97706] text-[#D97706]" />
                    <span className="text-xs font-bold text-slate-800">{car.rating ?? "4.9"}</span>
                </div>

                <Image
                    src={car.headerImage ?? "./empty.svg"}
                    alt={car.name}
                    fill
                    loading="eager"
                    sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
            </div>

            {/* --- CONTENT --- */}
            <div className="flex flex-col grow px-1">

                {/* Title & Fuel Badge */}
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-slate-900 leading-tight truncate pr-4">
                        {car.name}
                    </h3>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${getBadgeStyle(car.category)}`}>
                        {car.category || "PETROL"}
                    </span>
                </div>

                {/* Specs */}
                <div className="flex items-center font-display gap-4 mb-6">
                    <div className="flex items-center gap-1.5 text-slate-500">
                        <User className="w-4 h-4" />
                        <span className="text-sm font-medium">{car.seats} Seats</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                        <Settings2 className="w-4 h-4" />
                        <span className="text-sm font-medium">{(car.transmission).toUpperCase()}</span>
                    </div>
                </div>

                {/* Price & CTA */}
                <div className="mt-auto flex items-center font-display justify-between pt-2">
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-extrabold text-slate-900">
                            &#8377;{car.pricePerDay}
                        </span>
                        <span className="text-sm font-medium text-slate-400">
                            / day
                        </span>
                    </div>

                    <Link href={`/browse/${car.id}`}>
                        <Button className={`h-11 px-6 rounded-md font-semibold transition-all ${car.category?.toLowerCase() === 'electric'
                            ? 'bg-[#FF8C00] hover:bg-[#E67E00] text-white shadow-[0_4px_14px_0_rgba(255,140,0,0.39)]'
                            : 'bg-[#0F172A] hover:bg-[#1E293B] text-white'
                            }`}>
                            Book Now
                        </Button>
                    </Link>
                </div>

            </div>
        </div>
    );
}