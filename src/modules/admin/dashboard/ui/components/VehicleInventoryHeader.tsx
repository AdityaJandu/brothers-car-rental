'use client';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { List } from 'lucide-react';
import { useCarFilters } from '../../hooks/user-car-filters';

export function VehicleInventoryHeader() {
    const [filters] = useCarFilters();
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(
        trpc.adminDashboard.getAllAdmin.queryOptions(filters)
    );


    return (
        <div className="px-4 md:px-8 py-2">
            <div className="w-full bg-white rounded-md border border-gray-100 p-6 flex items-center justify-between font-sans">

                {/* Left side: Title and Count */}
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-[#0B0A38]">Vehicle Inventory</h1>
                    <div className="h-6 w-px bg-gray-200"></div>

                    <span className="text-gray-500 text-sm">Showing 1-{data.items.length} of {data.total} cars</span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        className="p-2 bg-indigo-50 text-indigo-900 rounded-full transition-colors"
                        aria-label="List View"
                    >
                        <List size={20} />
                    </button>
                </div>

            </div>
        </div>
    );
}