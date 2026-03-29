import Image from "next/image";
import { Button } from "@/components/ui/button";

export function CarCard({ car }: any) {
    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-ambient group transition-all duration-300 hover:-translate-y-2">

            {/* Image */}
            <div className="relative h-50 bg-muted">
                <Image
                    src={car.image}
                    alt={car.name}
                    fill
                    loading="eager"
                    sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </div>

            {/* Content */}
            <div className="p-4">

                <h3 className="text-lg font-semibold text-primary">
                    {car.name}
                </h3>

                <p className="text-sm text-muted-foreground">
                    {car.type}
                </p>

                <div className="flex items-center justify-between mt-4">
                    <span className="text-xl font-bold text-primary">
                        {car.price}/day
                    </span>

                    <Button size="sm" className="btn-primary">
                        Book Now
                    </Button>
                </div>

            </div>
        </div>
    );
}