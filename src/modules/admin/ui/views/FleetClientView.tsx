"use client";

import { useState } from "react";
import Image from "next/image";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Edit2, Image as ImageIcon, CheckCircle2, XCircle, ArrowLeft, MoreVertical } from "lucide-react";


// Make sure to adjust this import path to wherever you saved AddCarForm!
import { CarForm } from "../components/CarForm";
import { cn } from "@/lib/utils";

export function FleetClientView() {
    const trpc = useTRPC();

    const { data, refetch } = useSuspenseQuery(trpc.browse.getAll.queryOptions({ pageSize: 50 }));

    // --- NEW STATE ---
    // 1. Track which car is currently having its photo updated in the table
    const [editingImageId, setEditingImageId] = useState<string | null>(null);
    // 2. Track whether we are looking at the table or the "Add New" form
    const [isAddingNew, setIsAddingNew] = useState(false);

    const cars = data.items;

    // --- RENDER: ADD NEW VEHICLE VIEW ---
    if (isAddingNew) {
        return (
            <div className="max-w-6xl mx-auto  px-6 py-12 animate-in fade-in duration-300">
                <div className="flex items-center gap-6 mb-8">
                    {/* Back Button */}
                    <Button
                        variant="outline"
                        onClick={() => setIsAddingNew(false)}
                        className="rounded-xl"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Fleet
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-primary font-heading">Add New Vehicle</h1>
                        <p className="text-muted-foreground mt-1 font-sans">Register a new car to your inventory.</p>
                    </div>
                </div>

                {/* The Form we just built! */}
                {/* When it successfully submits, we close the form and instantly refetch the table data */}
                <CarForm
                    onSuccess={() => {
                        setIsAddingNew(false);
                        refetch();
                    }}
                />
            </div>
        );
    }

    // --- RENDER: STANDARD FLEET TABLE VIEW ---
    return (
        <div className="my-auto px-6 py-12 animate-in fade-in duration-300">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-primary font-heading">Fleet Management</h1>
                    <p className="text-muted-foreground mt-1 font-sans">Manage inventory, pricing, and media.</p>
                </div>
                {/* Trigger the state change to show the form! */}
                <Button
                    onClick={() => setIsAddingNew(true)}
                    className="bg-primary hover:bg-[#122038] text-white font-bold rounded-xl transition-colors"
                >
                    + Add New Vehicle
                </Button>
            </div>

            {/* Admin Data Table/List */}
            <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
                {/* Table Header */}
                <div className="grid grid-cols-12 items-center px-6 py-4 bg-[#f6f7fb] text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    <div className="col-span-4">Car Details</div>
                    <div className="col-span-2">Plate Number</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Daily Rate</div>
                    <div className="col-span-2 text-right">Actions</div>
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-border/50">
                    {cars.map((car) => (
                        <div key={car.id} className="flex flex-col">

                            {/* Main Row */}
                            <div className=" grid grid-cols-12 items-center px-6 py-5 hover:bg-[#f6f7fb] transition-colors">

                                {/* --- CAR DETAILS --- */}
                                <div className="col-span-4 flex items-center gap-4">
                                    <div className="relative w-[80px] h-[50px] rounded-xl overflow-hidden bg-[#f1f3f9] shrink-0">
                                        <Image
                                            src={car.image || "https://placehold.co/800x600/1a1c23/ffffff?text=No+Photo"}
                                            alt={car.name}
                                            fill
                                            className="object-cover"
                                            sizes="100px"
                                        />
                                    </div>

                                    <div className="flex flex-col justify-center">
                                        <p className="text-[15px] font-extrabold text-[#0B0F3B]">
                                            {car.name}
                                        </p>
                                        <p className="text-xs text-slate-400 font-medium">
                                            {car.category || "—"}
                                        </p>
                                    </div>
                                </div>

                                {/* --- PLATE NUMBER --- */}
                                <div className="col-span-2">
                                    <span className="text-sm font-semibold text-slate-500 tracking-wide uppercase">
                                        {car.plateNumber}
                                    </span>
                                </div>

                                {/* --- STATUS --- */}
                                <div className="col-span-2">
                                    {car.status === "available" && (
                                        <span className="text-[11px] font-bold text-emerald-700 bg-[#e6f6ee] px-3 py-1.5 rounded-full uppercase tracking-widest">
                                            Available
                                        </span>
                                    )}

                                    {car.status === "rented" && (
                                        <span className="text-[11px] font-bold text-[#4b5de4] bg-[#e7ebff] px-3 py-1.5 rounded-full uppercase tracking-widest">
                                            Rented
                                        </span>
                                    )}

                                    {car.status === "maintenance" && (
                                        <span className="text-[11px] font-bold text-[#d94444] bg-[#fdecec] px-3 py-1.5 rounded-full uppercase tracking-widest">
                                            Maintenance
                                        </span>
                                    )}
                                </div>

                                {/* --- PRICE --- */}
                                <div className="col-span-2">
                                    <span className="text-[16px] font-extrabold text-[#0B0F3B]">
                                        ₹{car.pricePerDay.toLocaleString()}
                                    </span>
                                </div>

                                {/* --- ACTIONS --- */}
                                <div className="col-span-2 flex justify-end items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                            setEditingImageId(
                                                editingImageId === car.id ? null : car.id
                                            )
                                        }
                                        className={cn(
                                            "rounded-full",
                                            editingImageId === car.id && "bg-[#eef1ff] text-[#0B0F3B]"
                                        )}
                                    >
                                        <ImageIcon className="w-4 h-4" />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full text-slate-400 hover:text-[#0B0F3B]"
                                    >
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* --- EXPANDABLE MEDIA SECTION --- */}
                            {editingImageId === car.id && (
                                <div className="bg-[#f8f9fc] px-6 py-6 border-t border-[#eef0f5]">
                                    <div className="max-w-md mx-auto text-center text-sm text-muted-foreground">
                                        Image uploader goes here...
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Empty State if no cars exist */}
                    {cars.length === 0 && (
                        <div className="p-12 text-center flex flex-col items-center justify-center">
                            <p className="text-muted-foreground mb-4">Your fleet is currently empty.</p>
                            <Button onClick={() => setIsAddingNew(true)} variant="outline">
                                Add your first vehicle
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}