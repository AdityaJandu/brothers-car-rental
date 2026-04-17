import { ReceiptText } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface PaymentSummaryCardProps {
    dailyRate: number;
    days: number;
    protectionFee: number;
    surchargeFee: number;
    totalPrice: number;
    status: string;
}

export const PaymentSummaryCard = ({
    dailyRate,
    days,
    protectionFee,
    surchargeFee,
    totalPrice,
    status
}: PaymentSummaryCardProps) => {

    return (
        <div className="bg-white rounded-[32px] font-display p-6 sm:p-8 shadow-sm border border-slate-100/60">
            <div className="flex items-center gap-3 mb-8">
                <ReceiptText className="w-6 h-6 text-[#8B4513]" />
                <h2 className="text-xl font-bold text-[#0B0F3B]">Price Breakdown</h2>
            </div>

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium text-[15px]">Daily Rate ({days} days)</span>
                    <span className="font-bold text-[#0B0F3B] text-[15px]">₹ {(dailyRate * days).toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium text-[15px]">Executive Insurance</span>
                    <span className="font-bold text-[#0B0F3B] text-[15px]">₹ {protectionFee.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium text-[15px]">Surcharges & Fees</span>
                    <span className="font-bold text-[#0B0F3B] text-[15px]">₹ {surchargeFee.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between items-center pb-2">
                    <span className="text-slate-500 font-medium text-[15px]">Tax (0%)</span>
                    <span className="font-bold text-[#0B0F3B] text-[15px]">₹ 0</span>
                </div>
            </div>

            <Separator className="my-6 border-dashed bg-transparent border-t-2 border-slate-200" />

            <div className="flex flex-col items-start gap-1">
                <span className="text-[11px] uppercase font-bold text-slate-400 tracking-widest">Total Price</span>
                <div className="flex items-center justify-between w-full">
                    <span className="text-4xl sm:text-[44px] font-bold text-[#0B0F3B] tracking-tight leading-none">
                        ₹ {totalPrice.toLocaleString("en-IN")}
                    </span>

                    {status === "completed" || status === "confirmed" ? (
                        <span className="bg-[#FEF3C7] text-[#D97706] text-[10px] uppercase font-bold px-3 py-1.5 rounded-full tracking-widest">Paid</span>
                    ) : (
                        <span className="bg-slate-100 text-slate-500 text-[10px] uppercase font-bold px-3 py-1.5 rounded-full tracking-widest">Unpaid</span>
                    )}
                </div>
            </div>
        </div>
    );
};