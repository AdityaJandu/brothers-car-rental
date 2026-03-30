import { LoadingState } from "@/components/self/loading-state";
import { FleetClientView } from "@/modules/admin/ui/views/FleetClientView";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

export default async function Page() {

    // Have to check if the user is an admin before prefetching, otherwise we might be prefetching data for users who shouldn't have access to it.
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    // No session, redirect to home page (or sign-in page)
    if (!session) redirect("/");


    const queryClient = getQueryClient();
    await queryClient.prefetchQuery(
        trpc.browse.getAll.queryOptions({ pageSize: 50 })
    );

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<LoadingState title="Please wait" descr="Loading cars..." />}>
                <ErrorBoundary fallback={<div className="p-4 bg-red-100 text-red-800 rounded">An error occurred while loading the fleet. Please try again later.</div>} >
                    <FleetClientView />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    );
}