"use client";

import { ColumnDef } from "@tanstack/react-table";
import { location } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { MoreVertical, Edit2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export type LocationRow = Omit<InferSelectModel<typeof location>, "createdAt" | "updatedAt"> & {
    createdAt: string;
    updatedAt: string;
};

export const createLocationColumns = (onEdit: (loc: LocationRow) => void): ColumnDef<LocationRow>[] => [
    {
        accessorKey: "name",
        header: "Hub Name",
        cell: ({ row }) => (
            <span className="font-extrabold text-[#0B0F3B] text-sm">{row.original.name}</span>
        ),
    },
    {
        accessorKey: "city",
        header: "City",
        cell: ({ row }) => (
            <span className="text-sm font-medium text-slate-600">{row.original.city}</span>
        ),
    },
    {
        accessorKey: "fullAddress",
        header: "Full Address",
        cell: ({ row }) => (
            <span className="text-sm text-slate-500 line-clamp-1 max-w-[250px]">{row.original.fullAddress}</span>
        ),
    },
    {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => {
            if (row.original.isActive) {
                return <span className="text-[11px] font-bold text-emerald-700 bg-[#e0f5eb] px-3 py-1.5 rounded-full uppercase tracking-widest">Active</span>;
            }
            return <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full uppercase tracking-widest">Disabled</span>;
        }
    },
    {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
            const loc = row.original;
            return (
                <div className="flex justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-[#0B0F3B] hover:bg-slate-100 rounded-full">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-md shadow-sm border-slate-100">
                            <DropdownMenuItem className="cursor-pointer font-medium text-slate-600" onClick={() => onEdit(loc)}>
                                <Edit2 className="mr-2 h-4 w-4" /> Edit Hub
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        }
    }
];
