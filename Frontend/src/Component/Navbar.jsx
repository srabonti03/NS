import React, { useEffect, useState } from "react";
import { FiSun, FiMoon, FiMenu, FiBell } from "react-icons/fi";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

function Navbar({ dark, setDark, toggleSidebar }) {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [unreadNotifications, setUnreadNotifications] = useState(0);

    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/notification/notifications", {
                    method: "GET",
                    credentials: "include",
                });
                if (!res.ok) throw new Error("Failed to fetch notifications");

                const data = await res.json();
                setUnreadNotifications(data.unreadCount || 0);
            } catch (err) {
                console.error("Error fetching unread notifications:", err);
            }
        };

        fetchUnreadCount();
    }, []);

    return (
        <nav className="bg-layoutBg text-textMain font-body shadow border-b border-borderSubtle flex justify-between items-center px-4 py-3 md:px-8 sticky top-0 z-50">
            <div className="flex items-center gap-3 flex-shrink-0">
                <button
                    onClick={toggleSidebar}
                    className="p-1 transition duration-DEFAULT hover:text-primary lg:hidden"
                    aria-label="Toggle menu"
                >
                    <FiMenu size={24} />
                </button>

                <h1 className="hidden md:inline font-heading text-xl text-primary md:text-2xl font-bold whitespace-nowrap">
                    NoticeSphere
                </h1>
                <img
                    src="Display/noticesphere.png"
                    alt="NoticeSphere"
                    className="inline md:hidden w-8 h-8"
                />
            </div>

            <div className="flex items-center gap-4 flex-shrink-0">
                <div className="flex items-center gap-3 flex-shrink-0 relative cursor-pointer" onClick={() => navigate("/profile")}>
                    <img
                        src={user?.avatar || "Fallback/avatar.png"}
                        alt="avatar"
                        className="w-6 h-6 rounded-full"
                    />
                    <span className="hidden sm:inline text-textMain font-medium truncate max-w-[100px]">
                        {user?.firstName || ""}
                    </span>
                </div>

                <button
                    onClick={() => navigate("/notifications")}
                    className="p-1 transition duration-DEFAULT hover:text-primary relative flex-shrink-0"
                    aria-label="Notifications"
                >
                    <FiBell size={20} />
                    {unreadNotifications > 0 && (
                        <span className="absolute -top-1 -right-1 text-[10px] w-4 h-4 flex items-center justify-center rounded-full bg-red-600 text-white font-bold">
                            {unreadNotifications}
                        </span>
                    )}
                </button>

                <button
                    onClick={() => setDark(!dark)}
                    className="p-1 transition duration-DEFAULT hover:text-primary flex-shrink-0"
                    aria-label="Toggle theme"
                >
                    {dark ? <FiSun size={20} /> : <FiMoon size={20} />}
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
