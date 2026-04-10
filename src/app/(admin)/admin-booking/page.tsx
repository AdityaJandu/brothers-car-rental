
import { getSession } from "@/lib/cached-session";
import { AdminBookingView, AdminBookingViewError, AdminBookingViewLoading } from "@/modules/admin/bookings/ui/views/AdminBookingView";
import { loadSearchParamsBooking } from "@/modules/user/check-out/params";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";


interface Props {
    searchParams: Promise<SearchParams>;
};

export default async function Page({ searchParams }: Props) {
    const filters = await loadSearchParamsBooking(searchParams);

    // Run admin auth check and data prefetch in parallel
    const queryClient = getQueryClient();
    const [session] = await Promise.all([
        getSession(),
        queryClient.prefetchQuery(
            trpc.adminBookings.getAllAdmin.queryOptions({
                ...filters
            }),
        ),
    ]);

    if (!session) {
        redirect("/sign-in");
    }

    if (session.user.role !== 'admin') {
        redirect('/');
    }


    return (
        <HydrationBoundary state={dehydrate(queryClient)} >
            <Suspense fallback={<AdminBookingViewLoading />} >
                <ErrorBoundary fallback={<AdminBookingViewError />} >
                    <AdminBookingView />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    );
}