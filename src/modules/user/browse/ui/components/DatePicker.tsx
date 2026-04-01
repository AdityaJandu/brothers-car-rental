"use client"

import { type DateRange } from "react-day-picker"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
    date: DateRange | undefined;
    setDate: (date: DateRange | undefined) => void;
    children: React.ReactNode; // Accept any custom UI to act as the trigger
}

export function DatePicker({ date, setDate, children }: DatePickerProps) {
    return (
        <Popover>
            {/* asChild merges the trigger functionality onto our custom button */}
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0 rounded-xl shadow-lg border-slate-100" align="start">
                <Calendar
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                    className="p-3"
                />
            </PopoverContent>
        </Popover>
    )
}