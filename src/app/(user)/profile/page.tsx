import { ProfileView, ProfileViewError, ProfileViewLoading } from "@/modules/user/profile/ui/views/ProfileView";
import { getSession } from "@/lib/cached-session";
import { redirect } from "next/navigation";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";


const Page = async () => {
    // Run auth check and data prefetch in parallel
    const queryClient = getQueryClient();
    const [session] = await Promise.all([
        getSession(),
        queryClient.prefetchQuery(
            trpc.userProfile.getUser.queryOptions()
        ),
    ]);

    if (!session) {
        redirect("/sign-in");
    }

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
