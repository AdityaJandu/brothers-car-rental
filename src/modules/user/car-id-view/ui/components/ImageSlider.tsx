import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ImageSliderProps {
    images: string[];
    name: string;
};
export const ImageSlider = ({ images, name }: ImageSliderProps) => {
    const [index, setIndex] = useState(0);

    const prev = () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
    const next = () => setIndex((i) => (i === images.length - 1 ? 0 : i + 1));

    return (
        <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-sm">

            <Image
                src={images[index]}
                alt={name}
                fill
                priority
                sizes="(max-width:768px) 100vw, 50vw"
                className="object-cover transition-all duration-500"
            />

            {/* Controls */}
            <div className="absolute bottom-5 left-5 flex gap-3">
                <Button
                    onClick={prev}
                    className="bg-white/90 hover:bg-pink-50 p-3 rounded-full shadow-md transition"
                >
                    <ChevronLeft className="w-4 h-4 text-slate-700" />
                </Button>

                <Button
                    onClick={next}
                    className="bg-white/90 hover:bg-pink-50 p-3 rounded-full shadow-md transition"
                >
                    <ChevronRight className="w-4 h-4 text-slate-700" />
                </Button>
            </div>

        </div>
    );
};