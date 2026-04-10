import { auth } from "@/lib/auth";
import { AdminBookingIdView, AdminBookingIdViewError, AdminBookingIdViewLoading } from "@/modules/admin/bookings/ui/views/AdminBookingIdView";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
    params: Promise<{ bookingId: string }>;
}

const Page = async ({ params }: Props) => {
    const { bookingId } = await params;

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-up");
    }

    if (session.user.role !== 'admin') {
        redirect('/');
    }

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.adminBookings.getOneAdmin.queryOptions({
            bookingId,
        })
    );


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