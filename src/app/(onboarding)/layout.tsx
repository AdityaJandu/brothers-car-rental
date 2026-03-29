import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";

interface props {
    children: React.ReactNode;
}

const Layout = ({ children }: props) => {
    return (
        <div className="min-h-full flex flex-col bg-background text-foreground">
            <Header />
            <main className="flex-1">{children}</main>
            <MobileNav />
        </div>
    );
};

export default Layout;