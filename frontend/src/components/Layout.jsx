import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children, showSidebar = false }) => {
    return (
        <div className="h-screen overflow-hidden flex">
            {showSidebar && <Sidebar />}

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <Navbar />

                <main className="flex-1 overflow-y-auto bg-base-100">{children}</main>
            </div>
        </div>
    );
};
export default Layout;