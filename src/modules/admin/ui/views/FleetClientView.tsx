"use client";

import { useState } from "react";
import Image from "next/image";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Edit2, Image as ImageIcon, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";


// Make sure to adjust this import path to wherever you saved AddCarForm!
import { CarForm } from "../components/CarForm";

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
        <div className=" mx-auto px-6 py-12 animate-in fade-in duration-300">

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
            <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 p-4 bg-muted/30 border-b border-border/50 text-xs font-bold text-muted-foreground uppercase tracking-wider font-sans">
                    <div className="col-span-4">Vehicle</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Price/Day</div>
                    <div className="col-span-4 text-right">Actions</div>
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-border/50">
                    {cars.map((car) => (
                        <div key={car.id} className="flex flex-col">
                            {/* Main Row */}
                            <div className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/10 transition-colors">

                                {/* Vehicle Info */}
                                <div className="col-span-4 flex items-center gap-4">
                                    <div className="relative w-16 h-12 bg-muted rounded-md overflow-hidden shrink-0 border border-border">
                                        <Image
                                            src={car.image || "https://placehold.co/800x600/1a1c23/ffffff?text=No+Photo"}
                                            alt={car.name}
                                            fill
                                            className="object-cover"
                                            sizes="64px"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-bold text-primary font-sans">{car.name}</p>
                                        <p className="text-xs text-muted-foreground">{car.plateNumber}</p>
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="col-span-2 flex items-center">
                                    {car.status === "available" ? (
                                        <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> Active
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full capitalize">
                                            <XCircle className="w-3.5 h-3.5" /> {car.status}
                                        </span>
                                    )}
                                </div>

                                {/* Price */}
                                <div className="col-span-2 font-mono text-sm font-medium text-primary">
                                    ₹{car.pricePerDay}
                                </div>

                                {/* Actions */}
                                <div className="col-span-4 flex items-center justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setEditingImageId(editingImageId === car.id ? null : car.id)}
                                        className={editingImageId === car.id ? "bg-muted" : ""}
                                    >
                                        <ImageIcon className="w-4 h-4 mr-2" />
                                        Media
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Edit2 className="w-4 h-4 mr-2" />
                                        Edit
                                    </Button>
                                </div>
                            </div>

                            {/* The "Expandable" Uploader Section */}
                            {editingImageId === car.id && (
                                <div className="bg-muted/10 border-t border-border/50 p-6 animate-in slide-in-from-top-2 duration-200">
                                    <div className="max-w-md mx-auto text-center text-sm text-muted-foreground">
                                        {/* You can drop your ImageUploader component here later if you want standalone image editing! */}
                                        Image Uploader goes here...
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