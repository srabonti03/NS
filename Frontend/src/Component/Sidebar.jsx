import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
    FiHome,
    FiTrendingUp,
    FiCheckSquare,
    FiClock,
    FiBook,
    FiChevronDown,
    FiUser,
    FiLock,
    FiLogOut,
} from "react-icons/fi";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";

function Sidebar({ isOpen, setSidebarOpen }) {
    const { user, logout } = useAuth();
    const [categories, setCategories] = useState([]);
    const [showCategories, setShowCategories] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLinkClick = () => {
        if (setSidebarOpen) setSidebarOpen(false);
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get("https://ns-server.onrender.com/api/notice/options", {
                withCredentials: true,
            });
            setCategories(response.data.categories || []);
        } catch (err) {
            console.error("Error fetching categories:", err.response?.data?.message || err.message);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const isCategoryActive = (catName) => {
        const params = new URLSearchParams(location.search);
        return params.get("category") === catName;
    };

    const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    return (
        <aside
            className={`
            bg-layoutBg text-textSubtle fixed top-[60px] left-0
            p-4 transition-transform duration-300 z-40 
            flex flex-col justify-start overflow-auto shadow
            w-full sm:w-full md:w-72 lg:w-64 h-[calc(100vh-60px)]
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0 lg:static hide-scrollbar
        `}
        >
            <nav className="flex flex-col gap-3 w-full items-start justify-start">
                {user?.role === "teacher" && user.status === "pending" ? (
                    <>
                        <NavLink
                            to="/pending"
                            onClick={handleLinkClick}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded hover:bg-btnHover hover:text-textMain transition duration-200 w-full justify-start text-base sm:text-lg md:text-sm lg:text-base ${
                                    isActive ? "bg-btnHover text-textMain font-normal" : ""
                                }`
                            }
                        >
                            <FiClock className="text-2xl sm:text-3xl md:text-lg lg:text-xl" />
                            <span className="font-medium">Pending</span>
                        </NavLink>
                        <span className="uppercase text-xs font-semibold text-textMuted px-4 mt-5 mb-1 tracking-wide">
                            Account
                        </span>
                        <NavLink
                            to="/logout"
                            onClick={logout}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded hover:bg-btnHover hover:text-textMain transition duration-200 w-full justify-start text-base sm:text-lg md:text-sm lg:text-base ${
                                    isActive ? "bg-btnHover text-textMain font-normal" : ""
                                }`
                            }
                        >
                            <FiLogOut className="text-2xl sm:text-3xl md:text-lg lg:text-xl" />
                            <span className="font-medium">Logout</span>
                        </NavLink>
                    </>
                ) : (
                    <>
                        <span className="uppercase text-xs font-semibold text-textMuted px-4 mt-2 mb-1 tracking-wide">
                            General
                        </span>
                        <div className="flex flex-col w-full items-start justify-start">
                            <div
                                className={`flex items-center justify-between px-4 py-3 rounded w-full transition duration-200 cursor-pointer hover:bg-btnHover hover:text-textMain`}
                            >
                                <NavLink
                                    to="/"
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 flex-1 px-2 py-2 rounded transition duration-200 justify-start ${
                                            isActive && !location.search
                                                ? "bg-btnHover text-textMain font-normal"
                                                : ""
                                        }`
                                    }
                                    onClick={() => {
                                        handleLinkClick();
                                        setShowCategories(false);
                                    }}
                                >
                                    <FiHome className="text-2xl sm:text-3xl md:text-lg lg:text-xl" />
                                    <span className="font-medium text-base sm:text-lg md:text-sm lg:text-base">
                                        Notices
                                    </span>
                                </NavLink>

                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowCategories(!showCategories);
                                    }}
                                    className={`ml-2 focus:outline-none transition-transform duration-200 ${
                                        showCategories ? "rotate-180" : ""
                                    }`}
                                >
                                    <FiChevronDown className="text-xl sm:text-2xl" />
                                </button>
                            </div>

                            {showCategories && (
                                <div className="flex flex-col mt-2 gap-2 w-full items-start justify-start ml-0 md:ml-6">
                                    {categories.length > 0 ? (
                                        categories.map((cat) => (
                                            <button
                                                key={cat.id || cat}
                                                onClick={() => {
                                                    navigate(
                                                        `/notices?category=${encodeURIComponent(
                                                            cat.name || cat
                                                        )}`
                                                    );
                                                    handleLinkClick();
                                                    setShowCategories(false);
                                                }}
                                                className={`flex items-center gap-2 px-4 py-2 rounded hover:bg-btnHover hover:text-textMain transition duration-200 w-full justify-start text-base sm:text-lg md:text-sm lg:text-base ${
                                                    isCategoryActive(cat.name || cat)
                                                        ? "bg-btnHover text-textMain font-normal"
                                                        : ""
                                                }`}
                                            >
                                                {capitalizeFirst(cat.name || cat)}
                                            </button>
                                        ))
                                    ) : (
                                        <span className="text-base sm:text-lg px-4 py-2 text-textSubtle">
                                            No categories
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        {user?.role === "admin" && (
                            <>
                                <span className="uppercase text-xs font-semibold text-textMuted px-4 mt-4 mb-1 tracking-wide">
                                    Analytics
                                </span>
                                <NavLink
                                    to="/insights"
                                    onClick={handleLinkClick}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded hover:bg-btnHover hover:text-textMain transition duration-200 w-full justify-start text-base sm:text-lg md:text-sm lg:text-base ${
                                            isActive
                                                ? "bg-btnHover text-textMain font-normal"
                                                : ""
                                        }`
                                    }
                                >
                                    <FiTrendingUp className="text-2xl sm:text-3xl md:text-lg lg:text-xl" />
                                    <span className="font-medium">Insights</span>
                                </NavLink>
                            </>
                        )}

                        {(user?.role === "admin" ||
                            (user?.role === "teacher" && user.status !== "pending")) && (
                            <>
                                <span className="uppercase text-xs font-semibold text-textMuted px-4 mt-4 mb-1 tracking-wide">
                                    Management
                                </span>
                                <NavLink
                                    to="/my-notices"
                                    onClick={handleLinkClick}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded hover:bg-btnHover hover:text-textMain transition duration-200 w-full justify-start text-base sm:text-lg md:text-sm lg:text-base ${
                                            isActive
                                                ? "bg-btnHover text-textMain font-normal"
                                                : ""
                                        }`
                                    }
                                >
                                    <FiBook className="text-2xl sm:text-3xl md:text-lg lg:text-xl" />
                                    <span className="font-medium">My Notices</span>
                                </NavLink>
                            </>
                        )}

                        {user?.role === "admin" && (
                            <>
                                <NavLink
                                    to="/faculty-notices"
                                    onClick={handleLinkClick}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded hover:bg-btnHover hover:text-textMain transition duration-200 w-full justify-start text-base sm:text-lg md:text-sm lg:text-base ${
                                            isActive
                                                ? "bg-btnHover text-textMain font-normal"
                                                : ""
                                        }`
                                    }
                                >
                                    <FiBook className="text-2xl sm:text-3xl md:text-lg lg:text-xl" />
                                    <span className="font-medium">Faculty Notices</span>
                                </NavLink>

                                <NavLink
                                    to="/teachers"
                                    onClick={handleLinkClick}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded hover:bg-btnHover hover:text-textMain transition duration-200 w-full justify-start text-base sm:text-lg md:text-sm lg:text-base ${
                                            isActive
                                                ? "bg-btnHover text-textMain font-normal"
                                                : ""
                                        }`
                                    }
                                >
                                    <FiCheckSquare className="text-2xl sm:text-3xl md:text-lg lg:text-xl" />
                                    <span className="font-medium">Faculty List</span>
                                </NavLink>

                                <NavLink
                                    to="/students"
                                    onClick={handleLinkClick}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded hover:bg-btnHover hover:text-textMain transition duration-200 w-full justify-start text-base sm:text-lg md:text-sm lg:text-base ${
                                            isActive
                                                ? "bg-btnHover text-textMain font-normal"
                                                : ""
                                        }`
                                    }
                                >
                                    <FiCheckSquare className="text-2xl sm:text-3xl md:text-lg lg:text-xl" />
                                    <span className="font-medium">Student List</span>
                                </NavLink>
                            </>
                        )}

                        <span className="uppercase text-xs font-semibold text-textMuted px-4 mt-5 mb-1 tracking-wide">
                            Account
                        </span>
                        <NavLink
                            to="/profile"
                            onClick={handleLinkClick}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded hover:bg-btnHover hover:text-textMain transition duration-200 w-full justify-start text-base sm:text-lg md:text-sm lg:text-base ${
                                    isActive ? "bg-btnHover text-textMain font-normal" : ""
                                }`
                            }
                        >
                            <FiUser className="text-2xl sm:text-3xl md:text-lg lg:text-xl" />
                            <span className="font-medium">Profile</span>
                        </NavLink>

                        <NavLink
                            to="/change-password"
                            onClick={handleLinkClick}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded hover:bg-btnHover hover:text-textMain transition duration-200 w-full justify-start text-base sm:text-lg md:text-sm lg:text-base ${
                                    isActive ? "bg-btnHover text-textMain font-normal" : ""
                                }`
                            }
                        >
                            <FiLock className="text-2xl sm:text-3xl md:text-lg lg:text-xl" />
                            <span className="font-medium">Change Password</span>
                        </NavLink>

                        <NavLink
                            to="/logout"
                            onClick={logout}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded hover:bg-btnHover hover:text-textMain transition duration-200 w-full justify-start text-base sm:text-lg md:text-sm lg:text-base ${
                                    isActive ? "bg-btnHover text-textMain font-normal" : ""
                                }`
                            }
                        >
                            <FiLogOut className="text-2xl sm:text-3xl md:text-lg lg:text-xl" />
                            <span className="font-medium">Logout</span>
                        </NavLink>
                    </>
                )}
            </nav>
        </aside>
    );
}

export default Sidebar;
