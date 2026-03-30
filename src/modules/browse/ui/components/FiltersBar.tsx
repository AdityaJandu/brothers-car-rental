
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "./DatePicker";
import { useState } from "react";

export function FiltersBar() {

    const [pickupDate, setPickupDate] = useState<Date | undefined>(undefined);
    const [dropoffDate, setDropoffDate] = useState<Date | undefined>(undefined);


    return (
        <div className="rounded-xl p-4 shadow-ambient flex flex-col lg:flex-row gap-4 mb-8">

            <Input placeholder="Location (Delhi, Noida...)" />

            <DatePicker
                date={pickupDate && dropoffDate ? { from: pickupDate, to: dropoffDate } : undefined}
                setDate={(date) => {
                    setPickupDate(date?.from);
                    setDropoffDate(date?.to);
                }}
                desription="Pick-up and Drop-off Dates"
            />

            <select className="border rounded-md px-3 pr-2 py-2 text-sm">
                <option>All Types</option>
                <option>Sedan</option>
                <option>SUV</option>
            </select>

            <Button className="btn-primary">Search</Button>

        </div>
    );
}