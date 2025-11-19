import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import Loading from "../Component/Loading";
import axios from "axios";
import { FiCheck, FiX, FiTrash2, FiEdit, FiPlus, FiSearch } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MyNotices() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [notices, setNotices] = useState([]);
    const [filteredNotices, setFilteredNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const canCreateNotice =
        user?.role === "admin" || (user?.role === "teacher" && user.isEnabled && user.status === "accepted");

    const fetchNotices = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`https://ns-server.onrender.com/api/notice/user/${user.id}`, {
                withCredentials: true,
            });
            setNotices(res.data);
            setFilteredNotices(res.data);
        } catch (err) {
            console.error("Error fetching notices:", err);
            toast.error("Failed to fetch notices");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchNotices();
    }, [user]);

    useEffect(() => {
        if (!searchQuery) {
            setFilteredNotices(notices);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = notices.filter(
                (notice) =>
                    notice.text.toLowerCase().includes(query) ||
                    (notice.category && notice.category.toLowerCase().includes(query)) ||
                    (notice.target && notice.target.toLowerCase().includes(query)) ||
                    (notice.department && notice.department.toLowerCase().includes(query))
            );
            setFilteredNotices(filtered);
        }
    }, [searchQuery, notices]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://ns-server.onrender.com/api/notice/delete/${id}`, { withCredentials: true });
            toast.info("Notice deleted successfully");
            fetchNotices();
        } catch (err) {
            console.error("Delete error:", err);
            toast.error("Failed to delete notice");
        }
    };

    const handleEdit = (id) => {
        navigate(`/update-notice/${id}`);
    };

    const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : "-";

    const handleRowClick = (notice) => {
        navigate(`/view-notice/${notice.id}`);
    };

    const handleImageClick = (e, notice) => {
        e.stopPropagation();
        navigate("/image", { state: { image: notice.image } });
    };

    if (loading) return <Loading />;

    return (
        <div className="flex justify-center mt-10 px-2 sm:px-4 min-h-[85vh]">
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                style={{ top: "60px" }}
            />
            <div className="w-full max-w-5xl rounded-lg p-4 sm:p-6">

                <div className="flex justify-center mb-10">
                    <div className="relative w-full max-w-md">
                        <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-textSubtle" />
                        <input
                            type="text"
                            placeholder="Search notices..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-borderSubtle bg-card text-textMain placeholder:text-textSubtle shadow focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm sm:text-base transition duration-DEFAULT"
                        />
                    </div>
                </div>

                {canCreateNotice && (
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={() => navigate("/create-notice")}
                            className="bg-btn hover:bg-btnHover text-textMain px-4 py-2 rounded-lg shadow hover:shadow-hover transition duration-DEFAULT flex items-center justify-center"
                        >
                            <span className="hidden sm:inline">Create Notice</span>
                            <FiPlus className="sm:hidden w-5 h-5" />
                        </button>
                    </div>
                )}

                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-6 text-center text-textMain">
                    My Notices
                </h2>

                {filteredNotices.length === 0 ? (
                    <p className="text-sm sm:text-base md:text-base text-center text-textSubtle">
                        No notices found.
                    </p>
                ) : (
                    <table className="w-full text-left border-collapse table-auto break-all text-sm sm:text-base md:text-base">
                        <thead>
                            <tr className="bg-card">
                                <th className="py-2 px-2 hidden lg:table-cell break-words text-xs sm:text-sm md:text-base text-textMain">
                                    Image
                                </th>
                                <th className="py-2 px-2 break-words text-xs sm:text-sm md:text-base text-textMain max-w-[150px] sm:max-w-[180px] md:max-w-xs">
                                    Title
                                </th>
                                <th className="py-2 px-2 hidden sm:table-cell md:table-cell break-words text-xs sm:text-sm md:text-base text-textMain">
                                    Category
                                </th>
                                <th className="py-2 px-2 break-words text-xs sm:text-sm md:text-base text-textMain">
                                    Target
                                </th>
                                <th className="py-2 px-2 sm:hidden md:table-cell break-words text-xs sm:text-sm md:text-base text-textMain">
                                    Department
                                </th>
                                <th className="py-2 px-2 hidden md:table-cell break-words text-xs sm:text-sm md:text-base text-textMain">
                                    Created At
                                </th>
                                <th className="py-2 px-2 break-words text-xs sm:text-sm md:text-base text-textMain">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredNotices.map((notice) => (
                                <tr
                                    key={notice.id}
                                    className="transition-colors duration-200 hover:bg-cardHover cursor-pointer"
                                    onClick={() => handleRowClick(notice)}
                                >
                                    <td
                                        className="py-2 px-2 hidden lg:table-cell break-words"
                                        onClick={(e) => handleImageClick(e, notice)}
                                    >
                                        {notice.image ? (
                                            <img
                                                src={notice.image}
                                                alt="notice"
                                                className="w-12 h-12 rounded-lg object-cover border border-borderSubtle"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 bg-card rounded-lg flex items-center justify-center text-textSubtle text-xs">
                                                No Image
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-2 px-2 break-words text-textMain max-w-[150px] sm:max-w-[180px] md:max-w-xs">
                                        <div className="line-clamp-4" title={notice.text}>
                                            {notice.text}
                                        </div>
                                    </td>
                                    <td className="py-2 px-2 hidden sm:table-cell md:table-cell break-words text-textMain">
                                        {capitalize(notice.category)}
                                    </td>
                                    <td className="py-2 px-2 break-words text-textMain">
                                        {capitalize(notice.target)}
                                    </td>
                                    <td className="py-2 px-2 sm:hidden md:table-cell break-words text-textMain">
                                        {capitalize(notice.department || "-")}
                                    </td>
                                    <td className="py-2 px-2 hidden md:table-cell break-words text-textMain">
                                        {new Date(notice.createdAt).toLocaleDateString()}{" "}
                                        {new Date(notice.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td className="py-2 px-2 space-x-2 break-words">
                                        <div className="flex space-x-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
                                            <FiEdit
                                                onClick={() => handleEdit(notice.id)}
                                                className="text-blue-500 cursor-pointer hover:scale-110 transition-transform"
                                            />
                                            <FiTrash2
                                                onClick={() => handleDelete(notice.id)}
                                                className="text-red-500 cursor-pointer hover:scale-110 transition-transform"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default MyNotices;
