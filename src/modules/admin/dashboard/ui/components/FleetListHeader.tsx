"use client"
import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { DEFAULT_PAGE } from "@/constants";
import { useCarFilters } from "../../hooks/user-car-filters";
import { CarSearchFilter } from "./CarSearchFilter";
// import { CarStatusFilter } from "./CarStatusFilter";
import { useRouter } from "next/navigation";

export const FleetListHeader = () => {
    const [filters, setFilters] = useCarFilters();
    const router = useRouter();

    const isAnyFilterModified = !!filters.search;

    const onClearFilters = () => {
        setFilters({
            search: "",
            page: DEFAULT_PAGE,
        });
    }

    return (
        <div className="flex flex-col px-4 py-4 md:px-8 gap-y-4">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-primary font-heading">Fleet Management</h1>
                    <p className="text-muted-foreground mt-1 font-sans">Manage inventory, pricing, and media.</p>
                </div>
                {/* Trigger the state change to show the form! */}
                <Button
                    onClick={() => router.push('/add-car')}
                    className="h-12 px-8 font-bold rounded-md"
                >
                    <PlusIcon />
                    Add Car
                </Button>
            </div>

            <div className="flex items-center gap-x-2 px-5">
                <CarSearchFilter />
                {isAnyFilterModified &&
                    <Button variant="outline" size="lg" className="border" onClick={onClearFilters} >
                        <XCircleIcon />
                        Clear
                    </Button>
                }
            </div>
        </div>
    );
};

