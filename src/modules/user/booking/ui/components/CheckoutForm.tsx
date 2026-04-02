"use client";

import { useState } from "react";
import { CreditCard, Wallet, Banknote, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { GetOne } from "@/modules/user/browse/types";

interface CheckoutFormProps {
    car: GetOne;
}

export function CheckoutForm({ car }: CheckoutFormProps) {
    const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "wallet">("cash");

    return (
        <div className="flex flex-col gap-10 w-full">

            {/* PERSONAL DETAILS */}
            <section>
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2">
                        Personal Details
                    </h2>

                    {/* TODO: replace with user profile data */}
                    <p className="text-sm text-slate-500">
                        Please provide your official information.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        // TODO: prefill from user profile
                        { label: "Full Name", value: "", type: "text" },
                        { label: "Email Address", value: "", type: "email" },
                        { label: "Phone Number", value: "", type: "tel" },
                        { label: "License Number", value: "", type: "text" },
                    ].map((field) => (
                        <div key={field.label} className="flex flex-col gap-2">
                            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                {field.label}
                            </label>

                            <input
                                type={field.type}
                                defaultValue={field.value}
                                className="bg-[#F8F9FA] rounded-xl px-4 py-3.5 text-sm border border-transparent focus:ring-2 focus:ring-[#0F172A]/5"
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* PAYMENT METHOD */}
            <section>
                <div className="mb-6">
                    <h2 className="text-3xl font-bold">
                        Payment Method
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

                    {[
                        {
                            key: "cash",
                            icon: Banknote,
                            title: "Pay with Cash",
                            desc: "Pay at pickup",
                        },
                        {
                            key: "card",
                            icon: CreditCard,
                            title: "Credit / Debit Card",
                            desc: "Secure processing",
                        },
                        {
                            key: "wallet",
                            icon: Wallet,
                            title: "Digital Wallet",
                            desc: "UPI / Apple Pay",
                        },
                    ].map((method) => {
                        const Icon = method.icon;
                        const active = paymentMethod === method.key;

                        return (
                            <button
                                key={method.key}
                                onClick={() => setPaymentMethod(method.key as any)}
                                className={cn(
                                    "flex items-center justify-between p-5 rounded-md border transition",
                                    active
                                        ? "bg-white border-[#0F172A] shadow"
                                        : "bg-[#F8F9FA] border-transparent hover:bg-slate-100"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className="w-6 h-6 text-slate-700" />
                                    <div className="text-start">
                                        <p className="text-sm font-semibold">{method.title}</p>
                                        <p className="text-xs text-slate-500">{method.desc}</p>
                                    </div>
                                </div>

                                {active && (
                                    <CheckCircle2 className="w-5 h-5 text-[#D97706]" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* CARD INPUTS */}
                {paymentMethod === "card" && (
                    <div className="bg-white rounded-lg border p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">

                        {/* Card Number */}
                        <div className="sm:col-span-2 flex flex-col gap-2">
                            <label className="text-xs font-semibold uppercase text-slate-500">
                                Card Number
                            </label>

                            <input
                                placeholder="0000 0000 0000 0000"
                                className="bg-[#F8F9FA] rounded-xl px-4 py-3 w-full"
                            />
                        </div>

                        {/* Expiry */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold uppercase text-slate-500">
                                Expiry Date
                            </label>

                            <input
                                placeholder="MM/YY"
                                className="bg-[#F8F9FA] rounded-xl px-4 py-3 w-full"
                            />
                        </div>

                        {/* CVV */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold uppercase text-slate-500">
                                CVV
                            </label>

                            <input
                                placeholder="123"
                                className="bg-[#F8F9FA] rounded-xl px-4 py-3 w-full"
                            />
                        </div>

                    </div>
                )}
            </section>

            {/* ACTION */}
            <div className="flex flex-col sm:flex-row gap-4 md:pt-6">

                {/* Back button */}
                <Link href="/browse" className="w-full sm:w-auto">
                    <Button
                        variant="outline"
                        className="w-full sm:w-auto h-14 px-8"
                    >
                        <ArrowLeft />
                        Back to cars
                    </Button>
                </Link>

                {/* CTA */}
                <Button className="w-full sm:flex-1 h-14 bg-[#172033] text-white flex items-center justify-center gap-2">
                    Complete Booking
                    <ArrowRight className="w-5 h-5" />
                </Button>

            </div>
        </div>
    );
}