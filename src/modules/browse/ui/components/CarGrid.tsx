import { featuredCarData } from "@/modules/onboarding/data/featured_car_data";
import { CarCard } from "./CarCard";

export function CarGrid() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCarData.map((car) => (
                <CarCard key={car.id} car={car} />
            ))}
        </div>
    );
}