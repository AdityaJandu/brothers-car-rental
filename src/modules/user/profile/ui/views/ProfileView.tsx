"use client";

import { Loader2, LogOut } from "lucide-react";
import { LoadingState } from "@/components/self/loading-state";
import { ErrorState } from "@/components/self/error-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

import { ProfileHeader } from "../components/ProfileHeader";
import { RewardsStatusCard } from "../components/RewardsStatusCard";
import { ActiveBookingCard } from "../components/ActiveBookingCard";
import { PersonalInfoCard } from "../components/PersonalInfoCard";
import { PaymentMethodsCard } from "../components/PaymentMethodsCard";
import { SecuritySettingsCard } from "../components/SecuritySettingsCard";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const ProfileView = () => {

    const trpc = useTRPC();
    const router = useRouter();

    const [loggingOut, setLoggingOut] = useState<boolean>(false);

    const { data: userData } = useSuspenseQuery(
        trpc.userProfile.getUser.queryOptions()
    );


    const name = userData.name;
    const email = userData.email;
    const image = userData.image;

    const logOut = async () => {
        setLoggingOut(true);

        try {
            await authClient.signOut();
            toast("Logged out successfully", {
                description: "You have been logged out successfully",
            });
            router.push("/");
        } catch (error) {
            console.log(error);
            toast("Error logging out", {
                description: "Please try again later",
            });
        } finally {
            setLoggingOut(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-10">

                <ProfileHeader
                    name={name}
                    email={email}
                    image={image}
                    emailVerified={userData.emailVerified}
                />

                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <RewardsStatusCard />
                    <ActiveBookingCard />
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                    <PersonalInfoCard name={name} phone={userData.phone || null} />
                    <div className="space-y-10">
                        <PaymentMethodsCard />
                        <SecuritySettingsCard />
                    </div>
                </section>

                {/* SIGN OUT BUTTON */}
                <div className="flex justify-center pt-8 pb-12">
                    <button onClick={logOut} disabled={loggingOut} className="flex items-center gap-3 bg-[#F1F3F5] text-[#D92D20] font-bold text-sm px-8 py-3.5 rounded-md hover:bg-[#E5E9EC] transition-colors shadow-sm">
                        {loggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                        {loggingOut ? "Signing out..." : "Sign Out from Executive Portal"}
                    </button>
                </div>

            </div>
        </div>
    );
};


export const ProfileViewLoading = () => {
    return (
        <LoadingState title="Please wait" descr="Loading your profile this may take a while." />
    );
}

export const ProfileViewError = () => {
    return (
        <ErrorState title="Something went wrong" descr="Please try again later or refresh the page." />
    )
}