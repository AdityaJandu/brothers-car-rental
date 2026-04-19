"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
    FileJson,
    ShieldAlert,
    CheckCircle2,
    XCircle,
    Pencil,
    Trash2,
    PlusCircle,
    Ban,
    MapPin,
    Clock,
    type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

// Inferred from the tRPC procedure's actual return type
export type AuditLogEntry = {
    id: string;
    action: string;
    targetType: string;
    targetId: string;
    previousValue: unknown;
    newValue: unknown;
    createdAt: Date | string;
    adminName: string | null;
    adminEmail: string | null;
};

type ActionMeta = { icon: LucideIcon; bg: string; text: string; dotColor: string };

/**
 * Exact-match mapping from audit action strings to their icon and color scheme.
 * Using exact keys prevents substring priority collisions
 * (e.g. "location.updated" incorrectly matching the "updated" check before "location").
 */
const ACTION_META: Record<string, ActionMeta> = {
    "booking.confirmed": { icon: CheckCircle2, bg: "bg-emerald-100", text: "text-emerald-700", dotColor: "bg-emerald-500" },
    "booking.cancelled": { icon: XCircle, bg: "bg-rose-100", text: "text-rose-700", dotColor: "bg-rose-500" },
    "booking.completed": { icon: CheckCircle2, bg: "bg-blue-100", text: "text-blue-700", dotColor: "bg-blue-500" },
    "booking.expired":   { icon: Clock, bg: "bg-amber-100", text: "text-amber-700", dotColor: "bg-amber-500" },
    "car.created":       { icon: PlusCircle, bg: "bg-emerald-100", text: "text-emerald-700", dotColor: "bg-emerald-500" },
    "car.updated":       { icon: Pencil, bg: "bg-blue-100", text: "text-blue-700", dotColor: "bg-blue-500" },
    "car.deleted":       { icon: Trash2, bg: "bg-rose-100", text: "text-rose-700", dotColor: "bg-rose-500" },
    "user.banned":       { icon: Ban, bg: "bg-rose-100", text: "text-rose-700", dotColor: "bg-rose-500" },
    "location.updated":  { icon: MapPin, bg: "bg-violet-100", text: "text-violet-700", dotColor: "bg-violet-500" },
};

const DEFAULT_META: ActionMeta = { icon: ShieldAlert, bg: "bg-slate-100", text: "text-slate-700", dotColor: "bg-slate-500" };

function getActionMeta(action: string): ActionMeta {
    return ACTION_META[action] ?? DEFAULT_META;
}

/**
 * Renders a JSON value with basic syntax coloring.
 */
function JsonDisplay({ value, color }: { value: unknown; color: "rose" | "emerald" }) {
    if (value === null || value === undefined) {
        return (
            <div className="flex items-center justify-center h-full">
                <span className="text-xs text-slate-500 italic">No data</span>
            </div>
        );
    }

    const formatted = typeof value === "string" ? value : JSON.stringify(value, null, 2);
    const textColor = color === "rose" ? "text-rose-400" : "text-emerald-400";

    return (
        <pre className={`text-xs ${textColor} font-mono whitespace-pre-wrap wrap-break-word`}>
            {formatted}
        </pre>
    );
}

export const auditColumns: ColumnDef<AuditLogEntry>[] = [
    {
        accessorKey: "createdAt",
        header: "Timestamp",
        cell: ({ row }) => {
            const date = new Date(row.original.createdAt);
            return (
                <div className="flex flex-col">
                    <span className="font-medium text-slate-900">{format(date, "MMM dd, yyyy")}</span>
                    <span className="text-xs text-slate-500">{format(date, "hh:mm:ss a")}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "adminName",
        header: "Administrator",
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                        {(row.original.adminName || "S")[0].toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium text-slate-900">{row.original.adminName || "System"}</span>
                        <span className="text-xs text-slate-500">{row.original.adminEmail || "Auto-generated"}</span>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "action",
        header: "Action Performed",
        filterFn: "equalsString",
        cell: ({ row }) => {
            const action = row.original.action;
            const meta = getActionMeta(action);
            const Icon = meta.icon;

            return (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase ${meta.bg} ${meta.text}`}>
                    <Icon className="w-3 h-3" />
                    {action}
                </span>
            );
        },
    },
    {
        accessorKey: "targetType",
        header: "Target Entity",
        filterFn: "equalsString",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-bold text-slate-700 capitalize">{row.original.targetType}</span>
                <span className="text-xs text-slate-400 font-mono truncate max-w-[120px]" title={row.original.targetId}>
                    ID: {row.original.targetId.slice(0, 8)}...
                </span>
            </div>
        ),
    },
    {
        id: "actions",
        header: "Payload",
        cell: ({ row }) => {
            const log = row.original;
            const meta = getActionMeta(log.action);
            const date = new Date(log.createdAt);

            return (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 gap-2 bg-slate-50 hover:bg-slate-100 border-slate-200">
                            <FileJson className="w-3.5 h-3.5 text-slate-500" />
                            View Delta
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="min-w-[60vw] bg-white border-slate-200">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-xl">
                                <ShieldAlert className="w-5 h-5 text-[#0B0F3B]" />
                                Audit Log Details
                            </DialogTitle>
                            <VisuallyHidden>
                                <DialogDescription>
                                    Detailed view of the JSON state delta showing the previous and new values of the modified entity.
                                </DialogDescription>
                            </VisuallyHidden>
                        </DialogHeader>

                        {/* Metadata Banner */}
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${meta.bg} ${meta.text}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${meta.dotColor}`} />
                                {log.action}
                            </span>
                            <span className="text-xs text-slate-400">•</span>
                            <span className="text-xs text-slate-500">
                                by <span className="font-semibold text-slate-700">{log.adminName || "System"}</span>
                            </span>
                            <span className="text-xs text-slate-400">•</span>
                            <span className="text-xs text-slate-500">
                                {format(date, "MMM dd, yyyy 'at' HH:mm:ss")}
                            </span>
                            <span className="text-xs text-slate-400">•</span>
                            <span className="text-xs text-slate-400 font-mono">
                                {log.targetType}:{log.targetId.slice(0, 8)}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            {/* Previous State */}
                            <div className="flex flex-col gap-2">
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Previous State</span>
                                <div className="bg-slate-900 rounded-lg p-4 overflow-auto h-[400px]">
                                    <JsonDisplay value={log.previousValue} color="rose" />
                                </div>
                            </div>

                            {/* New State */}
                            <div className="flex flex-col gap-2">
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">New State</span>
                                <div className="bg-slate-900 rounded-lg p-4 overflow-auto h-[400px]">
                                    <JsonDisplay value={log.newValue} color="emerald" />
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            );
        },
    },
];