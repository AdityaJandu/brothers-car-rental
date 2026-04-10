
import { getSession } from "@/lib/cached-session";
import { CarBookingView, CarBookingViewError, CarBookingViewLoading } from "@/modules/user/check-out/ui/views/CarBookingView";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
    params: Promise<{ carId: string }>;
};

export default async function Page({ params }: Props) {
    const { carId } = await params;

    // Run auth check and data prefetch in parallel
    const queryClient = getQueryClient();
    const [session] = await Promise.all([
        getSession(),
        queryClient.prefetchQuery(
            trpc.userBrowse.getOne.queryOptions({ id: carId }),
        ),
    ]);

    if (!session) {
        redirect("/sign-in"); // server-side redirect
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<CarBookingViewLoading />}>
                <ErrorBoundary fallback={<CarBookingViewError />}>
                    <CarBookingView carId={carId} />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    );
}