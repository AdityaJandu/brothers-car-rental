"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { FiltersBar } from "../components/FiltersBar";
import { CarGrid } from "../components/CarGrid";
import { LoadingState } from "@/components/self/loading-state";
import { ErrorState } from "@/components/self/error-state";

export function BrowseView() {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.browse.getAll.queryOptions({}));

    return (
        <div className="min-h-screen px-6 lg:px-12 py-8">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-primary font-heading">
                    Browse Cars
                </h1>
                <p className="text-muted-foreground mt-1">
                    Find the perfect ride for your journey
                </p>
            </div>

            {/* Filters */}
            <FiltersBar />

            {/* Cars */}
            <CarGrid cars={data.items} />

        </div>
    );
}


export const BrowseViewLoading = () => {
    return (
        <LoadingState
            title="Loading data"
            descr="This may take from a few seconds to a few minutes."
        />
    );
};

export const BrowseViewError = () => {
    return (
        <ErrorState
            title="Failed to load data"
            descr="Something went wrong while fetching cars. Try to refresh page."
        />
    );
};