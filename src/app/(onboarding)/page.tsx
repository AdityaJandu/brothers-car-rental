import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { OnboardingView } from "@/modules/onboarding/ui/views/OnboardingView";

export default async function Page() {

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session?.user?.role === "admin") {
        redirect("/dashboard");
    }

    return (
        <OnboardingView />
    );
}