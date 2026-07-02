import AddCarView from "@/modules/admin/add-car/ui/views/AddCarView";
import { getSession } from "@/lib/cached-session";
import { redirect } from "next/navigation";

interface EditCarPageProps {
    params: Promise<{
        carId: string;
    }>;
}

const Page = async ({ params }: EditCarPageProps) => {
    const session = await getSession();

    if (!session) {
        redirect("/sign-in");
    }

    if (session.user.role !== 'admin') {
        redirect('/');
    }

    const { carId } = await params;

    return (
        <AddCarView carId={carId} />
    )
}

export default Page;
