import { redirect } from "next/navigation";
import { getSession } from "@/lib/cached-session";
import { OnboardingView } from "@/modules/onboarding/ui/views/OnboardingView";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

export default async function Page() {

    const session = await getSession();

    if (session?.user?.role === "admin") {
        redirect("/dashboard");
    }

    const queryClient = getQueryClient();

    // Only prefetch if the user is authenticated (the tRPC procedure requires auth)
    if (session) {
        await queryClient.prefetchQuery(
            trpc.userBrowse.getAll.queryOptions({})
        );
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <OnboardingView />
        </HydrationBoundary>
    );
}