import { BrowseView, BrowseViewLoading, BrowseViewError } from "@/modules/user/browse/ui/views/BrowseView";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { getSession } from "@/lib/cached-session";
import { redirect } from "next/navigation";
import { SearchParams } from "nuqs/server";
import { loadSearchParamsUser } from "@/modules/user/browse/params";
import { FiltersBar } from "@/modules/user/browse/ui/components/FiltersBar";


interface Props {
    searchParams: Promise<SearchParams>
}

export default async function Page({ searchParams }: Props) {
    const filters = await loadSearchParamsUser(searchParams);

    // Run auth check and data prefetch in parallel
    const queryClient = getQueryClient();
    const [session] = await Promise.all([
        getSession(),
        queryClient.prefetchQuery(
            trpc.userBrowse.getAll.queryOptions({
                ...filters
            }),
        ),
    ]);

    if (!session) {
        redirect("/sign-in");
    }

    return (
        <>
            <FiltersBar />
            <HydrationBoundary state={dehydrate(queryClient)} >
                <Suspense fallback={<BrowseViewLoading />} >
                    <ErrorBoundary fallback={<BrowseViewError />} >
                        <BrowseView />
                    </ErrorBoundary>
                </Suspense>
            </HydrationBoundary>
        </>
    );
}