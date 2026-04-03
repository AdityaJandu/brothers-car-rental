
import { auth } from "@/lib/auth";
import { CarBookingView, CarBookingViewError, CarBookingViewLoading } from "@/modules/user/check-out/ui/views/CarBookingView";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
    params: Promise<{ carId: string }>;
};

export default async function Page({ params }: Props) {
    const { carId } = await params;

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in"); // server-side redirect
    }

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.userBrowse.getOne.queryOptions({ id: carId }),
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