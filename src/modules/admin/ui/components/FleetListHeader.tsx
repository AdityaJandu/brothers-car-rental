"use client"
import { Button } from "@/components/ui/button";
import { XCircleIcon } from "lucide-react";
import { DEFAULT_PAGE } from "@/constants";
import { useCarFilters } from "../../hooks/user-car-filters";
import { CarSearchFilter } from "./CarSearchFilter";
// import { CarStatusFilter } from "./CarStatusFilter";

export const FleetListHeader = () => {
    const [filters, setFilters] = useCarFilters();

    const isAnyFilterModified = !!filters.search;

    const onClearFilters = () => {
        setFilters({
            search: "",
            page: DEFAULT_PAGE,
        });
    }

    return (
        <div className="flex flex-col px-4 py-4 md:px-8 gap-y-4">
            <div className="flex items-center gap-x-2 px-5">
                <CarSearchFilter />
                {isAnyFilterModified &&
                    <Button variant="outline" size="lg" className="border" onClick={onClearFilters} >
                        <XCircleIcon />
                        Clear
                    </Button>
                }
            </div>
            {/* <CarStatusFilter /> */}
        </div>
    );
};

