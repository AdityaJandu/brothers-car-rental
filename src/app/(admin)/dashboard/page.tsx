
import { Suspense } from "react";
import { getSession } from "@/lib/cached-session";
import { redirect } from "next/navigation";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { FleetViewError, FleetViewLoading, FleetClientView } from "@/modules/admin/dashboard/ui/views/FleetClientView";
import type { SearchParams } from "nuqs/server";
import { loadSearchParams } from "@/modules/admin/dashboard/params";
import { FleetListHeader } from "@/modules/admin/dashboard/ui/components/FleetListHeader";
import { VehicleInventoryHeader } from "@/modules/admin/dashboard/ui/components/VehicleInventoryHeader";

interface Props {
    searchParams: Promise<SearchParams>
}

const Page = async ({ searchParams }: Props) => {
    const filters = await loadSearchParams(searchParams);

    // Run admin auth check and data prefetch in parallel
    const queryClient = getQueryClient();
    const [session] = await Promise.all([
        getSession(),
        queryClient.prefetchQuery(
            trpc.adminDashboard.getAllAdmin.queryOptions({
                ...filters
            })
        ),
    ]);

    // No session, redirect to home page (or sign-in page)
    if (!session) {
        redirect("/sign-in"); // server-side redirect
    }

    if (session.user.role !== 'admin') {
        redirect('/');
    }

    return (
        <>
            <FleetListHeader />
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<FleetViewLoading />}>
                    <ErrorBoundary fallback={<FleetViewError />}>
                        <VehicleInventoryHeader />
                        <FleetClientView />
                    </ErrorBoundary>
                </Suspense>
            </HydrationBoundary>
        </>
    );
}

export default Page;