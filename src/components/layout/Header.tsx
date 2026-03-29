// Header.tsx (SERVER)
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { HeaderClient } from "./HeaderClient";

export async function Header() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return <HeaderClient session={session} />;
}