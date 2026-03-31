import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CarGetAll } from "../../types";
import Link from "next/link";
import { Star } from "lucide-react";

// THIS IS THE MAGIC: We extract a single car's type from the array!
type SingleCar = CarGetAll[0];

interface CarCardProps {
    car: SingleCar; // Now it knows this is just ONE car, not the whole list
}

export function CarCard({ car }: CarCardProps) {
    return (
        <div className="bg-card rounded-[20px] p-2 border border-border/40 overflow-hidden hover:shadow-ambient transition-all duration-300 flex flex-col group">

            {/* --- IMAGE & BADGE --- */}
            <div className="relative w-full aspect-[1.5] bg-[#1a1c23] rounded-t-[14px] rounded-b-sm overflow-hidden mb-4">

                {/* Rating Badge */}
                <div className="absolute top-3 right-3 z-10 bg-white px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-[#D97706] text-[#D97706]" />
                    <span className="text-xs font-bold text-primary font-sans">{car.rating}</span>
                </div>

                <Image
                    src={car.headerImage ?? "./empty.svg"}
                    alt={car.name}
                    fill
                    loading="eager"
                    sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
            </div>

            {/* --- CONTENT --- */}
            <div className="px-3 pb-3 flex flex-col grow">

                {/* Title & Category */}
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-primary font-heading leading-tight truncate mb-1">
                        {car.name}
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium font-sans uppercase tracking-wider">
                        {car.category}
                    </p>
                </div>

                {/* Price & CTA */}
                <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex flex-col">
                        <span className="text-[0.65rem] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">
                            Per Day
                        </span>
                        {/* Beautifully formatted Indian Rupees */}
                        <span className="text-2xl font-bold text-primary font-heading leading-none">
                            {new Intl.NumberFormat('en-IN', {
                                style: 'currency',
                                currency: 'INR',
                                maximumFractionDigits: 0
                            }).format(car.pricePerDay)}
                        </span>
                    </div>

                    <Link href={`/checkout/${car.id}`}>
                        <Button className="h-11 px-6 bg-primary hover:bg-[#122038] text-white rounded-xl font-bold transition-colors">
                            Book Now
                        </Button>
                    </Link>
                </div>

            </div>
        </div>
    );
}