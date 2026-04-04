import { CreditCard, MoreVertical } from "lucide-react";

export const PaymentMethodsCard = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-bold text-[#0F172A]">Payment Methods</h2>
                <button className="text-[#FF8C00] text-sm font-bold hover:underline">Add New</button>
            </div>

            <div className="bg-[#F8F9FA] rounded-xl p-4 flex items-center justify-between border border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="bg-[#1E293B] text-white w-12 h-8 rounded shrink-0 flex items-center justify-center">
                        <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-[#0F172A]">Platinum Visa Premium</p>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">Ending in 4022 • Default</p>
                    </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600 p-2">
                    <MoreVertical className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};
