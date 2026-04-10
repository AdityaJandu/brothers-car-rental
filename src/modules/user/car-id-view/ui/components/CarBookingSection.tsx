
import { PricingCard } from "./PricingCard";
import { ImageSlider } from "./ImageSlider";
import { CarGetOne } from "@/modules/user/browse/types";


interface CarBookingSectionProps {
    car: CarGetOne;
    images: string[];
};

export const CarBookingSection = ({ car, images, }: CarBookingSectionProps) => {
    return (
        <div className="flex flex-col gap-8"> {/* increased spacing */}
            <ImageSlider images={images} name={car.name} />
            <PricingCard car={car} />
        </div>
    );
};