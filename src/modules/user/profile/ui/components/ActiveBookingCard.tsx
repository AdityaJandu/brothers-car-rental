import { Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export const ActiveBookingCard = () => {
    return (
        <div className="bg-white rounded-2xl p-4 lg:col-span-2 shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-6 items-center">
            <div className="relative w-full sm:w-1/2 h-48 sm:h-full bg-slate-100 rounded-xl overflow-hidden min-h-55">
                <span className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest text-[#0F172A] shadow-sm">
                    Current Rental
                </span>
                <Image
                    src="https://images.pexels.com/photos/14667492/pexels-photo-14667492.jpeg"
                    alt="Mercedes EQS"
                    className="w-full h-full object-cover"
                    fill
                    loading="eager"
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                />
            </div>
            <div className="w-full sm:w-1/2 flex flex-col py-4 pr-4">
                <h3 className="text-xl font-bold text-[#0F172A]">2024 Mercedes-Benz EQS</h3>
                <p className="text-slate-500 text-sm mb-6 mt-1">Executive Chauffeur Series</p>

                <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-[#FF8C00]" />
                        <span className="text-sm font-medium text-slate-700">Return: Oct 24, 10:00 AM</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-[#FF8C00]" />
                        <span className="text-sm font-medium text-slate-700">LHR Airport Terminal 5</span>
                    </div>
                </div>

                <Button variant="outline" className="w-full border-2 border-[#1E293B] text-[#1E293B] hover:bg-slate-50 font-bold h-12 rounded-xl mt-auto">
                    Manage Booking
                </Button>
            </div>
        </div>
    );
};
