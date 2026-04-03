"use client"

import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import { MoreVertical, Edit2, Image as ImageIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

// 1. Import your actual Drizzle schema
import { car } from "@/db/schema" // <-- Adjust this path if your schema is somewhere else!
import { InferSelectModel } from "drizzle-orm"

// 2. THE FIX: Define the exact shape of the row, swapping Dates for strings
export type CarRow = Omit<InferSelectModel<typeof car>, "createdAt" | "updatedAt"> & {
    createdAt: string;
    updatedAt: string;
};

// 3. Apply the fixed type to your ColumnDef
export const carColumns: ColumnDef<CarRow>[] = [
    {
        accessorKey: "name",
        header: "Car Details",
        cell: ({ row }) => {
            const car = row.original;
            return (
                <div className="flex items-center gap-4">
                    <div className="relative w-20 h-12.5 bg-slate-100 rounded-md overflow-hidden shrink-0">
                        <Image
                            src={car.headerImage || "./empty.svg"}
                            alt={car.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                        />
                    </div>
                    <div className="flex flex-col justify-center">
                        <p className="font-extrabold text-[#0B0F3B] text-sm">{car.name}</p>
                        <p className="text-xs text-slate-400 font-medium">{car.category}</p>
                    </div>
                </div>
            );
        }
    },
    {
        accessorKey: "plateNumber",
        header: "Plate Number",
        cell: ({ row }) => {
            return (
                <span className="font-semibold text-slate-600 uppercase tracking-wider text-sm">
                    {row.original.plateNumber}
                </span>
            );
        }
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;

            if (status === "available") {
                return <span className="text-[11px] font-bold text-emerald-700 bg-[#e0f5eb] px-3 py-1.5 rounded-full uppercase tracking-widest">Available</span>;
            }
            if (status === "rented") {
                return <span className="text-[11px] font-bold text-[#4b5de4] bg-[#e4e7fa] px-3 py-1.5 rounded-full uppercase tracking-widest">Rented</span>;
            }
            return <span className="text-[11px] font-bold text-[#d94444] bg-[#fae5e5] px-3 py-1.5 rounded-full uppercase tracking-widest">Maintenance</span>;
        }
    },
    {
        accessorKey: "pricePerDay",
        cell: ({ row }) => {
            const value = row.getValue("pricePerDay") as number;
            return (
                <span className="font-semibold">
                    ₹ {value.toLocaleString("en-IN")}
                </span>
            );
        },
    },
    {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
            const car = row.original;

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
                            <DropdownMenuItem className="cursor-pointer font-medium text-slate-600" onClick={() => console.log("Edit Media", car.id)}>
                                <ImageIcon className="mr-2 h-4 w-4" /> Edit Media
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer font-medium text-slate-600" onClick={() => console.log("Edit Details", car.id)}>
                                <Edit2 className="mr-2 h-4 w-4" /> Edit Details
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        }
    }
]