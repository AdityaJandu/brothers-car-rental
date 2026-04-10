import AddCarView from "@/modules/admin/add-car/ui/views/AddCarView";
import { getSession } from "@/lib/cached-session";
import { redirect } from "next/navigation";


const Page = async () => {
    const session = await getSession();

    if (!session) {
        redirect("/sign-in");
    }

    if (session.user.role !== 'admin') {
        redirect('/');
    }

    return (
        <AddCarView />
    )
}

export default Page;