"use client"

import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

import { ErrorState } from "@/components/self/error-state";
import { LoadingState } from "@/components/self/loading-state";
import { DataTable } from "@/components/self/data-table";
import { EmptyState } from "@/components/self/empty-state";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

import { createLocationColumns, LocationRow } from "../components/location-columns";
import { LocationFormDialog } from "../components/LocationFormDialog";

export function AdminLocationsView() {
    const trpc = useTRPC();

    // Fetch all active and inactive locations without pagination for now
    const { data: locations } = useSuspenseQuery(
        trpc.adminLocations.getAll.queryOptions()
    );

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [locationToEdit, setLocationToEdit] = useState<LocationRow | null>(null);

    const handleCreateNew = () => {
        setLocationToEdit(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (loc: LocationRow) => {
        setLocationToEdit(loc);
        setIsDialogOpen(true);
    };

    const columns = createLocationColumns(handleEdit);

    return (
        <div className="min-h-screen bg-muted/30">
            <div className="flex flex-col px-4 py-8 md:px-8 gap-y-4 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-primary font-heading">Hub Management</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Create and modify physical hubs where cars are stationed.</p>
                    </div>
                    <Button
                        onClick={handleCreateNew}
                        className="h-12 px-8 font-bold rounded-md"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Create Hub
                    </Button>
                </div>

                {locations.length === 0 ? (
                    <EmptyState
                        title="No hubs exist yet"
                        descr="Create physical Hubs (like distinct Airports or Cities) so that admins can easily deploy vehicles into specific regions."
                    />
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <DataTable
                            columns={columns}
                            data={locations as LocationRow[]}
                            onRowClick={() => { }}
                        />
                    </div>
                )}
            </div>

            <LocationFormDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                locationToEdit={locationToEdit}
            />
        </div>
    );
};

export const AdminLocationsViewLoading = () => (
    <LoadingState
        title="Loading hubs data"
        descr="Fetching current hub configurations..."
    />
);

export const AdminLocationsViewError = () => (
    <ErrorState
        title="Failed to load hubs"
        descr="Something went wrong while executing the sync. Try pulling again."
    />
);
