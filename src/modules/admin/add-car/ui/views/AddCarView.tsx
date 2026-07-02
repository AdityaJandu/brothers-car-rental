"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

// Schema
import { carInsertSchema } from "@/modules/admin/dashboard/schemas";
import { useEffect, useState, useRef } from "react";
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

export default function AddCarView({ carId }: { carId?: string }) {
    const router = useRouter();
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const { data: locations, isLoading: isLoadingLocations, isError: isErrorLocations, error: locationsError } = useQuery(
        trpc.adminLocations.getAll.queryOptions()
    );

    const { data: initialCar, isLoading: isLoadingInitialCar, isError: isErrorInitialCar, error: initialCarError } = useQuery({
        ...trpc.adminDashboard.getOneAdmin.queryOptions({ id: carId! }),
        enabled: !!carId
    });

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

    // Track whether we've already hydrated the form for this car so we
    // don't clobber user edits if the query refetches in the background.
    const hasHydratedRef = useRef(false);

    // Narrow an arbitrary incoming string down to one of the Select's
    // literal option values, case-insensitively. Falls back to the given
    // default if nothing matches, so the Select never silently renders
    // blank because of a casing/format mismatch (e.g. "Petrol" vs "petrol").
    function normalizeEnum<T extends string>(
        value: unknown,
        allowed: readonly T[],
        fallback: T
    ): T {
        const str = value?.toString().toLowerCase().trim();
        const match = allowed.find((option) => option.toLowerCase() === str);
        return match ?? fallback;
    }

    useEffect(() => {
        if (!initialCar || hasHydratedRef.current) return;

        // Build the reset payload explicitly against the form's own type
        // rather than spreading `initialCar` directly. `initialCar` comes
        // from the DB and carries extra fields (e.g. `deletedAt`, raw `id`
        // types) that don't exist on the form schema, which is what was
        // causing the `form.reset(...)` type error.
        const normalized: z.infer<typeof carInsertSchema> = {
            id: initialCar.id ?? undefined,
            name: initialCar.name ?? "",
            make: initialCar.make ?? "",
            model: initialCar.model ?? "",
            year: initialCar.year ?? new Date().getFullYear(),
            locationId: initialCar.locationId?.toString() ?? "",
            tier: initialCar.tier ?? "",
            description: initialCar.description ?? "",
            category: initialCar.category ?? "",
            pricePerDay: initialCar.pricePerDay ?? 0,
            transmission: normalizeEnum(
                initialCar.transmission,
                ["automatic", "manual"] as const,
                "automatic"
            ),
            fuelType: normalizeEnum(
                initialCar.fuelType,
                ["petrol", "diesel", "ev", "hybrid"] as const,
                "petrol"
            ),
            seats: initialCar.seats ?? 4,
            headerImage: initialCar.headerImage ?? "",
            imageUrls: initialCar.imageUrls ?? [],
            features: initialCar.features ?? [],
            plateNumber: initialCar.plateNumber ?? "",
            status: normalizeEnum(
                initialCar.status,
                ["available", "rented", "maintenance"] as const,
                "available"
            ),
            isActive: initialCar.isActive ?? true,
        };

        // Explicit reset (rather than the `values` prop) guarantees every
        // field -- including Select-driven ones -- is populated in one
        // synchronous pass once the async data actually arrives.
        form.reset(normalized);
        hasHydratedRef.current = true;
    }, [initialCar, form]);

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

    const updateCar = useMutation(
        trpc.adminAddCar.update.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(
                    trpc.adminDashboard.getAllAdmin.queryOptions({ pageSize: 50 })
                );
                toast.success("Vehicle successfully updated!");
                router.push("/dashboard");
            },
            onError: (error) => {
                toast.error(`Failed to update car: ${error.message}`);
            },
        })
    );

    const isPending = createCar.isPending || updateCar.isPending;

    const onSubmit = (values: z.infer<typeof carInsertSchema>) => {
        if (isUploading) {
            toast.error("Please wait for images to finish uploading.");
            return;
        }
        if (carId) {
            updateCar.mutate({ ...values, id: carId });
        } else {
            createCar.mutate(values);
        }
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

    if (isLoadingLocations || isLoadingInitialCar) {
        return <LoadingState title={isLoadingInitialCar ? "Loading Car" : "Loading Hubs"} descr="Please wait..." />;
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

    if (isErrorInitialCar) {
        return <div className="p-8">
            <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-md">
                <h3 className="font-bold">Failed to load car details</h3>
                <p className="text-sm mt-1">{initialCarError?.message || "Unknown fetching error"}</p>
                <Button className="mt-4" onClick={() => router.push("/dashboard")} variant="outline">Back to Dashboard</Button>
            </div>
        </div>;
    }

    if (isPending) {
        return (
            <LoadingState title={carId ? "Updating data" : "Adding data"} descr={"Please wait while we process the car data. It may take a bit of time."} />
        );
    }

    return (
        <div className="min-h-screen bg-muted/30 p-4 md:p-8">

            <AddCarHeader
                form={form}
                isCreatePending={isPending}
                isUploading={isUploading}
                isEditMode={!!carId}
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