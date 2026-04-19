import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, FileText } from "lucide-react";

interface AdminBookingCustomerInfoProps {
    fullName: string;
    email: string;
    phoneNumber: string;
    licenseNumber: string;
}

export const AdminBookingCustomerInfo = ({
    fullName,
    email,
    phoneNumber,
    licenseNumber,
}: AdminBookingCustomerInfoProps) => {
    return (
        <Card className="shadow-sm rounded-md bg-white dark:bg-zinc-950">
            <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Customer Information
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                    <User className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                        <p className="text-sm font-medium leading-none mb-1">Full Name</p>
                        <p className="text-sm text-muted-foreground break-all">{fullName || "Not provided"}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                        <p className="text-sm font-medium leading-none mb-1">Email</p>
                        <p className="text-sm text-muted-foreground break-all">{email || "Not provided"}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                        <p className="text-sm font-medium leading-none mb-1">Phone Number</p>
                        <p className="text-sm text-muted-foreground break-all">{phoneNumber || "Not provided"}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <FileText className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                        <p className="text-sm font-medium leading-none mb-1">License Number</p>
                        <p className="text-sm text-muted-foreground break-all">{licenseNumber || "Not provided"}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
