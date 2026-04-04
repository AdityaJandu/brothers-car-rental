import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PersonalInfoCardProps {
    name: string;
    phone: string | null;
}

export const PersonalInfoCard = ({ name, phone }: PersonalInfoCardProps) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-bold text-[#0F172A]">Personal Info</h2>
                <button className="text-[#FF8C00] text-sm font-bold hover:underline">Edit All</button>
            </div>

            <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Full Name</p>
                    <p className="text-base font-semibold text-[#0F172A]">{name}</p>
                </div>
                <div className="border-b border-slate-100 pb-4">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Phone Number</p>
                    {phone ? (
                        <p className="text-base font-semibold text-[#0F172A]">{phone}</p>
                    ) : (
                        <div className="flex items-center gap-2 mt-1">
                            <input
                                type="tel"
                                placeholder="+1 (555) 000-0000"
                                className="bg-white border border-slate-200 rounded-md px-3 py-1.5 text-sm w-full max-w-[250px] outline-none focus:ring-2 focus:ring-[#FF8C00] transition-shadow shadow-sm"
                            />
                            <Button size="sm" className="bg-[#1E293B] text-white hover:bg-slate-800 rounded-md h-8">Save</Button>
                        </div>
                    )}
                </div>
                <div className="border-b border-slate-100 pb-4 flex items-center justify-between cursor-pointer group">
                    <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Driver's License</p>
                        <p className="text-base font-semibold text-[#0F172A]">•••• •••• 9821 (Exp: 2027)</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                </div>
            </div>
        </div>
    );
};
