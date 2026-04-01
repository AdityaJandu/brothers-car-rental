import { CarCard } from "./CarCard";
import { CarGetAll } from "../../types";

interface CarGridProps {
    cars: CarGetAll;
}

export function CarGrid({ cars }: CarGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {cars.map((car) => (
                <CarCard key={car.id} car={car} />
            ))}
        </div>
    );
}