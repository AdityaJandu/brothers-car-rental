import { getSession } from "@/lib/cached-session";
import { CarIdViewLoading, CarIdViewError, CarIdView } from "@/modules/user/car-id-view/ui/views/CarIdView";

import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";


interface Props {

    // carId -> should match the [carId] -> Folder
    params: Promise<{ carId: string }>;
};

const Page = async ({ params }: Props) => {
    const { carId } = await params;

    // Run auth check and data prefetch in parallel
    const queryClient = getQueryClient();
    const [session] = await Promise.all([
        getSession(),
        queryClient.prefetchQuery(
            trpc.userBrowse.getOne.queryOptions({ id: carId }),
        ),
    ]);

    if (!session) {
        redirect("/sign-in");
    }


    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<CarIdViewLoading />}>
                <ErrorBoundary fallback={<CarIdViewError />}>
                    <CarIdView carId={carId} />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    );


}

export default Page;