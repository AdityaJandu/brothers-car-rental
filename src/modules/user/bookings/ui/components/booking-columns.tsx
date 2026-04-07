"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreVertical, Eye, XCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { BookingRow } from "@/modules/user/check-out/types"


export const bookingColumns: ColumnDef<BookingRow>[] = [
    {
        accessorKey: "fullName",
        header: "Customer",
        cell: ({ row }) => {
            const booking = row.original;
            return (
                <div className="flex flex-col justify-center">
                    <p className="font-extrabold text-[#0B0F3B] text-sm">{booking.fullName}</p>
                    <p className="text-xs text-slate-400 font-medium">{booking.email}</p>
                </div>
            );
        }
    },
    {
        id: "schedule",
        header: "Rental Period",
        cell: ({ row }) => {
            const startDate = new Date(row.original.startDate);
            const endDate = new Date(row.original.endDate);

            return (
                <div className="flex flex-col">
                    <span className="font-semibold text-slate-700 text-sm">
                        {format(startDate, "MMM dd, yyyy")}
                    </span>
                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-0.5">
                        to {format(endDate, "MMM dd, yyyy")}
                    </span>
                </div>
            );
        }
    },
    {
        accessorKey: "totalPrice",
        header: "Total Value",
        cell: ({ row }) => {
            const value = row.getValue("totalPrice") as number;
            return (
                <span className="font-extrabold text-[#0F172A] text-sm tracking-tight">
                    ₹ {value.toLocaleString("en-IN")}
                </span>
            );
        },
    },
    {
        accessorKey: "paymentMethod",
        header: "Payment",
        cell: ({ row }) => {
            return (
                <span className="font-semibold text-slate-500 uppercase tracking-widest text-[10px]">
                    {row.original.paymentMethod}
                </span>
            );
        }
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;

            if (status === "completed") {
                return <span className="text-[11px] font-bold text-emerald-700 bg-[#e0f5eb] px-3 py-1.5 rounded-full uppercase tracking-widest">Completed</span>;
            }
            if (status === "confirmed") {
                return <span className="text-[11px] font-bold text-[#4b5de4] bg-[#e4e7fa] px-3 py-1.5 rounded-full uppercase tracking-widest">Confirmed</span>;
            }
            if (status === "cancelled") {
                return <span className="text-[11px] font-bold text-[#d94444] bg-[#fae5e5] px-3 py-1.5 rounded-full uppercase tracking-widest">Cancelled</span>;
            }
            // Pending
            return <span className="text-[11px] font-bold text-[#D97706] bg-[#FEF3C7] px-3 py-1.5 rounded-full uppercase tracking-widest">Pending</span>;
        }
    },
    {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {

            return (
                <div className="flex justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-[#0B0F3B] hover:bg-slate-100 rounded-full transition-colors">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-md shadow-sm border-slate-100 p-1">

                            <DropdownMenuItem className="cursor-pointer font-medium text-slate-600 rounded-md" onClick={() => console.log("View Booking")}>
                                <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>

                            <DropdownMenuItem className="cursor-pointer font-medium text-[#d94444] focus:text-[#d94444] focus:bg-[#fae5e5] rounded-md mt-1" onClick={() => console.log("Cancel Booking")}>
                                <XCircle className="mr-2 h-4 w-4" /> Cancel Booking
                            </DropdownMenuItem>

                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        }
    }
]