"use client";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

import { useCarFilters } from "../../hooks/user-car-filters";

export const CarSearchFilter = () => {
    const [filters, setFilters] = useCarFilters();


    return (
        <div className="relative">
            <Input
                placeholder="Filter by name"
                className="h-10 bg-white w-60 pl-7"
                value={filters.search}
                onChange={(e) => setFilters({ search: e.target.value })}
            />
            <SearchIcon className="size-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
        </div>
    );
};