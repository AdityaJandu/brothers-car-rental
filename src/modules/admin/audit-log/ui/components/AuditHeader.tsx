import { ShieldAlert, Clock, Activity } from "lucide-react";
import { format } from "date-fns";

interface AuditHeaderProps {
    totalEntries: number;
    latestDate: Date | string | null;
}

export function AuditHeader({ totalEntries, latestDate }: AuditHeaderProps) {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            {/* Title Area */}
            <div className="flex items-start gap-3">
                <div className="bg-[#0B0F3B] p-2.5 rounded-lg shadow-md">
                    <ShieldAlert className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-slate-900">
                        Audit Logs
                    </h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Track all administrative changes made across the system.
                    </p>
                </div>
            </div>

            {/* Stats Chips */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-full px-3.5 py-1.5 text-xs font-semibold text-slate-600">
                    <Activity className="h-3.5 w-3.5 text-slate-400" />
                    <span>{totalEntries} entries</span>
                </div>

                {latestDate && (
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-3.5 py-1.5 text-xs font-semibold text-emerald-700">
                        <Clock className="h-3.5 w-3.5 text-emerald-500" />
                        <span>Latest: {format(new Date(latestDate), "MMM dd, HH:mm")}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
