"use client";

import { ShieldCheck, FileText, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
    FormControl,
    FormField,
    FormItem,
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

interface StatusSidebarCardProps {
    form: UseFormReturn<z.infer<typeof carInsertSchema>>;
}

export function StatusSidebarCard({ form }: StatusSidebarCardProps) {
    return (
        <div className="space-y-6">
            {/* Status Card */}
            <Card className="rounded-xl bg-white border-border/40 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6">
                    <div className="flex items-center gap-2.5 mb-6">
                        <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                            <ShieldCheck size={16} className="text-emerald-600" />
                        </div>
                        <h2 className="font-semibold text-[15px]">Asset Status</h2>
                    </div>
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="h-11 bg-[#ebe9ff] border-transparent focus:border-primary/30 transition-all duration-200">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="available">
                                            <span className="flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                                Available
                                            </span>
                                        </SelectItem>
                                        <SelectItem value="rented">
                                            <span className="flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-blue-500" />
                                                Rented
                                            </span>
                                        </SelectItem>
                                        <SelectItem value="maintenance">
                                            <span className="flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-amber-500" />
                                                Maintenance
                                            </span>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex items-start gap-2.5 bg-primary/5 border border-primary/10 p-4 rounded-lg text-sm mt-4">
                        <Info size={14} className="text-primary mt-0.5 shrink-0" />
                        <span className="text-muted-foreground text-xs leading-relaxed">
                            Available cars are shown on homepage automatically.
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Description Card */}
            <Card className="rounded-xl bg-white border-border/40 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6">
                    <div className="flex items-center gap-2.5 mb-4">
                        <div className="h-8 w-8 rounded-lg bg-rose-50 flex items-center justify-center">
                            <FileText size={16} className="text-rose-600" />
                        </div>
                        <h2 className="font-semibold text-[15px]">Description</h2>
                    </div>
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea
                                        className="bg-[#ebe9ff] border-transparent min-h-60 md:min-h-80 resize-none text-sm leading-relaxed p-4 focus:ring-2 focus:ring-primary/10 focus:border-primary/30 focus:bg-white rounded-lg transition-all duration-200"
                                        placeholder="Experience the pinnacle of German engineering..."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
