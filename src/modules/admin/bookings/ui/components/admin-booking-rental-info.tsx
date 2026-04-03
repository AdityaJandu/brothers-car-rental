import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Car, Clock } from "lucide-react";
import { format } from "date-fns";

interface AdminBookingRentalInfoProps {
    carId: string | null;
    startDate: string;
    endDate: string;
    days: number;
    carName?: string | null;
    carMake?: string | null;
    carModel?: string | null;
    carYear?: number | null;
}

export const AdminBookingRentalInfo = ({
    carId,
    startDate,
    endDate,
    days,
    carName,
    carMake,
    carModel,
    carYear
}: AdminBookingRentalInfoProps) => {
    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "MMM d, yyyy, h:mm a");
        } catch {
            return dateString;
        }
    };

    return (
        <Card className="shadow-sm rounded-md bg-white dark:bg-zinc-950">
            <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Car className="w-5 h-5 text-primary" />
                    Rental Information
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                    <Car className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                        <p className="text-sm font-medium leading-none mb-1">
                            {carYear} {carMake} {carModel}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">{carName}</span>
                            <span className="text-xs text-muted-foreground font-mono bg-muted/50 px-1 py-0.5 rounded w-fit">ID: {carId || "N/A"}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                        <p className="text-sm font-medium leading-none mb-1">Duration</p>
                        <p className="text-sm text-muted-foreground">{days} {days === 1 ? 'day' : 'days'}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3 md:col-span-2 bg-muted/30 p-3 rounded-md border border-border/50">
                    <CalendarDays className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 w-full">
                        <div>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Pick-up</p>
                            <p className="text-sm font-medium">{formatDate(startDate)}</p>
                        </div>
                        <div className="hidden sm:block text-muted-foreground/30">
                            →
                        </div>
                        <div className="block sm:hidden text-muted-foreground/30 pl-2">
                            ↓
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Drop-off</p>
                            <p className="text-sm font-medium">{formatDate(endDate)}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
