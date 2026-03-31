import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { HeaderAdmin } from "./HeaderAdmin";

export async function AdminHeader() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return <HeaderAdmin session={session} />;
}