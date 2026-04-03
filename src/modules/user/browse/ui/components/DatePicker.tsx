"use client"

import { type DateRange } from "react-day-picker"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useIsMobile } from "@/hooks/use-mobile"

interface DatePickerProps {
    date: DateRange | undefined;
    setDate: (date: DateRange | undefined) => void;
    children: React.ReactNode; // Accept any custom UI to act as the trigger
    disabled?: any;
}

export function DatePicker({ date, setDate, children, disabled }: DatePickerProps) {
    const isMobile = useIsMobile()

    return (
        <Popover>
            {/* asChild merges the trigger functionality onto our custom button */}
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>

            <PopoverContent
                className="w-auto p-0 rounded-md shadow-2xl border-slate-200 overflow-hidden bg-white mt-1 z-50 max-w-[100vw]"
                align="start"
                sideOffset={8}
            >
                <Calendar
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={isMobile ? 1 : 2}
                    disabled={disabled}
                    className="p-4"
                />
            </PopoverContent>
        </Popover>
    )
}