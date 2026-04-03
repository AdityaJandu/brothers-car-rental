import { AdminNavbar } from "@/components/layout/AdminHeaderNavBar";


interface props {
    children: React.ReactNode;
};

const Layout = ({ children }: props) => {
    return (
        <div className="min-h-screen bg-slate-50">
            <AdminNavbar />
            {children}
        </div>
    )
};

export default Layout;