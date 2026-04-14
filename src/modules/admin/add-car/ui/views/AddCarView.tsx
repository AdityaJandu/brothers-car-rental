"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

// Schema
import { carInsertSchema } from "@/modules/admin/dashboard/schemas";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { supabaseClient } from "@/lib/supabase-client";
import { toast } from "sonner";
import { LoadingState } from "@/components/self/loading-state";

// Sub-components
import { AddCarHeader } from "../components/AddCarHeader";
import { GeneralInfoCard } from "../components/GeneralInfoCard";
import { SpecificationsCard } from "../components/SpecificationsCard";
import { MediaGalleryCard } from "../components/MediaGalleryCard";
import { StatusSidebarCard } from "../components/StatusSidebarCard";
import { useRouter } from "next/navigation";

export default function AddCarView() {
    const router = useRouter();
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const { data: locations, isLoading: isLoadingLocations, isError: isErrorLocations, error: locationsError } = useQuery(
        trpc.adminLocations.getAll.queryOptions()
    );

    const form = useForm<z.infer<typeof carInsertSchema>>({
        resolver: zodResolver(carInsertSchema),
        defaultValues: {
            id: undefined,
            name: "",
            make: "",
            model: "",
            year: new Date().getFullYear(),
            locationId: "",
            tier: "",
            description: "",
            category: "",
            pricePerDay: 0,
            transmission: "automatic",
            fuelType: "petrol",
            seats: 4,
            headerImage: "",
            imageUrls: [],
            features: [],
            plateNumber: "",
            status: "available",
            isActive: true,
        },
    });

    const createCar = useMutation(
        trpc.adminAddCar.create.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(
                    trpc.adminDashboard.getAllAdmin.queryOptions({ pageSize: 50 })
                );
                toast.success("Vehicle successfully added to the fleet!");
                form.reset();
                router.push("/dashboard");
            },
            onError: (error) => {
                toast.error(`Failed to create car: ${error.message}`);
            },
        })
    );

    const isCreatePending = createCar.isPending;

    const onSubmit = (values: z.infer<typeof carInsertSchema>) => {
        if (isUploading) {
            toast.error("Please wait for images to finish uploading.");
            return;
        }
        createCar.mutate(values);
    };

    const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (files.length === 0) return;

        try {
            setIsUploading(true);

            const uploadPromises = files.map(async (file) => {
                const fileExt = file.name.split('.').pop();
                const fileName = `new-upload-${crypto.randomUUID()}.${fileExt}`;
                const filePath = `cars/${fileName}`;

                await supabaseClient.storage
                    .from('fleet-images')
                    .upload(filePath, file);

                const { data: { publicUrl } } = supabaseClient.storage
                    .from('fleet-images')
                    .getPublicUrl(filePath);

                return publicUrl;
            });

            const uploadedUrls = await Promise.all(uploadPromises);

            const currentHeader = form.getValues("headerImage");
            const currentUrls = form.getValues("imageUrls") || [];

            const newUrls = [...currentUrls, ...uploadedUrls];
            form.setValue("imageUrls", newUrls, { shouldValidate: true });

            if (!currentHeader && uploadedUrls.length > 0) {
                form.setValue("headerImage", uploadedUrls[0], { shouldValidate: true });
            }

        } catch (error) {
            console.error("Upload failed:", error);
            toast.error("Failed to upload images. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveImage = (urlToRemove: string) => {
        const currentUrls = form.getValues("imageUrls") || [];
        const updatedUrls = currentUrls.filter(url => url !== urlToRemove);
        form.setValue("imageUrls", updatedUrls, { shouldValidate: true });

        if (form.getValues("headerImage") === urlToRemove) {
            form.setValue("headerImage", updatedUrls.length > 0 ? updatedUrls[0] : "", { shouldValidate: true });
        }
    };

    const handleSetMainImage = (url: string) => {
        form.setValue("headerImage", url, { shouldValidate: true });
    };

    const currentHeaderImage = form.watch("headerImage");
    const currentImageUrls = form.watch("imageUrls") || [];

    if (isLoadingLocations) {
        return <LoadingState title="Loading Hubs" descr="Synchronizing locations configuration..." />;
    }

    if (isErrorLocations) {
        return <div className="p-8">
            <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-md">
                <h3 className="font-bold">Failed to connect to active deployment hubs</h3>
                <p className="text-sm mt-1">{locationsError?.message || "Unknown fetching error"}</p>
                <Button className="mt-4" onClick={() => window.location.reload()} variant="outline">Retry connection</Button>
            </div>
        </div>;
    }

    if (isCreatePending) {
        return (
            <LoadingState title={"Adding data"} descr={"Please wait while we're adding the cars. It may take a bit of time."} />
        );
    }

    return (
        <div className="min-h-screen bg-muted/30 p-4 md:p-8">

            <AddCarHeader
                form={form}
                isCreatePending={isCreatePending}
                isUploading={isUploading}
            />

            <Form {...form}>
                <form
                    id="add-car-form"
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6"
                >
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <GeneralInfoCard form={form} locations={locations ?? []} />
                        <SpecificationsCard form={form} />
                        <MediaGalleryCard
                            isUploading={isUploading}
                            currentImageUrls={currentImageUrls}
                            currentHeaderImage={currentHeaderImage}
                            onImageSelect={handleImageSelect}
                            onRemoveImage={handleRemoveImage}
                            onSetMainImage={handleSetMainImage}
                        />
                    </div>

                    {/* Right Column */}
                    <StatusSidebarCard form={form} />
                </form>
            </Form>

            <div className="pb-20 md:hidden"></div>
        </div>
    );
}