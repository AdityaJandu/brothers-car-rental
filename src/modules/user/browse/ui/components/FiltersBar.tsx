"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Search, Car } from "lucide-react";
import { DatePicker } from "./DatePicker";
import { format } from "date-fns";
import { useCarFiltersUser } from "../../hooks/use-car-filters-user";

export function FiltersBar() {
    const [pickupDate, setPickupDate] = useState<Date | undefined>(undefined);
    const [dropoffDate, setDropoffDate] = useState<Date | undefined>(undefined);
    const [activeCategory, setActiveCategory] = useState("All Cars");

    const categories = ["All Cars", "SUV", "Sedan", "Hatchback", "Convertible"];

    const [filters, setFilters] = useCarFiltersUser();



    return (
        <div className="flex flex-col px-6 lg:px-12 gap-8">

            {/* Top Search Bar */}
            <div className="bg-white rounded-3xl p-3 shadow-sm border border-slate-100 flex flex-col lg:flex-row items-center gap-3">

                {/* Location Input Group */}
                <div className="flex-1 flex items-center bg-[#F4F5F7] rounded-xl px-4 py-3 w-full">
                    <Car className="w-5 h-5 text-slate-400 mr-3" />
                    <div className="flex flex-col flex-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Search car
                        </span>
                        <input
                            value={filters.search}
                            onChange={(e) => setFilters({ search: e.target.value })}
                            type="text"
                            placeholder="Toyota Hyryder"
                            className="bg-transparent border-none outline-none text-sm font-semibold text-slate-800 placeholder:text-slate-500 w-full"
                        />
                    </div>
                </div>

                {/* Separator (Desktop only) */}
                <div className="hidden lg:block h-10 bg-slate-200 mx-2"></div>

                {/* Date Input Group (Wrapping your existing DatePicker) */}
                <div className="flex-1 w-full relative">
                    <DatePicker
                        date={pickupDate && dropoffDate ? { from: pickupDate, to: dropoffDate } : undefined}
                        setDate={(date) => {
                            setPickupDate(date?.from);
                            setDropoffDate(date?.to);
                        }}
                    >
                        {/* We use a <button> so it receives focus and click events properly via asChild */}
                        <button className="flex items-center bg-[#F4F5F7] hover:bg-[#E2E4E9] rounded-xl px-4 py-3 w-full text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400">
                            <Calendar className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
                            <div className="flex flex-col flex-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                                    Date & Time
                                </span>
                                <span className="text-sm font-semibold text-slate-800">
                                    {pickupDate ? (
                                        dropoffDate ? (
                                            `${format(pickupDate, "MMM dd")} - ${format(dropoffDate, "MMM dd")}`
                                        ) : (
                                            format(pickupDate, "MMM dd")
                                        )
                                    ) : (
                                        "Oct 24 - Oct 27"
                                    )}
                                </span>
                            </div>
                        </button>
                    </DatePicker>
                </div>

                {/* Search Button */}
                <Button className="w-full lg:w-auto h-full min-h-14 px-8 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl font-medium transition-colors flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Search
                </Button>
            </div>

            {/* Categories & Selectors */}
            <div className="hidden sm:flex sm:flex-col lg:flex-row lg:items-center justify-between gap-6">

                {/* Category Pills */}
                <div className="flex flex-col gap-3">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-[4px]">
                        Car Category
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${activeCategory === cat
                                    ? "bg-[#0F172A] text-white"
                                    : "bg-[#F4F5F7] text-slate-600 hover:bg-slate-200"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Dropdowns */}
                {/* <div className="flex items-center gap-6 self-start lg:self-end pb-1">
                    <div className="flex items-center gap-2 cursor-pointer group">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Fuel:
                        </span>
                        <div className="flex items-center gap-1 text-sm font-bold text-slate-800">
                            Electric <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-800 transition-colors" />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 cursor-pointer group">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Transmission:
                        </span>
                        <div className="flex items-center gap-1 text-sm font-bold text-slate-800">
                            Automatic <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-800 transition-colors" />
                        </div>
                    </div>
                </div> */}

            </div>
        </div>
    );
}