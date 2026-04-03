"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CarGrid } from "../components/CarGrid";
import { LoadingState } from "@/components/self/loading-state";
import { ErrorState } from "@/components/self/error-state";
import { useCarFiltersUser } from "../../hooks/use-car-filters-user";
import { DataPagination } from "@/components/self/data-pagination";

export function BrowseView() {

    const [filters, setFilters] = useCarFiltersUser();

    const trpc = useTRPC();
    const { data } = useSuspenseQuery(
        trpc.userBrowse.getAll.queryOptions({
            ...filters
        })
    );

    return (
        <>
            <div className="flex-1 sm:hidden py-4 px-6 flex flex-col gap-y-4">
                <DataPagination
                    page={filters.page}
                    totalPages={data.totalPages}
                    onPageChange={(page) => { setFilters({ page }) }}
                />
            </div>
            <div className="min-h-screen max-w-350 bg-[#F8F9FA] px-6 lg:px-12 sm:py-10 font-sans">
                {/* Cars Grid */}
                <CarGrid cars={data.items} />
            </div>
            <div className="pb-10 sm:hidden"></div>
            <div className="flex-1 pb-4 px-4 md:px-8 hidden md:flex md:flex-col gap-y-4">
                <DataPagination
                    page={filters.page}
                    totalPages={data.totalPages}
                    onPageChange={(page) => { setFilters({ page }) }}
                />
            </div>
        </>
    );
}

export const BrowseViewLoading = () => {
    return (
        <LoadingState
            title="Loading data"
            descr="This may take from a few seconds to a few minutes."
        />
    );
};

export const BrowseViewError = () => {
    return (
        <ErrorState
            title="Failed to load data"
            descr="Something went wrong while fetching cars. Try to refresh page."
        />
    );
};