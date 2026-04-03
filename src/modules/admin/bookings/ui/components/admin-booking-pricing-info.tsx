import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Wallet, Receipt, Shield, Activity } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface AdminBookingPricingInfoProps {
    dailyRate: number;
    days: number;
    protectionFee: number | null;
    surchargeFee: number | null;
    totalPrice: number;
    paymentMethod: string | null;
}

export const AdminBookingPricingInfo = ({
    dailyRate,
    days,
    protectionFee,
    surchargeFee,
    totalPrice,
    paymentMethod,
}: AdminBookingPricingInfoProps) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <Card className="shadow-sm rounded-md bg-white dark:bg-zinc-950 border-primary/10">
            <CardHeader className="pb-3 border-b border-border/50 bg-primary/5">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-primary" />
                    Payment Summary
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
                <div className="space-y-3 pb-2">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                            <Activity className="w-4 h-4" />
                            Rental ({formatCurrency(dailyRate)} per day &times; {days} days)
                        </span>
                        <span className="font-medium">{formatCurrency(dailyRate * days)}</span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Protection Fee
                        </span>
                        <span className="font-medium">{formatCurrency(protectionFee || 0)}</span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                            <Wallet className="w-4 h-4" />
                            Surcharges / Extras
                        </span>
                        <span className="font-medium">{formatCurrency(surchargeFee || 0)}</span>
                    </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center text-base pt-1">
                    <span className="font-semibold text-foreground">Total Price</span>
                    <span className="font-bold text-primary text-lg">{formatCurrency(totalPrice)}</span>
                </div>

                <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-3 bg-muted/20 p-3 rounded-md">
                    <CreditCard className="w-5 h-5 text-muted-foreground" />
                    <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5">Payment Method</p>
                        <p className="text-sm font-medium capitalize">{paymentMethod || "Not specified"}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
