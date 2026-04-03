import { auth } from "@/lib/auth";
import { AllBookingViewLoading, AllBookingViewError, AllBookingView } from "@/modules/user/bookings/ui/views/AllBookingView";
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

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.userBookings.getAll.queryOptions({
            ...filters
        }),
    );


    return (
        <HydrationBoundary state={dehydrate(queryClient)} >
            <Suspense fallback={<AllBookingViewLoading />} >
                <ErrorBoundary fallback={<AllBookingViewError />} >
                    <AllBookingView />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    );
}