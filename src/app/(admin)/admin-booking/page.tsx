
import { auth } from "@/lib/auth";
import { AdminBookingView, AdminBookingViewError, AdminBookingViewLoading } from "@/modules/admin/bookings/ui/views/AdminBookingView";
import { loadSearchParamsBooking } from "@/modules/user/check-out/params";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";


interface Props {
    searchParams: Promise<SearchParams>;
};

export default async function Page({ searchParams }: Props) {
    const filters = await loadSearchParamsBooking(searchParams);
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    if (session.user.role !== 'admin') {
        redirect('/');
    }

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.adminBookings.getAllAdmin.queryOptions({
            ...filters
        }),
    );


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