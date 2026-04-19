"use client";

import { ErrorState } from "@/components/self/error-state";
import { LoadingState } from "@/components/self/loading-state";
import { CheckoutForm } from "../components/CheckoutForm";
import { SummaryCard } from "../components/SummaryCard";
import { useSuspenseQuery, useMutation, useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Form imports
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { bookingFormSchema } from "../../schemas";
import { Form } from "@/components/ui/form";

interface CarBookingProps {
    carId: string;
}

export function CarBookingView({ carId }: CarBookingProps) {
    const trpc = useTRPC();
    const router = useRouter();

    const { data: car } = useSuspenseQuery(
        trpc.userBrowse.getOne.queryOptions({
            id: carId
        })
    );

    // Fetch unavailable date ranges for this car
    const { data: unavailableDates, isLoading: isLoadingDates, isError: isErrorDates } = useQuery(
        trpc.userCheckout.getUnavailableDates.queryOptions({ carId })
    );

    // Fetch active hubs
    const { data: activeLocations, isLoading: isLoadingLocs, isError: isErrorLocs } = useQuery(
        trpc.userLocations.getActiveLocations.queryOptions()
    );

    const createBooking = useMutation(
        trpc.userCheckout.create.mutationOptions({
            onSuccess: async () => {
                toast.success("Booking confirmed successfully!");
                router.push("/");
            },
            onError: (error) => {
                // Show specific message for booking conflicts
                if (error.message.includes("not available for the selected dates")) {
                    toast.error("This car is not available for the selected dates. Please choose different dates.");
                } else {
                    toast.error(error.message || "Failed to process booking.");
                }
            },
        }),
    );

    // Lift form state up to the parent
    const form = useForm<z.infer<typeof bookingFormSchema>>({
        resolver: zodResolver(bookingFormSchema),
        defaultValues: {
            userId: undefined,
            id: undefined,
            carId: car.id,
            pickUpLocation: car.locationId || "",
            dropOffLocation: "",
            fullName: "",
            email: "",
            phoneNumber: "",
            licenseNumber: "",
            paymentMethod: "cash",
            status: "pending",
            startDate: new Date(),
            endDate: new Date(new Date().getTime() + 86400000),
            dailyRate: car.pricePerDay,
            days: 1,
            protectionFee: 12000,
            surchargeFee: 4500,
            totalPrice: car.pricePerDay + 12000 + 4500,
        },
    });

    const onSubmit = (values: z.infer<typeof bookingFormSchema>) => {
        createBooking.mutate(values);
    };

    if (isLoadingDates || isLoadingLocs) {
        return <LoadingState title="Loading checkout" descr="Preparing availability and location data..." />;
    }

    if (isErrorDates || isErrorLocs) {
        return <ErrorState title="Failed to load checkout" descr="Unable to synchronize live availability data. Please refresh." />;
    }

    return (
        <div className="min-h-screen bg-white font-display text-slate-900 pb-20">
            <main className="mx-auto px-6 lg:px-12 pt-8">

                {/* Wrap the entire grid in the Form provider */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                        <div className="grid grid-cols-1 order-2 lg:order-1 lg:grid-cols-14 gap-12 lg:gap-20">

                            {/* Left Column: Form (Second on mobile, First on desktop) */}
                            <div className="order-2 lg:order-1 lg:col-span-9 flex flex-col gap-12">
                                <CheckoutForm
                                    isPending={createBooking.isPending}
                                    unavailableDates={unavailableDates ?? []}
                                    activeLocations={activeLocations ?? []}
                                />
                            </div>

                            {/* Right Column: Order Summary (First on mobile, Second on desktop) */}
                            <div className="order-1 lg:order-2 lg:col-span-5">
                                <div className="sticky top-8">
                                    <SummaryCard car={car} />
                                </div>
                            </div>

                        </div>
                    </form>
                </Form>
            </main>
        </div>
    );
}

export const CarBookingViewLoading = () => (
    <LoadingState
        title="Loading car"
        descr="This may take from a few seconds to a few minutes."
    />
);

export const CarBookingViewError = () => (
    <ErrorState
        title="Failed to load car"
        descr="Something went wrong while fetching car. Try to refresh page."
    />
);