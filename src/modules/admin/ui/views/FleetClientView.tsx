"use client";

import { ErrorState } from "@/components/self/error-state";
import { LoadingState } from "@/components/self/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/self/data-table";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/self/empty-state";
import { DataPagination } from "@/components/self/data-pagination";
import { useRouter } from "next/navigation";
import { useCarFilters } from "../../hooks/user-car-filters";
import { Button } from "@/components/ui/button";

import { useState } from "react";

import { ArrowLeft, PlusIcon } from "lucide-react";

import { CarForm } from "../components/CarForm";


export function FleetClientView() {
    const router = useRouter();

    const [filters, setFilters] = useCarFilters();
    const [isAddingNew, setIsAddingNew] = useState(false);


    const trpc = useTRPC();
    const { data } = useSuspenseQuery(
        trpc.browse.getAllAdmin.queryOptions({
            ...filters
        })
    );

    if (data.items.length === 0) {
        return (
            <EmptyState
                title="Create your first agent"
                descr="Create an agent to join in meetings. Each agent will follow your instruction and can participate in discussion during calls."
            />
        );
    };


    // --- RENDER: ADD NEW VEHICLE VIEW ---
    if (isAddingNew) {
        return (
            <div className="max-w-6xl mx-auto  px-6 py-12 animate-in fade-in duration-300">
                <div className="flex items-center gap-6 mb-8">
                    {/* Back Button */}
                    <Button
                        variant="outline"
                        onClick={() => setIsAddingNew(false)}
                        className="rounded-xl"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Fleet
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-primary font-heading">Add New Vehicle</h1>
                        <p className="text-muted-foreground mt-1 font-sans">Register a new car to your inventory.</p>
                    </div>
                </div>

                {/* The Form we just built! */}
                {/* When it successfully submits, we close the form and instantly refetch the table data */}
                <CarForm
                    onSuccess={() => {
                        setIsAddingNew(false);
                    }}
                />
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col px-4 py-4 md:px-8 gap-y-4">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-primary font-heading">Fleet Management</h1>
                        <p className="text-muted-foreground mt-1 font-sans">Manage inventory, pricing, and media.</p>
                    </div>
                    {/* Trigger the state change to show the form! */}
                    <Button
                        onClick={() => setIsAddingNew(true)}
                        className="h-12 px-8 font-bold rounded-md"
                    >
                        <PlusIcon />
                        Add Car
                    </Button>
                </div>
            </div>


            <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
                <DataTable
                    columns={columns}
                    data={data.items}
                    onRowClick={(row) => { }}
                />
                <DataPagination
                    page={filters.page}
                    totalPages={data.totalPages}
                    onPageChange={(page) => { setFilters({ page }) }}
                />
            </div>

        </>
    );
};

export const FleetViewLoading = () => {
    return (
        <LoadingState
            title="Loading data"
            descr="This may take from a few seconds to a few minutes."
        />
    );
};

export const FleetViewError = () => {
    return (
        <ErrorState
            title="Failed to load data"
            descr="Something went wrong while fetching agents. Try to refresh page."
        />
    );
};