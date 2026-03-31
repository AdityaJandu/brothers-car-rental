import { BrowseView, BrowseViewLoading, BrowseViewError } from "@/modules/customer/browse/ui/views/BrowseView";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { LoadingState } from "@/components/self/loading-state";
import { ErrorBoundary } from "react-error-boundary";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    // Pre-fetch
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.browse.getAll.queryOptions({}),
    );

    return (
        <HydrationBoundary state={dehydrate(queryClient)} >
            <Suspense fallback={<BrowseViewLoading />} >
                <ErrorBoundary fallback={<BrowseViewError />} >
                    <BrowseView />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    );
}