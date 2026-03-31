
import { LayoutGrid, List } from 'lucide-react';

export function VehicleInventoryHeader() {
    return (
        <div className="px-4 md:px-8 py-2">
            <div className="w-full bg-white rounded-t-3xl border border-gray-100 p-6 flex items-center justify-between font-sans">

                {/* Left side: Title and Count */}
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-[#0B0A38]">Vehicle Inventory</h1>
                    <div className="h-5 w-px bg-gray-200"></div>

                    {/* TODO: Add responsive data from pagination */}
                    <span className="text-gray-500 text-sm">Showing 1-8 of 124 cars</span>
                </div>

                {/* Right side: View Toggles */}
                <div className="flex items-center gap-2">
                    <button
                        className="p-2 text-gray-400 hover:text-gray-800 transition-colors rounded-full"
                        aria-label="Grid View"
                    >
                        <LayoutGrid size={20} />
                    </button>
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