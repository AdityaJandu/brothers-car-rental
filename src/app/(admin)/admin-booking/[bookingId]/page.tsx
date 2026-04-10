import { getSession } from "@/lib/cached-session";
import { AdminBookingIdView, AdminBookingIdViewError, AdminBookingIdViewLoading } from "@/modules/admin/bookings/ui/views/AdminBookingIdView";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
    params: Promise<{ bookingId: string }>;
}

const Page = async ({ params }: Props) => {
    const { bookingId } = await params;

    // Run admin auth check and data prefetch in parallel
    const queryClient = getQueryClient();
    const [session] = await Promise.all([
        getSession(),
        queryClient.prefetchQuery(
            trpc.adminBookings.getOneAdmin.queryOptions({
                bookingId,
            })
        ),
    ]);

    if (!session) {
        redirect("/sign-up");
    }

    if (session.user.role !== 'admin') {
        redirect('/');
    }


    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<AdminBookingIdViewLoading />}>
                <ErrorBoundary fallback={<AdminBookingIdViewError />}>
                    <AdminBookingIdView bookingId={bookingId} />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    )
}

export default Page;