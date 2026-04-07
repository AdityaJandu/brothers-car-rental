import { MapPin, Navigation } from "lucide-react";
import { format } from "date-fns";

interface ScheduleLocationCardProps {
    startDate: string | Date;
    endDate: string | Date;
}

export const ScheduleLocationCard = ({ startDate, endDate }: ScheduleLocationCardProps) => {

    const sDate = new Date(startDate);
    const eDate = new Date(endDate);

    return (
        <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-sm border border-slate-100/60 flex flex-col md:flex-row gap-8 items-center w-full mt-6">

            {/* Left Timeline Side */}
            <div className="flex-1 w-full pl-2">
                <div className="relative">

                    {/* Vertical connecting line */}
                    <div className="absolute left-[11px] top-[30px] bottom-[30px] w-0.5 bg-slate-300"></div>

                    {/* Pick-Up */}
                    <div className="flex items-start gap-5 relative mb-10">
                        <div className="w-6 h-6 rounded-full bg-[#0B0F3B] flex items-center justify-center shrink-0 z-10 ring-4 ring-white">
                            <MapPin className="w-3 h-3 text-white" />
                        </div>
                        <div className="pt-0.5">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5 block">Pick-up</span>
                            <h3 className="text-lg font-bold text-[#0B0F3B] mb-1">Executive Lounge Terminal</h3>
                            <p className="text-slate-500 font-medium text-sm">
                                {format(sDate, "MMM dd, yyyy")} • {format(sDate, "hh:mm a")}
                            </p>
                        </div>
                    </div>

                    {/* Drop-Off */}
                    <div className="flex items-start gap-5 relative">
                        <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center shrink-0 z-10 ring-4 ring-white">
                            <MapPin className="w-3 h-3 text-slate-400" />
                        </div>
                        <div className="pt-0.5">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5 block">Drop-off</span>
                            <h3 className="text-lg font-bold text-[#0B0F3B] mb-1">Executive Lounge Terminal</h3>
                            <p className="text-slate-500 font-medium text-sm">
                                {format(eDate, "MMM dd, yyyy")} • {format(eDate, "hh:mm a")}
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Right Map Side */}
            <div className="w-full md:w-[400px] h-[200px] bg-slate-100 rounded-3xl relative overflow-hidden flex items-center justify-center shrink-0">
                {/* CSS Patterns Map Mockup */}
                <div className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, #0B0F3B 1px, transparent 0)`,
                        backgroundSize: '20px 20px'
                    }}>
                </div>

                <div className="absolute inset-0 bg-gradient-to-tr from-slate-200/50 to-transparent"></div>

                {/* Pin Icon in center */}
                <MapPin className="w-16 h-16 text-slate-300 absolute drop-shadow-md" />

                {/* Overlay Button */}
                <button className="relative z-10 bg-white hover:bg-slate-50 text-[#0B0F3B] font-bold text-sm px-6 py-3 rounded-full flex items-center gap-2 shadow-lg transition-transform hover:scale-105">
                    <Navigation className="w-4 h-4 text-[#FF8C00]" />
                    View Route Details
                </button>
            </div>

        </div>
    );
};
