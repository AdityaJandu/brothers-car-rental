import { ProfileView, ProfileViewError, ProfileViewLoading } from "@/modules/user/profile/ui/views/ProfileView";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";


const Page = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        redirect("/sign-in");
    }

    const queryClient = getQueryClient();
    await queryClient.prefetchQuery(
        trpc.userProfile.getUser.queryOptions()
    );

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<ProfileViewLoading />}>
                <ErrorBoundary fallback={<ProfileViewError />}>
                    <ProfileView />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    );
};

export default Page;
