import { Button } from "@/components/ui/button";

import { GetOne } from "@/modules/user/browse/types";
import Link from "next/link";


interface PricingCarProps {
    car: GetOne
}
export const PricingCard = ({ car }: PricingCarProps) => {
    return (
        <>
            <div className="bg-[#1E2A44] text-white rounded-md p-7 shadow-2xl font-display">
                {/* Price Section */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <p className="text-sm text-slate-400">Daily Rate</p>

                        <p className="text-4xl font-extrabold">
                            &#8377;{car.pricePerDay}
                            <span className="text-sm text-slate-400 font-medium"> /day</span>
                        </p>
                    </div>
                </div>

                {/* Info */}
                <div className="space-y-4 text-sm mb-8">
                    <div className="flex justify-between border-t border-white/10 pt-4">
                        <span className="text-slate-400">Status</span>
                        <span className="capitalize">{car.status}</span>
                    </div>

                    <div className="flex justify-between border-t border-white/10 pt-4">
                        <span className="text-slate-400">Plate</span>

                        <span>{car.plateNumber}</span>
                    </div>

                    {/* TODO: add insurance field in DB */}
                    <div className="flex justify-between border-t border-white/10 pt-4">
                        <span className="text-slate-400">Insurance</span>
                        <span>Included</span>
                    </div>
                </div>

                <Link href={`/check-out/${car.id}`}>
                    <Button className="w-full h-16 bg-[#FF8C00] hover:bg-[#E67E00] text-white text-lg font-bold rounded-md shadow-lg transition-all">
                        Book Now
                    </Button>
                </Link>

                <p className="text-xs text-center text-slate-400 mt-4">
                    No hidden fees • 24/7 concierge support
                </p>


            </div>

            {/* Little space so that doesn't mess up with the nav bar */}
            <div className="pb-10 md:hidden" ></div>
        </>

    );
};