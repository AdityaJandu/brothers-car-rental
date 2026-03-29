import { AuthHeader } from "@/modules/auth/ui/layout/AuthHeader";

interface props {
    children: React.ReactNode;
};

const Layout = ({ children }: props) => {
    return (
        <div className="bg-muted flex min-h-svh">
            <div className="w-full ">
                <AuthHeader />
                {children}
            </div>
        </div>
    )
};

export default Layout;