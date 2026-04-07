import { User, Mail, Phone, IdCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CustomerInfoCardProps {
    fullName: string;
    email: string;
    phoneNumber: string;
    licenseNumber: string;
}

export const CustomerInfoCard = ({ fullName, email, phoneNumber, licenseNumber }: CustomerInfoCardProps) => {
    return (
        <Card className="shadow-sm border-slate-100 bg-white group/card p-4">
            <CardHeader className="pb-4 border-b border-slate-100 mb-4 px-0 pt-0">
                <CardTitle className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                    <User className="w-5 h-5 text-slate-400" />
                    Customer Details
                </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0 space-y-5">

                <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Full Name</p>
                        <p className="font-semibold text-[#0B0F3B] text-sm">{fullName}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Email Address</p>
                        <p className="font-semibold text-[#0B0F3B] text-sm break-all">{email}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Phone Number</p>
                        <p className="font-semibold text-[#0B0F3B] text-sm">{phoneNumber}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                        <IdCard className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Driver&apos;s License</p>
                        <p className="font-mono text-[#0B0F3B] text-sm tracking-widest">{licenseNumber}</p>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
};
