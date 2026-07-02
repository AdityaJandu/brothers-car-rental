
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/cached-session";
import Link from "next/link";

export async function CTASection() {

    const session = await getSession();

    if (session) {
        return null;
    }
    return (
        <section className="w-full px-6 py-12 lg:px-12 bg-background">
            <div className="max-w-7xl mx-auto bg-primary rounded-[40px] px-6 py-16 md:py-24 flex flex-col items-center text-center shadow-ambient">

                <h2 className="text-3xl md:text-5xl lg:text-[3.5rem] font-bold text-white font-heading tracking-tight mb-6">
                    Start Your Journey Today
                </h2>

                <p className="text-white/70 text-base md:text-lg max-w-2xl mb-10 leading-relaxed">
                    Join over 10,000+ drivers who trust Brothers for their premium
                    mobility needs. Sign up and get ₹1000 off your first booking.
                </p>

                <Link href="/sign-up">
                    <Button
                        className="bg-[#517fa4] hover:bg-[#3d6a8a] text-white h-14 px-10 text-base font-bold rounded-md transition-colors"

                    >
                        Sign Up Now
                    </Button>
                </Link>

            </div>
        </section>
    );
}