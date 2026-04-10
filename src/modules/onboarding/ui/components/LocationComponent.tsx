"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { locations } from "../../data/location_data";


export function LocationComponent() {
    return (
        <section className="bg-[#041C3A] text-white py-20">
            <div className="max-w-7xl mx-auto px-4">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 gap-6">

                    <div>
                        <h2 className="text-3xl md:text-4xl font-semibold">
                            Prime Locations
                        </h2>
                        <p className="text-gray-300 mt-3 max-w-md">
                            Our executive fleet is strategically stationed across the NCR for your convenience.
                        </p>
                    </div>

                    {/* CTA */}
                    <button className="flex items-center gap-2 text-accent hover:gap-3 transition-all duration-300">
                        Explore All Locations
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {locations.map((loc, index) => (
                        <div
                            key={index}
                            className="group relative rounded-md overflow-hidden cursor-pointer transition-all duration-500 ease-out"
                        >
                            {/* Image */}
                            <Image
                                priority={true}
                                src={loc.image}
                                alt={loc.name}
                                width={500}
                                height={300}
                                className="w-full h-55 object-cover transition-transform duration-700 group-hover:scale-105"
                            />

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />

                            {/* Content */}
                            <div className="absolute bottom-4 left-4">
                                <h3 className="text-xl font-semibold">{loc.name}</h3>
                                <p className="text-sm text-gray-300">
                                    {loc.hubs} Hubs • {loc.cars} Cars
                                </p>
                            </div>

                            {/* Hover Glow */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[radial-gradient(circle_at_center,rgba(255,140,0,0.15),transparent_70%)]" />
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}