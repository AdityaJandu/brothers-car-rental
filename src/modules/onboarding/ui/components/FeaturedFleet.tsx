"use client";

import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';
import { LoadingState } from '@/components/self/loading-state';
import { CarGetOne } from '@/modules/user/browse/types';
import Link from 'next/link';

export function FeaturedFleet() {

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Smooth scroll handler for the Chevron buttons
    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            // Get the width of the visible container to scroll by exactly one "page"
            const { clientWidth } = scrollContainerRef.current;
            const scrollAmount = direction === 'left' ? -clientWidth : clientWidth;

            scrollContainerRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const trpc = useTRPC();
    const { data, isLoading } = useQuery(
        trpc.userBrowse.getAll.queryOptions({})
    );

    if (!data) {
        return null;
    }

    if (isLoading) {
        return <LoadingState title={'Loading Cars'} descr={'Please wait while we load the cars'} />
    }

    return (
        <section className="w-full max-w-7xl mx-auto px-6 py-16 lg:px-12 overflow-hidden">

            {/* --- SECTION HEADER --- */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl lg:text-4xl font-bold text-primary font-heading tracking-tight">
                    Featured Fleet
                </h2>

                {/* Navigation Arrows */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => scroll('left')}
                        className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-primary hover:bg-muted transition-colors active:scale-95"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-primary hover:bg-muted transition-colors active:scale-95"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* --- CAROUSEL TRACK --- */}
            <div className="relative -mx-6 px-6 lg:-mx-12 lg:px-12">
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto gap-6 lg:gap-8 snap-x snap-mandatory pb-8 pt-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                    {
                        data.items.map((car: CarGetOne) => (
                            <div
                                key={car.id}
                                /* Responsive sizing:
                                  Mobile: 100% width (1 card)
                                  Tablet: 50% width minus half the gap (2 cards)
                                  Desktop: 33.333% width minus two-thirds of the gap (3 cards)
                                */
                                className="flex-none snap-start w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-21px)] group bg-card rounded-[20px] p-2 border border-border/40 hover:shadow-ambient transition-all duration-300"
                            >
                                {/* Image Container */}
                                <div className="relative w-full aspect-[1.5] bg-[#1a1c23] rounded-t-[14px] rounded-b-sm overflow-hidden mb-4">
                                    {/* Badge */}
                                    <div className="absolute top-3 right-3 z-10 bg-white px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                                        <Star className="w-3.5 h-3.5 fill-[#D97706] text-[#D97706]" />
                                        <span className="text-xs font-bold text-primary">{car.rating}</span>
                                    </div>

                                    {/* Car Image */}
                                    <Image
                                        priority={true}
                                        src={car.headerImage}
                                        alt={car.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                                    />
                                </div>

                                {/* Content Container */}
                                <div className="px-3 pb-3">
                                    {/* Title & Price Row */}
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="text-[1.15rem] font-bold text-primary font-heading leading-tight truncate mr-2">
                                            {car.name}
                                        </h3>
                                        <span className="text-[1.15rem] font-bold text-primary text-right leading-tight whitespace-nowrap">
                                            {car.pricePerDay}
                                        </span>
                                    </div>

                                    {/* Category & Per Day Row */}
                                    <div className="flex justify-between items-center mb-6">
                                        <p className="text-sm text-muted-foreground font-medium truncate">
                                            {car.category}
                                        </p>
                                        <p className="text-[0.65rem] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                                            Per Day
                                        </p>
                                    </div>

                                    {/* Book Now Button */}
                                    <Button
                                        asChild
                                        className="w-full h-12 rounded-md text-base font-medium transition-all bg-muted text-primary border-0 hover:bg-primary hover:text-white"
                                    >
                                        <Link prefetch={true} href={`/check-out/${car.id}`}>
                                            Book Now
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        ))}
                </div>
            </div>

        </section >
    );
}