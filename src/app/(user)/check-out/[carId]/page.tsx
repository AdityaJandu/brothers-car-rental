
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

    // Auth check first — no point prefetching data for unauthenticated users
    const session = await getSession();
    if (!session) {
        redirect("/sign-in");
    }

    // Server-side prefetch — auth cookies are forwarded via headers()
    const queryClient = getQueryClient();
    await queryClient.prefetchQuery(
        trpc.userCheckout.getCheckoutData.queryOptions({ carId }),
    );

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