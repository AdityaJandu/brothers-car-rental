
import { CarCard } from "./CarCard";
import { CarGetAll } from "../../types";

interface CarGridProps {
    // CarGetAll is already the array of items from your backend
    cars: CarGetAll;
}

export function CarGrid({ cars }: CarGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
                <CarCard key={car.id} car={car} />
            ))}
        </div>
    );
}