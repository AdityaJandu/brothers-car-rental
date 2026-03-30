
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function FiltersBar() {
    return (
        <div className="bg-white rounded-xl p-4 shadow-ambient flex flex-col lg:flex-row gap-4 mb-8">

            <Input placeholder="Location (Delhi, Noida...)" />

            <Input type="date" />

            <Input type="date" />

            <select className="border rounded-md px-3 py-2 text-sm">
                <option>All Types</option>
                <option>Sedan</option>
                <option>SUV</option>
            </select>

            <Button className="btn-primary">Search</Button>

        </div>
    );
}