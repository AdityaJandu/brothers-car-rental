"use client";

import { Wallet, Banknote, CheckCircle2, ArrowRight, ArrowLeft, Calendar as CalendarIcon, Loader2, AlertCircle, BadgeCheck, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Dates
import { format, differenceInDays, eachDayOfInterval, addDays } from "date-fns";
import { type DateRange } from "react-day-picker";

// Form & Validation
import { useFormContext } from "react-hook-form";
import * as z from "zod";
import { bookingInsertSchema } from "../../schemas";

// UI Components
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/modules/user/browse/ui/components/DatePicker";
import { useMemo } from "react";

interface UnavailableDateRange {
    startDate: string | Date;
    endDate: string | Date;
}

interface CheckoutFormProps {
    isPending: boolean;
    unavailableDates: UnavailableDateRange[];
    activeLocations: { id: string; name: string; city: string; fullAddress: string }[];
    missingProfile: boolean;
    prefilled: {
        fullName: boolean;
        email: boolean;
        phoneNumber: boolean;
        licenseNumber: boolean;
    };
}

/**
 * Check if a selected date range overlaps with any unavailable range.
 * Uses the same overlap formula as the backend: newStart < existingEnd AND newEnd > existingStart
 */
function hasOverlap(
    start: Date,
    end: Date,
    unavailableDates: UnavailableDateRange[]
): boolean {
    return unavailableDates.some((range) => {
        const rangeStart = new Date(range.startDate);
        const rangeEnd = new Date(range.endDate);
        return start < rangeEnd && end > rangeStart;
    });
}

/**
 * Find the next available date after a given date, considering all unavailable ranges.
 */
function getNextAvailableDate(
    afterDate: Date,
    unavailableDates: UnavailableDateRange[]
): Date | null {
    if (unavailableDates.length === 0) return afterDate;

    // Sort ranges by start date
    const sorted = [...unavailableDates]
        .map((r) => ({
            start: new Date(r.startDate),
            end: new Date(r.endDate),
        }))
        .sort((a, b) => a.start.getTime() - b.start.getTime());

    let candidate = new Date(afterDate);

    for (const range of sorted) {
        // If candidate is before this range starts, it's available
        if (candidate < range.start) {
            return candidate;
        }
        // If candidate falls within this range, push it past the end
        if (candidate >= range.start && candidate < range.end) {
            candidate = new Date(range.end);
        }
    }

    return candidate;
}

export function CheckoutForm({ isPending, unavailableDates, activeLocations, missingProfile, prefilled }: CheckoutFormProps) {
    // Tap into the parent's form state
    const form = useFormContext<z.infer<typeof bookingInsertSchema>>();

    // Watchers for reactive UI updates
    const paymentMethod = form.watch("paymentMethod");
    const startDate = form.watch("startDate");
    const endDate = form.watch("endDate");

    // Build the disabled dates matcher for react-day-picker
    const disabledDates = useMemo(() => {
        const matchers: Array<{ before: Date } | Date> = [
            { before: new Date() }, // Can't book in the past
        ];

        // Add each day within unavailable ranges as individually disabled
        for (const range of unavailableDates) {
            const rangeStart = new Date(range.startDate);
            const rangeEnd = new Date(range.endDate);

            // Generate all days in the range (exclusive end — don't block the return day)
            if (rangeStart < rangeEnd) {
                const days = eachDayOfInterval({
                    start: rangeStart,
                    end: addDays(rangeEnd, -1), // exclusive end
                });
                matchers.push(...days);
            }
        }

        return matchers;
    }, [unavailableDates]);

    // Check if current selection has a conflict
    const selectionHasConflict = useMemo(() => {
        if (!startDate || !endDate) return false;
        return hasOverlap(new Date(startDate), new Date(endDate), unavailableDates);
    }, [startDate, endDate, unavailableDates]);

    // Next available date hint
    const nextAvailable = useMemo(() => {
        if (!selectionHasConflict || !endDate) return null;
        return getNextAvailableDate(new Date(endDate), unavailableDates);
    }, [selectionHasConflict, endDate, unavailableDates]);

    // Handle Date Changes and recalculate prices automatically
    const handleDateChange = (range: DateRange | undefined) => {
        if (range?.from) {
            form.setValue("startDate", range.from, { shouldValidate: true });
        }

        if (range?.to && range?.from) {
            form.setValue("endDate", range.to, { shouldValidate: true });

            // Calculate total days (ensure it's at least 1 day)
            const calculatedDays = Math.max(1, differenceInDays(range.to, range.from));
            form.setValue("days", calculatedDays);

            // Calculate total price
            const dailyRate = form.getValues("dailyRate");
            const protectionFee = form.getValues("protectionFee");
            const surchargeFee = form.getValues("surchargeFee");

            form.setValue("totalPrice", (dailyRate * calculatedDays) + protectionFee + surchargeFee);
        }
    };

    return (
        <div className="flex flex-col gap-10 w-full">

            {/* BOOKING SCHEDULE */}
            <section>
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2">Booking Schedule</h2>
                    <p className="text-sm text-slate-500">Select your pick-up and drop-off dates.</p>
                </div>

                <DatePicker
                    date={{ from: startDate, to: endDate }}
                    setDate={handleDateChange}
                    disabled={disabledDates}
                >
                    <button
                        type="button"
                        className="flex items-center justify-between w-full bg-[#F8F9FA] hover:bg-slate-100 border border-transparent focus:ring-2 focus:ring-[#0F172A]/10 rounded-md px-5 py-4 transition-colors text-left"
                    >
                        <div className="flex flex-col gap-1">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                Rental Period
                            </span>
                            <span className="text-sm font-semibold text-slate-900">
                                {startDate && endDate
                                    ? `${format(startDate, "MMM dd, yyyy")} - ${format(endDate, "MMM dd, yyyy")}`
                                    : startDate
                                        ? format(startDate, "MMM dd, yyyy")
                                        : "Select dates..."}
                            </span>
                        </div>
                        <CalendarIcon className="w-5 h-5 text-slate-400" />
                    </button>
                </DatePicker>

                {form.formState.errors.endDate && (
                    <p className="text-xs text-red-500 mt-2">{form.formState.errors.endDate.message}</p>
                )}

                {/* Availability Banner */}
                {startDate && endDate && (
                    <div className={cn(
                        "mt-3 flex items-start gap-2.5 rounded-md px-4 py-3 text-sm transition-all animate-in fade-in slide-in-from-top-1 duration-200",
                        selectionHasConflict
                            ? "bg-red-50 border border-red-200 text-red-700"
                            : "bg-emerald-50 border border-emerald-200 text-emerald-700"
                    )}>
                        {selectionHasConflict ? (
                            <>
                                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-semibold">This car is unavailable for the selected dates</p>
                                    {nextAvailable && (
                                        <p className="text-xs mt-1 opacity-80">
                                            Next available from: {format(nextAvailable, "MMM dd, yyyy")}
                                        </p>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                                <p className="font-semibold">Available for selected dates</p>
                            </>
                        )}
                    </div>
                )}
            </section>

            {/* LOCATION DETAILS */}
            <section>
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2">Location</h2>
                    <p className="text-sm text-slate-500">Where would you like to pick up and drop off the car?</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { name: "pickUpLocation", label: "Pick-up Location" },
                        { name: "dropOffLocation", label: "Drop-off Location" },
                    ].map((field) => (
                        <FormField
                            key={field.name}
                            control={form.control}
                            name={field.name as "pickUpLocation" | "dropOffLocation"}
                            render={({ field: formField }) => (
                                <FormItem className="flex flex-col gap-2 space-y-0">
                                    <label className="text-[11px] px-2 font-semibold uppercase tracking-wider text-slate-500">
                                        {field.label}
                                    </label>
                                    <Select onValueChange={formField.onChange} value={formField.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-[#F8F9FA] rounded-md px-4 py-5.5 text-sm border border-transparent focus:outline-none focus:ring-2 focus:ring-[#0F172A]/10 w-full h-auto">
                                                <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {activeLocations.map((loc) => (
                                                <SelectItem key={loc.id} value={loc.id}>
                                                    {loc.name} ({loc.city})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-xs text-red-500" />
                                </FormItem>
                            )}
                        />
                    ))}
                </div>
            </section>

            {/* PERSONAL DETAILS */}
            <section>
                <div className="mb-6">
                    <h2 className="text-3xl font-bold mb-2">Personal Details</h2>
                    <p className="text-sm text-slate-500">Your official information for the booking.</p>
                </div>

                {/* Missing profile banner */}
                {missingProfile && (
                    <div className="mb-6 flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-md px-4 py-3 text-sm animate-in fade-in slide-in-from-top-1 duration-200">
                        <TriangleAlert className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" />
                        <div>
                            <p className="font-semibold">Your profile is incomplete</p>
                            <p className="text-xs mt-0.5 opacity-80">
                                Save your phone number and driving licence on your{" "}
                                <a href="/profile" className="underline font-semibold hover:text-amber-900">
                                    profile
                                </a>{" "}
                                to skip this section on future bookings.
                            </p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {([
                        { name: "fullName", label: "Full Name", type: "text" },
                        { name: "email", label: "Email Address", type: "email" },
                        { name: "phoneNumber", label: "Phone Number", type: "tel" },
                        { name: "licenseNumber", label: "License Number", type: "text" },
                    ] as const).map((field) => {
                        const isSaved = prefilled[field.name as keyof typeof prefilled];
                        return (
                            <FormField
                                key={field.name}
                                control={form.control}
                                name={field.name as "fullName" | "email" | "phoneNumber" | "licenseNumber"}
                                render={({ field: formField }) => (
                                    <FormItem className="flex flex-col gap-1 space-y-0">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                                {field.label}
                                            </label>
                                            {isSaved && (
                                                <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                                                    <BadgeCheck className="w-3.5 h-3.5" />
                                                    Saved
                                                </span>
                                            )}
                                        </div>
                                        <FormControl>
                                            <input
                                                type={field.type}
                                                {...formField}
                                                className="bg-[#F8F9FA] rounded-md px-4 py-3.5 text-sm border border-transparent focus:outline-none focus:ring-2 focus:ring-[#0F172A]/10 w-full"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs text-red-500" />
                                    </FormItem>
                                )}
                            />
                        );
                    })}
                </div>
            </section>

            {/* PAYMENT METHOD */}
            <section>
                <div className="mb-6">
                    <h2 className="text-3xl font-bold">Payment Method</h2>
                    <p className="text-sm text-slate-500 mt-1">Paid at drop-off only — cash or UPI accepted.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {[
                        { key: "cash", icon: Banknote, title: "Cash on Drop-off", desc: "Pay in cash at return" },
                        { key: "wallet", icon: Wallet, title: "UPI", desc: "Pay via any UPI app at drop-off" },
                    ].map((method) => {
                        const Icon = method.icon;
                        const active = paymentMethod === method.key;

                        return (
                            <button
                                key={method.key}
                                type="button"
                                onClick={() => form.setValue("paymentMethod", method.key as "cash" | "wallet", { shouldValidate: true })}
                                className={cn(
                                    "flex items-center justify-between p-5 rounded-md border transition",
                                    active ? "bg-white border-[#0F172A] shadow" : "bg-[#F8F9FA] border-transparent hover:bg-slate-100"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className="w-6 h-6 text-slate-700" />
                                    <div className="text-start">
                                        <p className="text-sm font-semibold">{method.title}</p>
                                        <p className="text-xs text-slate-500">{method.desc}</p>
                                    </div>
                                </div>
                                {active && <CheckCircle2 className="w-5 h-5 text-[#517fa4]" />}
                            </button>
                        );
                    })}
                </div>

            </section>

            {/* ACTION */}
            <div className="flex flex-col sm:grid sm:grid-cols-8 gap-4 md:pt-6">
                <Link href="/browse" className="w-full sm:col-span-3">
                    <Button type="button" variant="outline" className="w-full h-14 px-8" disabled={isPending}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to cars
                    </Button>
                </Link>

                <Button
                    type="submit"
                    disabled={isPending || selectionHasConflict}
                    className="w-full sm:col-span-5 h-14 bg-[#1a2f3d] hover:bg-[#0F172A] text-white flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-70"
                >
                    {isPending ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                    ) : selectionHasConflict ? (
                        <>Dates Unavailable</>
                    ) : (
                        <>Complete Booking <ArrowRight className="w-5 h-5" /></>
                    )}
                </Button>
            </div>
        </div>
    );
}