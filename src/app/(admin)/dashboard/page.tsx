
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { FleetViewError, FleetViewLoading, FleetClientView } from "@/modules/admin/ui/views/FleetClientView";
import type { SearchParams } from "nuqs/server";
import { loadSearchParams } from "@/modules/admin/params";

interface Props {
    searchParams: Promise<SearchParams>
}

const Page = async ({ searchParams }: Props) => {
    const filters = await loadSearchParams(searchParams);

    // Have to check if the user is an admin before prefetching, otherwise we might be prefetching data for users who shouldn't have access to it.
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    // No session, redirect to home page (or sign-in page)
    if (!session) {
        redirect("/sign-in"); // server-side redirect
    }

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.browse.getAllAdmin.queryOptions({
            ...filters
        })
    );

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<FleetViewLoading />}>
                <ErrorBoundary fallback={<FleetViewError />}>
                    <FleetClientView />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    );
}

export default Page;