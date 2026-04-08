import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export const RewardsStatusCard = () => {
    return (
        <div className="bg-[#1E293B] rounded-2xl p-7 lg:col-span-1 shadow-lg relative overflow-hidden flex flex-col justify-between min-h-75">
            <div className="absolute -bottom-10 -right-10 opacity-10">
                <Star className="w-48 h-48" />
            </div>
            <div className="relative z-10">
                <h3 className="text-white text-xl font-bold tracking-wide">Rewards Status</h3>
                <p className="text-slate-400 text-sm mt-3 leading-relaxed max-w-[90%]">
                    You&apos;re 2,150 points away from your next free weekend rental.
                </p>
            </div>
            <div className="relative z-10 mt-10">
                <div className="w-full bg-slate-800 rounded-full h-3 mb-6 relative">
                    <div className="bg-[#FF8C00] h-3 rounded-full w-[80%]"></div>
                </div>
                <Button className="w-full bg-white text-[#1E293B] hover:bg-slate-100 font-bold h-12 rounded-xl">
                    Redeem Rewards
                </Button>
            </div>
        </div>
    );
};
