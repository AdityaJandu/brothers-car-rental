"use client";

import { CreditCard, Wallet, Banknote, CheckCircle2, ArrowRight, ArrowLeft, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Dates
import { format, differenceInDays } from "date-fns";
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
import { DatePicker } from "@/modules/user/browse/ui/components/DatePicker";

interface CheckoutFormProps {
    isPending: boolean;
}

export function CheckoutForm({ isPending }: CheckoutFormProps) {
    // Tap into the parent's form state
    const form = useFormContext<z.infer<typeof bookingInsertSchema>>();

    // Watchers for reactive UI updates
    const paymentMethod = form.watch("paymentMethod");
    const startDate = form.watch("startDate");
    const endDate = form.watch("endDate");

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
                    disabled={{ before: new Date() }}
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
            </section>

            {/* PERSONAL DETAILS */}
            <section>
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2">Personal Details</h2>
                    <p className="text-sm text-slate-500">Please provide your official information.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { name: "fullName", label: "Full Name", type: "text" },
                        { name: "email", label: "Email Address", type: "email" },
                        { name: "phoneNumber", label: "Phone Number", type: "tel" },
                        { name: "licenseNumber", label: "License Number", type: "text" },
                    ].map((field) => (
                        <FormField
                            key={field.name}
                            control={form.control}
                            name={field.name as "fullName" | "email" | "phoneNumber" | "licenseNumber"}
                            render={({ field: formField }) => (
                                <FormItem className="flex flex-col gap-1 space-y-0">
                                    <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                        {field.label}
                                    </label>
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
                    ))}
                </div>
            </section>

            {/* PAYMENT METHOD */}
            <section>
                <div className="mb-6">
                    <h2 className="text-3xl font-bold">Payment Method</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {[
                        { key: "cash", icon: Banknote, title: "Pay with Cash", desc: "Pay at pickup" },
                        { key: "card", icon: CreditCard, title: "Credit / Debit Card", desc: "Secure processing" },
                        { key: "wallet", icon: Wallet, title: "Digital Wallet", desc: "UPI / Apple Pay" },
                    ].map((method) => {
                        const Icon = method.icon;
                        const active = paymentMethod === method.key;

                        return (
                            <button
                                key={method.key}
                                type="button"
                                onClick={() => form.setValue("paymentMethod", method.key as "cash" | "card" | "wallet", { shouldValidate: true })}
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
                                {active && <CheckCircle2 className="w-5 h-5 text-[#D97706]" />}
                            </button>
                        );
                    })}
                </div>

                {/* CARD INPUTS */}
                {paymentMethod === "card" && (
                    <div className="bg-white rounded-md border p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="sm:col-span-2 flex flex-col gap-2">
                            <label className="text-xs font-semibold uppercase text-slate-500">Card Number</label>
                            <input placeholder="0000 0000 0000 0000" className="bg-[#F8F9FA] rounded-md px-4 py-3 w-full font-mono" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold uppercase text-slate-500">Expiry Date</label>
                            <input placeholder="MM/YY" className="bg-[#F8F9FA] rounded-md px-4 py-3 w-full font-mono" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold uppercase text-slate-500">CVV</label>
                            <input placeholder="123" maxLength={4} className="bg-[#F8F9FA] rounded-md px-4 py-3 w-full font-mono" />
                        </div>
                    </div>
                )}
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
                    disabled={isPending}
                    className="w-full sm:col-span-5 h-14 bg-[#172033] hover:bg-[#0F172A] text-white flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-70"
                >
                    {isPending ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                    ) : (
                        <>Complete Booking <ArrowRight className="w-5 h-5" /></>
                    )}
                </Button>
            </div>
        </div>
    );
}