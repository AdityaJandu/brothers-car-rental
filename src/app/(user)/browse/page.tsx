import { BrowseView } from "@/modules/browse/ui/views/BrowseView";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { LoadingState } from "@/components/self/loading-state";
import { ErrorBoundary } from "react-error-boundary";

export default async function Page() {
    // const session = await auth.api.getSession({
    //     headers: await headers(),
    // });

    // if (!session) {
    //     redirect("/sign-in");
    // }

    // Pre-fetch
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.browse.getAll.queryOptions({}),
    );



    return (
        <HydrationBoundary state={dehydrate(queryClient)} >
            <Suspense fallback={<LoadingState title={"Please wait"} descr={"Please wait while we load the available cars."} />} >
                <ErrorBoundary fallback={<div className="p-4 bg-red-100 text-red-800 rounded">An error occurred while loading the cars. Please try again later.</div>} >
                    <BrowseView />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    );
}