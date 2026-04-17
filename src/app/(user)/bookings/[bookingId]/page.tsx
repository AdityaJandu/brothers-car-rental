import { BookingIdView, BookingIdViewError, BookingIdViewLoading } from "@/modules/user/bookings/ui/views/BookingIdView";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";


interface Props {
    params: Promise<{ bookingId: string }>;
}

const Page = async ({ params }: Props) => {
    const { bookingId } = await params;

    const queryClient = getQueryClient();
    await queryClient.prefetchQuery(
        trpc.userBookings.getBookingWithDetails.queryOptions({
            bookingId: bookingId
        })
    );


    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<BookingIdViewLoading />}>
                <ErrorBoundary fallback={<BookingIdViewError />}>
                    <BookingIdView bookingId={bookingId} />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    );
}

export default Page;