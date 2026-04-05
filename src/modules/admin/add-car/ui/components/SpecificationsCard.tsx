"use client";

import { Settings2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { carInsertSchema } from "@/modules/admin/dashboard/schemas";

interface SpecificationsCardProps {
    form: UseFormReturn<z.infer<typeof carInsertSchema>>;
}

export function SpecificationsCard({ form }: SpecificationsCardProps) {
    return (
        <Card className="rounded-xl bg-white border-border/40 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6">
                <div className="flex items-center gap-2.5 mb-5">
                    <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center">
                        <Settings2 size={16} className="text-amber-600" />
                    </div>
                    <h2 className="font-semibold text-[15px]">Specifications</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="seats"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Seats
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        className="bg-[#ebe9ff] border-transparent focus:border-primary/30 focus:bg-white transition-all duration-200 h-11"
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
                        name="transmission"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Transmission
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-[#ebe9ff] border-transparent focus:border-primary/30 h-11 transition-all duration-200">
                                            <SelectValue placeholder="Select..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="automatic">Automatic</SelectItem>
                                        <SelectItem value="manual">Manual</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="fuelType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Fuel Type
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-[#ebe9ff] border-transparent focus:border-primary/30 h-11 transition-all duration-200">
                                            <SelectValue placeholder="Select..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="petrol">Petrol</SelectItem>
                                        <SelectItem value="ev">EV</SelectItem>
                                        <SelectItem value="hybrid">Hybrid</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
