"use client";

import { Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { carInsertSchema } from "@/modules/admin/dashboard/schemas";
import { Badge } from "@/components/ui/badge";

interface GeneralInfoCardProps {
    form: UseFormReturn<z.infer<typeof carInsertSchema>>;
}

export function GeneralInfoCard({ form }: GeneralInfoCardProps) {
    return (
        <Card className="rounded-xl bg-white border-border/40 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6 space-y-5">
                <div className="flex items-center gap-2.5 mb-5">
                    <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Info size={16} className="text-blue-600" />
                    </div>
                    <h2 className="font-semibold text-[15px]">General Information</h2>
                    <Badge variant="secondary" className="ml-auto text-[10px] uppercase tracking-wider">
                        Required
                    </Badge>
                </div>

                {/* Car Display Name — Full Width */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Car Display Name
                            </FormLabel>
                            <FormControl>
                                <Input
                                    className="bg-[#ebe9ff] border-transparent focus:border-primary/30 focus:bg-white transition-all duration-200 h-11"
                                    placeholder="2024 Mercedes-Benz S-Class"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* 2-Col Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <FormField
                        control={form.control}
                        name="make"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Make
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        className="bg-[#ebe9ff] border-transparent focus:border-primary/30 focus:bg-white transition-all duration-200 h-11"
                                        placeholder="Mercedes"
                                        {...field}
                                    />
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
                                <FormLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Model
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        className="bg-[#ebe9ff] border-transparent focus:border-primary/30 focus:bg-white transition-all duration-200 h-11"
                                        placeholder="S580"
                                        {...field}
                                    />
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
                                <FormLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Year
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
                        name="pricePerDay"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Daily Price (in cents/base unit)
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
                        name="plateNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Plate Number
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        className="bg-[#ebe9ff] border-transparent focus:border-primary/30 focus:bg-white transition-all duration-200 h-11"
                                        placeholder="ABC-1234"
                                        {...field}
                                    />
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
                                <FormLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Category
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        className="bg-[#ebe9ff] border-transparent focus:border-primary/30 focus:bg-white transition-all duration-200 h-11"
                                        placeholder="Luxury Sedan"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="tier"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Tier Badge
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        className="bg-[#ebe9ff] border-transparent focus:border-primary/30 focus:bg-white transition-all duration-200 h-11"
                                        placeholder="Premium Tier, Elite Tier..."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
