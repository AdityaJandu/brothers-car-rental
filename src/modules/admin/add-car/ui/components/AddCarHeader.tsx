"use client";

import { ChevronLeft, Loader2, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { carInsertSchema } from "@/modules/admin/dashboard/schemas";

interface AddCarHeaderProps {
    form: UseFormReturn<z.infer<typeof carInsertSchema>>;
    isCreatePending: boolean;
    isUploading: boolean;
}

export function AddCarHeader({ form, isCreatePending, isUploading }: AddCarHeaderProps) {
    const router = useRouter();

    return (
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between mb-8 gap-4">


            <div className="flex flex-col px-2">
                <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Car className="h-4 w-4 text-primary" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                        Add New Vehicle
                    </h1>
                </div>
                <p className="text-muted-foreground text-sm mt-1 ml-[42px]">
                    Introduce a new asset to your premium rental gallery.
                </p>
            </div>


            <div className="flex gap-3 items-center">
                <Button
                    variant="outline"
                    type="button"
                    onClick={() => form.reset()}
                    className="border-border/60 h-10 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30 transition-all duration-200"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    form="add-car-form"
                    disabled={isCreatePending || isUploading}
                    className="min-w-[120px] h-10 shadow-sm hover:shadow-md transition-all duration-200"
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
    );
}
