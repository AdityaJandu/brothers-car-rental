"use client";

import { ErrorState } from "@/components/self/error-state";
import { LoadingState } from "@/components/self/loading-state";
import { CheckoutForm } from "../components/CheckoutForm";
import { SummaryCard } from "../components/SummaryCard";
import { useSuspenseQuery, useMutation } from "@tanstack/react-query";
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

    // Single merged fetch — car + user + unavailable dates + active locations
    const { data } = useSuspenseQuery(
        trpc.userCheckout.getCheckoutData.queryOptions({ carId })
    );

    const { car, user, unavailableDates, activeLocations } = data;

    // Only use car's home hub as default if it's actually active
    const defaultPickup = activeLocations?.some(loc => loc.id === car.locationId)
        ? car.locationId
        : "";

    // True when the profile is incomplete — triggers the banner in CheckoutForm
    const missingProfile = !user.phone || !user.licenseNumber;

    const createBooking = useMutation(
        trpc.userCheckout.create.mutationOptions({
            onSuccess: async () => {
                toast.success("Booking confirmed successfully!");
                router.push("/");
            },
            onError: (error) => {
                if (error.message.includes("not available for the selected dates")) {
                    toast.error("This car is not available for the selected dates. Please choose different dates.");
                } else {
                    toast.error(error.message || "Failed to process booking.");
                }
            },
        }),
    );

    // Form initialised with saved user data — fields are always editable
    const form = useForm<z.infer<typeof bookingFormSchema>>({
        resolver: zodResolver(bookingFormSchema),
        defaultValues: {
            userId: undefined,
            id: undefined,
            carId: car.id,
            pickUpLocation: defaultPickup,
            dropOffLocation: defaultPickup,
            fullName: user.name ?? "",
            email: user.email ?? "",
            phoneNumber: user.phone ?? "",
            licenseNumber: user.licenseNumber ?? "",
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

    return (
        <div className="min-h-screen bg-white font-display text-slate-900 pb-20">
            <main className="mx-auto px-6 lg:px-12 pt-8">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                        <div className="grid grid-cols-1 order-2 lg:order-1 lg:grid-cols-14 gap-12 lg:gap-20">

                            {/* Left Column: Form */}
                            <div className="order-2 lg:order-1 lg:col-span-9 flex flex-col gap-12">
                                <CheckoutForm
                                    isPending={createBooking.isPending}
                                    unavailableDates={unavailableDates}
                                    activeLocations={activeLocations!}
                                    missingProfile={missingProfile}
                                    prefilled={{
                                        fullName: !!user.name,
                                        email: !!user.email,
                                        phoneNumber: !!user.phone,
                                        licenseNumber: !!user.licenseNumber,
                                    }}
                                />
                            </div>

                            {/* Right Column: Summary */}
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