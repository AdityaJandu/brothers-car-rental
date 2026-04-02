import { auth } from "@/lib/auth";
import { CarIdViewLoading, CarIdViewError, CarIdView } from "@/modules/user/car-id-view/ui/views/CarIdView";

import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";


interface Props {

    // carId -> should match the [carId] -> Folder
    params: Promise<{ carId: string }>;
};

const Page = async ({ params }: Props) => {
    const { carId } = await params;

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.browse.getOne.queryOptions({ id: carId }),
    );


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