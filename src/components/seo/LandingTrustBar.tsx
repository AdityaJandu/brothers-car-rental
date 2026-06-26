import { CheckCircle2 } from "lucide-react";

export function LandingTrustBar() {
    return (
        <div className="bg-primary text-primary-foreground py-4 mt-8 rounded-xl shadow-sm">
            <div className="max-w-5xl mx-auto px-6 flex flex-wrap justify-center items-center gap-6 md:gap-12 text-sm md:text-base font-medium">
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-5 text-secondary" />
                    <span>450+ Verified Vehicles</span>
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-5 text-secondary" />
                    <span>Doorstep Delivery Available</span>
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-5 text-secondary" />
                    <span>Starting from ₹749/day</span>
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-5 text-secondary" />
                    <span>Zero Hidden Charges</span>
                </div>
            </div>
        </div>
    );
}
