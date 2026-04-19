"use client";

import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// All actions from the auditActionEnum in schema.ts
const ACTION_OPTIONS = [
    { value: "all", label: "All Actions" },
    { value: "booking.confirmed", label: "Booking Confirmed" },
    { value: "booking.cancelled", label: "Booking Cancelled" },
    { value: "booking.completed", label: "Booking Completed" },
    { value: "booking.expired", label: "Booking Expired" },
    { value: "car.created", label: "Car Created" },
    { value: "car.updated", label: "Car Updated" },
    { value: "car.deleted", label: "Car Deleted" },
    { value: "user.banned", label: "User Banned" },
    { value: "location.updated", label: "Location Updated" },
] as const;

const TARGET_OPTIONS = [
    { value: "all", label: "All Targets" },
    { value: "booking", label: "Booking" },
    { value: "car", label: "Car" },
    { value: "location", label: "Location" },
    { value: "user", label: "User" },
] as const;

interface AuditFiltersProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    actionFilter: string;
    onActionFilterChange: (value: string) => void;
    targetFilter: string;
    onTargetFilterChange: (value: string) => void;
}

export function AuditFilters({
    searchQuery,
    onSearchChange,
    actionFilter,
    onActionFilterChange,
    targetFilter,
    onTargetFilterChange,
}: AuditFiltersProps) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                    id="audit-search"
                    aria-label="Search audit logs"
                    placeholder="Search by admin, action, or target..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-9 h-9 bg-white border-slate-200 focus:border-slate-400 focus:ring-slate-400 text-sm"
                />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400 hidden sm:block" />

                {/* Action Filter */}
                <Select value={actionFilter} onValueChange={onActionFilterChange}>
                    <SelectTrigger aria-label="Filter by action" className="h-9 w-[170px] bg-white border-slate-200 text-sm">
                        <SelectValue placeholder="All Actions" />
                    </SelectTrigger>
                    <SelectContent>
                        {ACTION_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Target Filter */}
                <Select value={targetFilter} onValueChange={onTargetFilterChange}>
                    <SelectTrigger aria-label="Filter by target" className="h-9 w-[150px] bg-white border-slate-200 text-sm">
                        <SelectValue placeholder="All Targets" />
                    </SelectTrigger>
                    <SelectContent>
                        {TARGET_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
