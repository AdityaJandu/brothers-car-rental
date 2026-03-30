"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";


import { useTRPC } from "@/trpc/client";
import { carInsertSchema } from "../../schemas"; // Adjust import path
import { supabaseClient } from "@/lib/supabase-client"; // Adjust import path
import { car } from "@/db/schema"; // Adjust import path

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/self/loading-state";

interface CarFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    initialValues?: z.infer<typeof carInsertSchema> & { id: string };
}

export function CarForm({ onSuccess, onCancel, initialValues }: CarFormProps) {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const [isUploading, setIsUploading] = useState(false);

    const isEdit = !!initialValues?.id;

    // --- 1. SETUP FORM ---
    const form = useForm<z.infer<typeof carInsertSchema>>({
        resolver: zodResolver(carInsertSchema),
        defaultValues: {
            name: initialValues?.name ?? "",
            make: initialValues?.make ?? "",
            model: initialValues?.model ?? "",
            category: initialValues?.category ?? "",
            plateNumber: initialValues?.plateNumber ?? "",
            year: initialValues?.year ?? new Date().getFullYear(),
            pricePerDay: initialValues?.pricePerDay ?? 0,
            seats: initialValues?.seats ?? 4,
            transmission: initialValues?.transmission ?? "automatic",
            fuelType: initialValues?.fuelType ?? "petrol",
            status: initialValues?.status ?? "available",
            isActive: initialValues?.isActive ?? true,
            features: initialValues?.features ?? [],
            image: initialValues?.image ?? undefined,
        },
    });

    // --- 2. MUTATIONS ---
    const createCar = useMutation(
        trpc.admin.create.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(
                    trpc.browse.getAll.queryOptions({ pageSize: 50 })
                );
                toast.success("Vehicle successfully added to the fleet!");
                form.reset();
                onSuccess?.();
            },
            onError: (error) => {
                toast.error(`Failed to create car: ${error.message}`);
            },
        })
    );

    // const updateCar = useMutation(
    //     // Assuming you have an update procedure in your tRPC router
    //     trpc.admin.update.mutationOptions({
    //         onSuccess: async () => {
    //             await queryClient.invalidateQueries(
    //                 trpc.browse.getAll.queryOptions({ pageSize: 50 })
    //             );
    //             toast.success("Vehicle successfully updated!");
    //             onSuccess?.();
    //         },
    //         onError: (error) => {
    //             toast.error(`Failed to update car: ${error.message}`);
    //         },
    //     })
    // );

    const isCreatePending = createCar.isPending;
    // const isUpdatePending = updateCar.isPending;

    // --- 3. SUPABASE UPLOAD HANDLER ---
    const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `new-upload-${crypto.randomUUID()}.${fileExt}`;
            const filePath = `cars/${fileName}`;

            const { error: uploadError } = await supabaseClient.storage
                .from('fleet-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabaseClient.storage
                .from('fleet-images')
                .getPublicUrl(filePath);

            form.setValue("image", publicUrl, { shouldValidate: true });
        } catch (error) {
            console.error("Upload failed:", error);
            toast.error("Failed to upload image. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    // --- 4. SUBMIT HANDLER ---
    const onSubmit = (values: z.infer<typeof carInsertSchema>) => {
        // if (isEdit) {
        //     // Make sure your update mutation accepts the id + the rest of the values
        //     updateCar.mutate({ ...values, id: initialValues.id });
        // } else {
        //     createCar.mutate(values);
        // }

        createCar.mutate(values);
    };

    // --- 5. LOADING STATES ---
    if (isCreatePending) {
        return <LoadingState title="Adding vehicle" descr="Please wait while we add your vehicle to the fleet." />;
    }

    // if (isUpdatePending) {
    //     return <LoadingState title="Updating vehicle" descr="Please wait while we save your changes." />;
    // }

    const currentImageUrl = form.watch("image");

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl bg-card p-8 rounded-2xl border border-border/50 shadow-sm">

                {/* --- IMAGE UPLOAD FIELD --- */}
                <FormField
                    control={form.control}
                    name="image"
                    render={() => (
                        <FormItem>
                            <FormLabel>Vehicle Photo</FormLabel>
                            <FormControl>
                                {currentImageUrl ? (
                                    <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden border border-border/50 group">
                                        <Image src={currentImageUrl} alt="Preview" fill className="object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <label className="cursor-pointer text-white font-bold bg-primary px-4 py-2 rounded-lg">
                                                Change Photo
                                                <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                                            </label>
                                        </div>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border/50 rounded-xl cursor-pointer hover:bg-muted/30 transition-colors">
                                        {isUploading ? (
                                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                        ) : (
                                            <>
                                                <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />
                                                <span className="text-sm font-medium text-muted-foreground">Click to upload high-res photo</span>
                                            </>
                                        )}
                                        <input type="file" accept="image/*" onChange={handleImageSelect} disabled={isUploading} className="hidden" />
                                    </label>
                                )}
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* --- TEXT DETAILS SECTION --- */}
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="make"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Make</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Porsche" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="model"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Model</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. 911 Carrera" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel>Display Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Porsche 911 Carrera (2024)" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="pricePerDay"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price Per Day (₹)</FormLabel>
                                <FormControl>
                                    {/* Using valueAsNumber approach safely in Shadcn */}
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        {...field}
                                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="plateNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>License Plate</FormLabel>
                                <FormControl>
                                    <Input placeholder="MH 02 AB 1234" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <Input placeholder="Luxury Sports" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* --- ACTION BUTTONS --- */}
                <div className="grid grid-cols-2 gap-x-4 pt-4">
                    {onCancel && (
                        <Button variant="ghost" onClick={onCancel} type="button" className="border">
                            Cancel
                        </Button>
                    )}
                    <Button type="submit" disabled={isUploading || isCreatePending} className={!onCancel ? "col-span-2" : ""}>
                        {isEdit ? "Update Vehicle" : "Create Vehicle"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}