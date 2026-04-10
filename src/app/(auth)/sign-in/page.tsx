import { SignInView } from "@/modules/auth/ui/views/SignInView";
import { getSession } from "@/lib/cached-session";
import { redirect } from "next/navigation";


export default async function Page() {
    const session = await getSession();

    if (!!session) {
        redirect("/");
    }

    return (
        <SignInView />
    );
}
