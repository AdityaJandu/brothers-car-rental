"use client";

// NPM
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Icons
import {
    UploadCloud,
    Image as ImageIcon,
    Info,
    Loader2,
    X,
    ChevronRight,
    ChevronLeft,
} from "lucide-react";

// Next
import Image from "next/image";

// UI
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import {
    Input,
} from "@/components/ui/input";
import {
    Button,
} from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Textarea,
} from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Schema
import { carInsertSchema } from "@/modules/admin/dashboard/schemas";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { supabaseClient } from "@/lib/supabase-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LoadingState } from "@/components/self/loading-state";
import { cn } from "@/lib/utils";

export default function AddCarView() {

    const router = useRouter();

    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const form = useForm<z.infer<typeof carInsertSchema>>({
        resolver: zodResolver(carInsertSchema),
        defaultValues: {
            id: undefined,
            name: "",
            make: "",
            model: "",
            year: new Date().getFullYear(),
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
        trpc.admin.create.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(
                    trpc.browse.getAll.queryOptions({ pageSize: 50 })
                );
                toast.success("Vehicle successfully added to the fleet!");
                form.reset();
            },
            onError: (error) => {
                toast.error(`Failed to create car: ${error.message}`);
            },
        })
    );

    const isCreatePending = createCar.isPending;

    const onSubmit = (values: z.infer<typeof carInsertSchema>) => {
        // Ensure we don't submit if we are still uploading images
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

    if (isCreatePending) {
        return (
            <LoadingState title={"Adding data"} descr={"Please wait while we're adding the cars. It may take a bit of time."} />
        );
    }


    return (
        <div className="min-h-screen bg-muted/30 p-4 md:p-8">


            {/* HEADER */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between mb-8 gap-4">

                <div className="flex items-center gap-4">
                    {/* Back Button */}
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.push('/dashboard')}
                        className="shrink-0"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {/* Title Section */}
                    <div className="flex flex-col">
                        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                            Add New Vehicle
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Introduce a new asset to your premium rental gallery.
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" type="button" onClick={() => form.reset()}>
                        Cancel
                    </Button>
                    {/* FIX: Button is outside the form, so we link it using form="add-car-form".
                        Added disabled state and loading spinner.
                    */}
                    <Button
                        type="submit"
                        form="add-car-form"
                        disabled={isCreatePending || isUploading}
                    >
                        {isCreatePending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Adding...
                            </>
                        ) : (
                            "Add Vehicle"
                        )}
                    </Button>
                </div>
            </div>

            <Form {...form}>
                {/* FIX: Added id="add-car-form" and onSubmit={form.handleSubmit(onSubmit)} */}
                <form id="add-car-form" onSubmit={form.handleSubmit(onSubmit)} className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* LEFT */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* GENERAL INFO */}
                        <Card className="rounded-xl bg-white">
                            <CardContent className="p-6 space-y-5">

                                <div className="flex items-center gap-2 mb-5">
                                    <Info size={18} />
                                    <h2 className="font-semibold">General Information</h2>
                                </div>

                                {/* NAME */}
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Car Display Name</FormLabel>
                                            <FormControl>
                                                <Input className="bg-[#ebe9ff]" placeholder="2024 Mercedes-Benz S-Class" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* GRID */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

                                    <FormField
                                        control={form.control}
                                        name="make"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Make</FormLabel>
                                                <FormControl>
                                                    <Input className="bg-[#ebe9ff]" placeholder="Mercedes" {...field} />
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
                                                    <Input className="bg-[#ebe9ff]" placeholder="S580" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="year"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Year</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        className="bg-[#ebe9ff]"
                                                        type="number"
                                                        {...field}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="pricePerDay"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Daily Price</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        className="bg-[#ebe9ff]"
                                                        type="number"
                                                        {...field}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
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
                                                <FormLabel>Plate Number</FormLabel>
                                                <FormControl>
                                                    <Input className="bg-[#ebe9ff]" placeholder="ABC-1234" {...field} />
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
                                                    <Input className="bg-[#ebe9ff]" placeholder="Luxury Sedan" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* MEDIA */}
                        <Card className="rounded-xl bg-white">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-5">
                                    <ImageIcon size={18} />
                                    <h2 className="font-semibold">Media Gallery</h2>
                                </div>

                                {/* Main Upload Dropzone */}
                                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border/50 rounded-xl cursor-pointer bg-[#ebe9ff] hover:bg-muted/30 transition-colors mb-6 group">
                                    {isUploading ? (
                                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                    ) : (
                                        <>
                                            <UploadCloud className="w-8 h-8 text-muted-foreground mb-2 group-hover:text-primary transition-colors" />
                                            <span className="text-sm font-medium">Click to upload high-res photos</span>
                                            <span className="text-xs text-muted-foreground mt-1">PNG, JPG or WebP up to 10MB each</span>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageSelect}
                                        disabled={isUploading}
                                        className="hidden"

                                    />
                                </label>

                                {/* Thumbnail Gallery Grid */}
                                <div className="space-y-4">
                                    {/* Header */}
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Uploaded Photos
                                        </p>

                                        {currentImageUrls.length > 0 && (
                                            <span className="text-xs text-muted-foreground">
                                                {currentImageUrls.length} images
                                            </span>
                                        )}
                                    </div>

                                    {/* Empty State */}
                                    {currentImageUrls.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center border border-dashed rounded-xl p-8 text-center bg-muted/30">
                                            <p className="text-sm font-medium">No images uploaded</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Upload vehicle photos to showcase your listing
                                            </p>
                                        </div>
                                    ) : (
                                        /* Gallery Grid */
                                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                                            {currentImageUrls.map((url, index) => (
                                                <div
                                                    key={url}
                                                    className={
                                                        cn(
                                                            "relative aspect-square rounded-md overflow-hidden border group shadow-sm transition-all",
                                                            currentHeaderImage === url
                                                                ? "border-primary ring-2 ring-primary/20"
                                                                : "border-transparent hover:border-border"
                                                        )
                                                    }
                                                >
                                                    <Image
                                                        src={url}
                                                        alt={`Vehicle photo ${index + 1}`}
                                                        fill
                                                        className="object-cover"
                                                        sizes="120px"
                                                    />

                                                    {/* Hover Overlay */}
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2">
                                                        {currentHeaderImage !== url && (
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    handleSetMainImage(url);
                                                                }}
                                                                className="text-[10px] bg-white text-black px-2 py-1 rounded font-semibold hover:bg-gray-200"
                                                            >
                                                                Set Main
                                                            </button>
                                                        )}

                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleRemoveImage(url);
                                                            }}
                                                            className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>

                                                    {/* Main Badge */}
                                                    {currentHeaderImage === url && (
                                                        <div className="absolute bottom-1 left-1 bg-white text-black text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow">
                                                            Main
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                    </div>

                    {/* RIGHT */}
                    <div className="space-y-6 ">

                        {/* STATUS */}
                        <Card className="rounded-xl bg-white">
                            <CardContent className="p-6 ">

                                <h2 className="font-semibold mb-6">Asset Status</h2>

                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem >
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="available">Available</SelectItem>
                                                    <SelectItem value="rented">Rented</SelectItem>
                                                    <SelectItem value="maintenance">Maintenance</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="bg-muted p-4 rounded-xl text-sm mt-4">
                                    Available cars are shown on homepage automatically.
                                </div>

                            </CardContent>
                        </Card>

                        {/* DESCRIPTION */}
                        <Card className="rounded-xl bg-white">
                            <CardContent className="p-6">

                                <h2 className="font-semibold mb-4">Description</h2>

                                {/* Unconnected UI Element: 
                                    I left this disconnected because 'description' is not in your Zod schema defaultValues. 
                                    Let me know if you want it connected to a specific field! 
                                */}
                                <Textarea className="bg-[#ebe9ff]" placeholder="Highlight features..." />

                            </CardContent>
                        </Card>

                    </div>

                </form>
            </Form>
        </div>
    );
}