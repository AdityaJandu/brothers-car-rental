// "use client";

// import {
//     CircleXIcon,
//     CircleCheckIcon,
//     LoaderIcon,
// } from "lucide-react";

// import { CommandSelect } from "@/components/self/command-select";

// import { CarStatus } from "../../types";
// import { useCarFilters } from "../../hooks/user-car-filters";

// const options = [

//     // Maintenance
//     {
//         id: CarStatus.Maintenance,
//         value: CarStatus.Maintenance,
//         children: (
//             <div className="flex items-center gap-x-4 capitalize">
//                 <LoaderIcon className="animate-spin" />
//                 <p>Maintenance</p>
//             </div>
//         ),
//     },

//     // Available
//     {
//         id: CarStatus.Available,
//         value: CarStatus.Available,
//         children: (
//             <div className="flex items-center gap-x-4 capitalize">
//                 <CircleCheckIcon />
//                 <p>Available</p>
//             </div>
//         ),
//     },

//     // Rented
//     {
//         id: CarStatus.Rented,
//         value: CarStatus.Rented,
//         children: (
//             <div className="flex items-center gap-x-4 capitalize">
//                 <CircleXIcon />
//                 <p>Rented</p>
//             </div>
//         ),
//     },
// ];


// export const CarStatusFilter = () => {
//     const [filters, setFilters] = useCarFilters();

//     return (
//         <CommandSelect
//             placeholder="Status"
//             className="h-9"
//             options={options}
//             onSelect={(value) => setFilters({ status: value as CarStatus })}
//             value={filters.status ?? ""}
//         />
//     );
// }