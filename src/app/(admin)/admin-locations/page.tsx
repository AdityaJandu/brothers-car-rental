import { getSession } from "@/lib/cached-session";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { AdminLocationsView, AdminLocationsViewError, AdminLocationsViewLoading } from "@/modules/admin/locations/ui/views/AdminLocationsView";

export default async function Page() {
    // Run admin auth check and data prefetch in parallel
    const queryClient = getQueryClient();
    const [session] = await Promise.all([
        getSession(),
        queryClient.prefetchQuery(
            trpc.adminLocations.getAll.queryOptions()
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
            <Suspense fallback={<AdminLocationsViewLoading />} >
                <ErrorBoundary fallback={<AdminLocationsViewError />} >
                    <AdminLocationsView />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    );
}
