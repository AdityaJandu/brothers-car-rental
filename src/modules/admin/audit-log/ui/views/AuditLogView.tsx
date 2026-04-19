'use client';

import { DataTable } from "@/components/self/data-table";
import { ErrorState } from "@/components/self/error-state";
import { LoadingState } from "@/components/self/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { AuditHeader } from "../components/AuditHeader";
import { AuditFilters } from "../components/AuditFilters";
import { auditColumns, AuditLogEntry } from "../components/audit-columns";


export function AuditLogView() {
    const trpc = useTRPC();
    const { data: auditLogs } = useSuspenseQuery(
        trpc.adminAudit.getAllAuditLogs.queryOptions()
    );

    // --- Local filter state ---
    const [searchQuery, setSearchQuery] = useState("");
    const [actionFilter, setActionFilter] = useState("all");
    const [targetFilter, setTargetFilter] = useState("all");

    // --- Derived filtered data ---
    const filteredLogs = useMemo(() => {
        let result = auditLogs as AuditLogEntry[];

        // Action filter
        if (actionFilter !== "all") {
            result = result.filter((log) => log.action === actionFilter);
        }

        // Target type filter
        if (targetFilter !== "all") {
            result = result.filter((log) => log.targetType === targetFilter);
        }

        // Search filter (admin name, action, target ID)
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter((log) =>
                (log.adminName?.toLowerCase().includes(q)) ||
                (log.adminEmail?.toLowerCase().includes(q)) ||
                log.action.toLowerCase().includes(q) ||
                log.targetId.toLowerCase().includes(q) ||
                log.targetType.toLowerCase().includes(q)
            );
        }

        return result;
    }, [auditLogs, actionFilter, targetFilter, searchQuery]);

    // --- Header stats ---
    const latestDate = auditLogs.length > 0 ? auditLogs[0].createdAt : null;

    return (
        <div className="flex-1 pt-8 pb-4 px-4 md:px-8 flex flex-col gap-y-6">
            <AuditHeader
                totalEntries={auditLogs.length}
                latestDate={latestDate}
            />

            <AuditFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                actionFilter={actionFilter}
                onActionFilterChange={setActionFilter}
                targetFilter={targetFilter}
                onTargetFilterChange={setTargetFilter}
            />

            <DataTable
                columns={auditColumns}
                data={filteredLogs}
            />
        </div>
    );
}


export function AuditLogLoadingView() {
    return (
        <LoadingState title={"Loading audit logs"} descr={"Please wait while we load the audit logs"} />
    );
}

export function AuditLogErrorView() {
    return (
        <ErrorState title={"Failed to load audit logs"} descr={"Please try again later"} />
    );
}