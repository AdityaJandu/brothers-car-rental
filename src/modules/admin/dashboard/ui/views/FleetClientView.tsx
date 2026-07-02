"use client";

import { ErrorState } from "@/components/self/error-state";
import { LoadingState } from "@/components/self/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/self/data-table";
import { EmptyState } from "@/components/self/empty-state";
import { useRouter } from "next/navigation";
import { DataPagination } from "@/components/self/data-pagination";
import { useCarFilters } from "../../hooks/user-car-filters";
import { carColumns } from "../components/car-columns";


export function FleetClientView() {

    const [filters, setFilters] = useCarFilters();
    const router = useRouter();


    const trpc = useTRPC();
    const { data } = useSuspenseQuery(
        trpc.adminDashboard.getAllAdmin.queryOptions({
            ...filters
        })
    );


    if (data.items.length === 0) {
        return (
            <EmptyState
                title="Create your first car"
                descr="Create a car first. Each car you added and marked avaliable will be shown to users."
            />
        );
    };

    return (
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
            <DataTable
                columns={carColumns}
                data={data.items}
                onRowClick={(item) => router.push(`/edit-car/${item.id}`)}
            />
            <DataPagination
                page={filters.page}
                totalPages={data.totalPages}
                onPageChange={(page) => { setFilters({ page }) }}
            />
        </div>
    );
};

export const FleetViewLoading = () => {
    return (
        <LoadingState
            title="Loading data"
            descr="This may take from a few seconds to a few minutes."
        />
    );
};

export const FleetViewError = () => {
    return (
        <ErrorState
            title="Failed to load data"
            descr="Something went wrong while fetching agents. Try to refresh page."
        />
    );
};