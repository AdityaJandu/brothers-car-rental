import { MapPin, Map } from "lucide-react";
import { format } from "date-fns";

interface ScheduleLocationCardProps {
    startDate: string | Date;
    endDate: string | Date;
}

export const ScheduleLocationCard = ({ startDate, endDate }: ScheduleLocationCardProps) => {

    const sDate = new Date(startDate);
    const eDate = new Date(endDate);

    return (
        <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-sm flex flex-col md:flex-row justify-between items-stretch w-full gap-8">
            {/* Left Timeline Side */}
            <div className="flex-1 w-full pl-2 md:pl-4 py-2">
                <div className="relative h-full flex flex-col justify-between min-h-[140px]">
                    {/* Vertical connecting line */}
                    <div className="absolute left-[11px] top-[24px] bottom-[24px] w-[2px] bg-slate-200"></div>

                    {/* Pick-Up */}
                    <div className="flex items-start gap-6 relative">
                        <div className="w-6 h-6 rounded-full bg-[#1C2333] flex items-center justify-center shrink-0 z-10 ring-[6px] ring-white">
                            <MapPin className="w-3 h-3 text-white" />
                        </div>
                        <div className="pt-0.5">
                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1.5 block">Pick-up</span>
                            <h3 className="text-[16px] font-bold text-[#0B0F3B] mb-0.5">London Heathrow Airport (LHR)</h3>
                            <p className="text-slate-500 font-medium text-[13px]">
                                {format(sDate, "MMM dd, yyyy")} • {format(sDate, "hh:mm a")}
                            </p>
                        </div>
                    </div>

                    {/* Spacer for spacing out visually */}
                    <div className="h-10"></div>

                    {/* Drop-Off */}
                    <div className="flex items-start gap-6 relative">
                        <div className="w-6 h-6 rounded-full bg-white border-[2.5px] border-slate-200 flex items-center justify-center shrink-0 z-10 ring-[6px] ring-white">
                            <MapPin className="w-3 h-3 text-[#1C2333]" />
                        </div>
                        <div className="pt-0.5">
                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1.5 block">Drop-off</span>
                            <h3 className="text-[16px] font-bold text-[#0B0F3B] mb-0.5">London City Centre Terminal</h3>
                            <p className="text-slate-500 font-medium text-[13px]">
                                {format(eDate, "MMM dd, yyyy")} • {format(eDate, "hh:mm a")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Map Side */}
            <div className="w-full md:w-[350px] lg:w-[420px] bg-[#686E78] rounded-[16px] relative overflow-hidden flex items-center justify-center shrink-0 shadow-inner h-[200px]">
                {/* Simulated Map Background */}
                <div className="absolute inset-0 bg-[#686E78]">
                    <svg className="w-full h-full text-[#7B8390] opacity-40" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="mapPattern" patternUnits="userSpaceOnUse" width="40" height="40"><path d="M0 40L40 0z" stroke="currentColor" strokeWidth="2" /><path d="M40 40L0 0z" stroke="currentColor" strokeWidth="1" /></pattern></defs><rect width="100%" height="100%" fill="url(#mapPattern)" /></svg>
                </div>

                {/* Pin Icon and gradients */}
                <div className="absolute inset-x-0 bottom-0 h-[80%] bg-linear-to-t from-black/50 via-black/10 to-transparent"></div>
                <div className="absolute border-2 border-white/20 w-32 h-32 rounded-full inset-0 m-auto mt-16 blur-sm"></div>
                <MapPin className="w-24 h-24 text-[#353C47] fill-[#232830] absolute" />

                {/* Overlay Button */}
                <button className="relative z-10 bg-white hover:bg-slate-50 text-[#0B0F3B] font-bold text-[14px] px-6 py-3 rounded-full flex items-center gap-2 shadow-xl transition-transform hover:scale-[1.02]">
                    <Map className="w-4 h-4 text-[#B87A3D]" />
                    View Route Details
                </button>
            </div>
        </div>
    );
};
