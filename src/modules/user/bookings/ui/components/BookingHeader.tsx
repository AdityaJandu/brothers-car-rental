import Link from "next/link";
import { ChevronRight, CheckCircle2, Clock, XCircle } from "lucide-react";

interface BookingHeaderProps {
    id: string;
    status: string;
}

export const BookingHeader = ({ id, status }: BookingHeaderProps) => {

    const displayId = id.slice(0, 8).toUpperCase();

    const getStatusConfig = () => {
        if (status === "completed") return { icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />, bg: "bg-emerald-100", text: "Completed" };
        if (status === "confirmed") return { icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />, bg: "bg-emerald-100", text: "Approved" };
        if (status === "cancelled") return { icon: <XCircle className="w-5 h-5 text-rose-600" />, bg: "bg-rose-100", text: "Cancelled" };
        // Pending
        return { icon: <Clock className="w-5 h-5 text-amber-600" />, bg: "bg-amber-100", text: "Pending" };
    };

    const config = getStatusConfig();

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 w-full">
            <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-1.5 text-sm font-semibold text-slate-500">
                    <Link href="/bookings" className="hover:text-slate-800 transition-colors">Bookings</Link>
                    <ChevronRight className="w-3.5 h-3.5 mt-0.5" />
                    <span className="text-[#0B0F3B]">Booking #BR-{displayId}</span>
                </div>
                <h1 className="text-[32px] md:text-[40px] font-bold text-[#0B0F3B] tracking-tight leading-none">
                    Booking #BR-{displayId}
                </h1>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-6 py-4 flex items-center gap-4 min-w-50">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${config.bg}`}>
                    {config.icon}
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 tracking-widest uppercase mb-0.5">Current Status</span>
                    <span className="text-lg font-bold text-[#0B0F3B] capitalize leading-none">{config.text}</span>
                </div>
            </div>
        </div>
    );
};
