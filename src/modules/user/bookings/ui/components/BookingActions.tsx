import { Download, CalendarClock, Headphones, XCircle } from "lucide-react";

export const BookingActions = () => {
    return (
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-between gap-4 w-full mt-6 bg-white p-6 sm:p-8 rounded-[32px] shadow-sm border border-slate-100/60">

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <button className="flex items-center justify-center gap-2 bg-[#0B0F3B] hover:bg-slate-800 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-colors shadow-md w-full sm:w-auto">
                    <Download className="w-4 h-4" />
                    Download Invoice
                </button>

                <button className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-[#0B0F3B] font-bold text-sm px-6 py-3.5 rounded-xl border-2 border-slate-200 transition-colors w-full sm:w-auto">
                    <CalendarClock className="w-4 h-4" />
                    Modify Booking
                </button>

                <button className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-[#0B0F3B] font-bold text-sm px-6 py-3.5 rounded-xl border-2 border-slate-200 transition-colors w-full sm:w-auto">
                    <Headphones className="w-4 h-4" />
                    Contact Support
                </button>
            </div>

            <button className="flex items-center justify-center gap-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-bold text-sm px-6 py-3.5 rounded-xl transition-colors w-full sm:w-auto">
                <XCircle className="w-4 h-4" />
                Cancel Reservation
            </button>

        </div>
    );
};
