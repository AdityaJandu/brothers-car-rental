"use client";

import { DataPagination } from "@/components/self/data-pagination";
import { DataTable } from "@/components/self/data-table";
import { ErrorState } from "@/components/self/error-state";
import { LoadingState } from "@/components/self/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useBookingFiltersUser } from "@/modules/user/check-out/hooks/use-booking-filters-user";
import { bookingColumns } from "@/modules/user/bookings/ui/components/booking-columns";
import { EmptyState } from "@/components/self/empty-state";

export function AdminBookingView() {

    const [filters, setFilters] = useBookingFiltersUser();

    const trpc = useTRPC();

    const { data } = useSuspenseQuery(
        trpc.booking.getAllAdmin.queryOptions({
            ...filters
        }),
    );

    if (data.items.length === 0) {
        return (
            <EmptyState
                title="Create your first car"
                descr="Create a car right now. After you've created user can book it and you can see booking in booking section"
            />
        );
    };

    return (
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
            <DataTable
                columns={bookingColumns}
                data={data.items}
                onRowClick={(row) => { }}
            />
            <DataPagination
                page={filters.page}
                totalPages={data.totalPages}
                onPageChange={(page) => { setFilters({ page }) }}
            />
        </div>
    )

}

export const AdminBookingViewLoading = () => (
    <LoadingState
        title="Loading car"
        descr="This may take from a few seconds to a few minutes."
    />
);

export const AdminBookingViewError = () => (
    <ErrorState
        title="Failed to load car"
        descr="Something went wrong while fetching car. Try to refresh page."
    />
);
