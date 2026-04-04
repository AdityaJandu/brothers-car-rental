import { Fingerprint, ShieldAlert } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export const SecuritySettingsCard = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-bold text-[#0F172A]">Security</h2>
            </div>

            <div className="bg-[#F8F9FA] rounded-xl p-6 space-y-6 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Fingerprint className="w-5 h-5 text-slate-700" />
                        <span className="font-semibold text-sm text-[#0F172A]">Biometric Login</span>
                    </div>
                    <Switch checked={true} className="data-[state=checked]:bg-[#FF8C00]" />
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <ShieldAlert className="w-5 h-5 text-slate-700" />
                        <span className="font-semibold text-sm text-[#0F172A]">Two-Factor Auth</span>
                    </div>
                    <Switch checked={false} />
                </div>
            </div>
        </div>
    );
};
