import { Banknote, Smartphone } from "lucide-react";

const methods = [
    {
        icon: Banknote,
        label: "Cash on Drop-off",
        description: "Pay in cash when you return the vehicle",
        badge: "Primary",
    },
    {
        icon: Smartphone,
        label: "UPI",
        description: "Pay via any UPI app at drop-off",
        badge: null,
    },
];

export const PaymentMethodsCard = () => {
    return (
        <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-bold text-[#0F172A]">Payment</h2>
                <p className="text-slate-500 text-sm mt-1">
                    All payments are collected at drop-off.
                </p>
            </div>

            <div className="space-y-3">
                {methods.map(({ icon: Icon, label, description, badge }) => (
                    <div
                        key={label}
                        className="bg-[#F8F9FA] rounded-lg p-4 flex items-center gap-4 border border-slate-100 shadow-sm"
                    >
                        <div className="bg-[#1E293B] text-white w-10 h-10 rounded-lg shrink-0 flex items-center justify-center">
                            <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-bold text-[#0F172A]">{label}</p>
                                {badge && (
                                    <span className="text-[10px] font-bold uppercase tracking-widest bg-[#FF8C00]/10 text-[#FF8C00] px-2 py-0.5 rounded-full">
                                        {badge}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">{description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
                We currently accept <span className="font-semibold text-slate-500">cash</span> and <span className="font-semibold text-slate-500">UPI</span> only. Online card payments are not supported at this time.
            </p>
        </div>
    );
};
