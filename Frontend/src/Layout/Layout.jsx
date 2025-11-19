import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Component/Sidebar";
import Navbar from "../Component/Navbar";
import Footer from "../Component/Footer";

function Layout({ dark, setDark }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar
                dark={dark}
                setDark={setDark}
                toggleSidebar={toggleSidebar}
                className="fixed top-0 left-0 w-full z-50"
            />

            <div className="flex flex-1">
                <Sidebar isOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} className="hide=scrollbar" />
                <main className="flex-1 h-[calc(100vh-60px)] overflow-auto lg:ml-30">
                    <Outlet />
                    <Footer />
                </main>
            </div>
        </div>
    );
}

export default Layout;
