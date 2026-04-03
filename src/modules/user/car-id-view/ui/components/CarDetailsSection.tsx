import { Fuel, Gauge, Settings2, Star, Users } from "lucide-react";
import { Spec } from "./Spec";
import { GetOne } from "@/modules/user/browse/types";

interface CarDetailSectionProps {
    car: GetOne;
};

export const CarDetailSection = ({ car }: CarDetailSectionProps) => {
    const features = car.features ?? [];

    return (
        <div className="flex flex-col gap-8 font-display">

            {/* Badge + Rating */}
            <div className="flex items-center gap-3 mb-1">

                {/* TODO: replace with car.tier or premium flag from DB */}
                <span className="bg-[#FDF3E7] text-[#D97706] text-xs font-bold px-3 py-1 rounded-full tracking-wide">
                    {car.category.toUpperCase()}
                </span>

                <div className="flex items-center gap-1 text-sm text-slate-600">
                    <Star className="w-4 h-4 fill-[#D97706] text-[#D97706]" />

                    {/* rating from DB ✅ */}
                    <span className="font-semibold">{car.rating}</span>

                    {/* TODO: replace with real review count from DB */}
                    <span className="text-slate-400">(124 reviews)</span>
                </div>
            </div>

            {/* Title */}
            <h1 className="text-5xl font-extrabold text-[#0F172A] leading-tight tracking-tight">
                {car.make} {car.model}
            </h1>

            {/* Description */}
            <p className="text-slate-500 text-lg leading-relaxed max-w-xl">
                {car.description}
            </p>

            {/* Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                <Spec icon={Users} label="Seats" value={`${car.seats}`} />

                <Spec
                    icon={Fuel}
                    label="Fuel"
                    value={car.fuelType.toUpperCase()} // DB ✅
                />

                <Spec
                    icon={Settings2}
                    label="Trans."
                    value={car.transmission.toUpperCase()} // DB ✅
                />

                {/* TODO: replace with mileage from DB */}
                <Spec icon={Gauge} label="Mileage" value="Unlimited" />
            </div>

            {/* Experience Section */}
            <div className="bg-[#F8FAFC] rounded-md p-7 border border-slate-200">

                <h3 className="text-lg font-bold text-[#0F172A] mb-3">
                    The Experience
                </h3>

                {/* TODO: replace with detailed description from DB */}
                <p className="text-slate-500 leading-relaxed mb-4">
                    {car.description}
                </p>

                <div className="flex flex-wrap gap-2">
                    {(features.length
                        ? features
                        : [
                            // TODO: fallback features — remove once DB always provides features
                            "Premium Audio",
                            "Navigation",
                            "Cruise Control"
                        ]
                    ).map((f) => (
                        <span
                            key={f}
                            className="bg-white border border-slate-200 px-4 py-1.5 rounded-full text-sm font-medium text-slate-600 shadow-sm"
                        >
                            {f}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};