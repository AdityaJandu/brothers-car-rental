import { BrowseView, BrowseViewLoading, BrowseViewError } from "@/modules/user/browse/ui/views/BrowseView";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SearchParams } from "nuqs/server";
import { loadSearchParamsUser } from "@/modules/user/browse/params";
import { FiltersBar } from "@/modules/user/browse/ui/components/FiltersBar";


interface Props {
    searchParams: Promise<SearchParams>
}

export default async function Page({ searchParams }: Props) {
    const filters = await loadSearchParamsUser(searchParams);

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    // Pre-fetch
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.browse.getAll.queryOptions({
            ...filters
        }),
    );

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