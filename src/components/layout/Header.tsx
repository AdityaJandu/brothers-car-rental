import { getSession } from "@/lib/cached-session";
import { HeaderClient } from "./HeaderClient";

export async function Header() {
    const session = await getSession();

    return <HeaderClient session={session} />;
}