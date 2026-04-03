"use client";

import { DataPagination } from "@/components/self/data-pagination";
import { DataTable } from "@/components/self/data-table";
import { ErrorState } from "@/components/self/error-state";
import { LoadingState } from "@/components/self/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { bookingColumns } from "../components/booking-columns";
import { useBookingFiltersUser } from "@/modules/user/check-out/hooks/use-booking-filters-user";

export function AllBookingView() {

    const [filters, setFilters] = useBookingFiltersUser();

    const trpc = useTRPC();

    const { data } = useSuspenseQuery(
        trpc.userBookings.getAll.queryOptions({
            ...filters
        }),
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
            <div className="min-h-[70vh] max-w-350 bg-[#F8F9FA] px-6 lg:px-12 sm:py-10 font-sans">
                {/* Cars Grid */}
                <DataTable
                    columns={bookingColumns}
                    data={data.items}
                    onRowClick={(row) => { }}
                />
            </div>
            <div className="flex-1 pb-4 px-4 md:px-8 hidden md:flex md:flex-col gap-y-4">
                <DataPagination
                    page={filters.page}
                    totalPages={data.totalPages}
                    onPageChange={(page) => { setFilters({ page }) }}
                />
            </div>
        </>
    )

}


// () -> means no need to write
export const AllBookingViewLoading = () => (
    <LoadingState
        title="Loading bookings"
        descr="This may take from a few seconds to a few minutes."
    />
);

export const AllBookingViewError = () => (
    <ErrorState
        title="Failed to load bookings"
        descr="Something went wrong while fetching bookings. Try to refresh page."
    />
);
