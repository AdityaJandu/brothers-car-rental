"use client";

import { useState } from "react";
import { ErrorState } from "@/components/self/error-state"
import { LoadingState } from "@/components/self/loading-state";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { AdminBookingCustomerInfo } from "../components/admin-booking-customer-info";
import { AdminBookingRentalInfo } from "../components/admin-booking-rental-info";
import { AdminBookingPricingInfo } from "../components/admin-booking-pricing-info";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AdminBookingIdViewProps {
    bookingId: string;
};

export const AdminBookingIdView = ({ bookingId }: AdminBookingIdViewProps) => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const { data } = useSuspenseQuery(trpc.adminBookings.getOneAdmin.queryOptions({
        bookingId
    }));

    // Initialize local state for the select dropdown
    const [status, setStatus] = useState(data?.status.toLowerCase() || 'pending');

    const updateStatus = useMutation(
        trpc.adminBookings.updateOneAdmin.mutationOptions({
            onSuccess: () => {
                toast.success("Status updated successfully");
                queryClient.invalidateQueries(trpc.adminBookings.getOneAdmin.queryOptions({
                    bookingId
                }));
            },
            onError: () => {
                toast.error("Failed to update status");
            }
        })
    );

    const isPending = updateStatus.isPending;

    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus.toLowerCase());
    };

    const handleSave = () => {
        updateStatus.mutate({
            bookingId: data.id,
            status: status as "pending" | "confirmed" | "cancelled" | "completed"
        });
    };

    const hasChanged = status !== data.status.toLowerCase();

    if (!data) return null;

    return (
        <div className="min-h-screen bg-muted p-4 md:p-8 w-full">
            <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full pb-10">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Booking Details</h1>
                        <p className="text-muted-foreground text-sm">
                            ID: <span className="font-mono">{data.id}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Select value={status} onValueChange={handleStatusChange}>
                            <SelectTrigger className="w-[200px] h-10 capitalize">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent position="popper" className="rounded-sm">
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                        {hasChanged && (
                            <Button onClick={handleSave} className="h-10 px-6 font-medium">
                                {isPending ? "Saving..." : "Save"}
                            </Button>
                        )}
                    </div>
                </div>

                <Separator className="bg-border/60" />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <AdminBookingCustomerInfo
                            fullName={data.fullName}
                            email={data.email}
                            phoneNumber={data.phoneNumber}
                            licenseNumber={data.licenseNumber}
                        />
                        <AdminBookingRentalInfo
                            carId={data.carId}
                            startDate={data.startDate}
                            endDate={data.endDate}
                            days={data.days}
                            carName={data.carName}
                            carMake={data.carMake}
                            carModel={data.carModel}
                            carYear={data.carYear}
                        />
                    </div>

                    <div className="lg:col-span-1">
                        <AdminBookingPricingInfo
                            dailyRate={data.dailyRate}
                            days={data.days}
                            protectionFee={data.protectionFee}
                            surchargeFee={data.surchargeFee}
                            totalPrice={data.totalPrice}
                            paymentMethod={data.paymentMethod}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export const AdminBookingIdViewLoading = () => {
    return (
        <LoadingState
            title="Loading booking"
            descr="This may take from a few seconds to a few minutes."
        />
    );
}

export const AdminBookingIdViewError = () => {
    return (<ErrorState
        title="Failed to load booking"
        descr="Something went wrong while fetching booking. Try to refresh page."
    />);
};

