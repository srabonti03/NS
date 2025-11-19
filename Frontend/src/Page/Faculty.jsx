import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FiBriefcase, FiCheckCircle, FiXCircle, FiCalendar } from "react-icons/fi";
import Loading from "../Component/Loading";

function Faculty() {
    const { id } = useParams();
    const [teacher, setTeacher] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeacher = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`http://localhost:5000/api/admin/teachers/${id}`, {
                    withCredentials: true,
                });
                setTeacher(res.data);
            } catch (err) {
                console.error("Error fetching teacher:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTeacher();
    }, [id]);

    if (loading) return <Loading />;
    if (!teacher) return <p className="text-center mt-10 text-textSubtle">Teacher not found.</p>;

    const calculateJoined = (createdAt) => {
        const createdDate = new Date(createdAt);
        const now = new Date();
        const diff = now - createdDate;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days < 1) return "Joined today";
        if (days === 1) return "Joined yesterday";
        if (days < 30) return `Joined ${days} day${days > 1 ? "s" : ""} ago`;
        const months = Math.floor(days / 30);
        if (months < 12) return `Joined ${months} month${months > 1 ? "s" : ""} ago`;
        const years = Math.floor(months / 12);
        return `Joined ${years} year${years > 1 ? "s" : ""} ago`;
    };

    return (
        <div className="min-h-[93vh] flex justify-center items-center bg-bg px-4 sm:px-6">
            <div className="w-full max-w-4xl bg-card rounded-md shadow border border-borderSubtle overflow-hidden">
                <div className="relative bg-primary h-40 sm:h-48 flex items-end justify-center">
                    <img
                        src={teacher.avatar || "/Fallback/avatar.png"}
                        alt="avatar"
                        className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border-4 border-card object-cover -mb-16 shadow bg-card"
                    />
                </div>
                <div className="pt-20 pb-8 px-6 sm:px-12 flex flex-col sm:flex-row gap-8">
                    <div className="flex-1 text-center sm:text-left space-y-2">
                        <h1 className="text-3xl sm:text-4xl font-heading text-textMain">
                            {teacher.firstName} {teacher.lastName}
                        </h1>
                        <a
                            href={`mailto:${teacher.email}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-textSubtle text-sm sm:text-base hover:underline hover:text-primary"
                        >
                            {teacher.email}
                        </a>
                        <div className="w-full flex justify-center md:justify-start">
                            <div className="flex flex-col text-left max-w-xs">
                                <div className="flex items-center gap-2 text-textSubtle text-sm sm:text-base">
                                    <FiBriefcase className="text-lg text-primary" />
                                    <span className="font-medium text-textMain">{teacher.dept || "-"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm sm:text-base">
                                    {teacher.isEnabled ? (
                                        <FiCheckCircle className="text-green-500 text-lg" />
                                    ) : (
                                        <FiXCircle className="text-red-500 text-lg" />
                                    )}
                                    <span className="font-medium text-textMain">{teacher.status || "N/A"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-textSubtle text-sm sm:text-base mt-2">
                                    <FiCalendar className="text-lg text-primary" />
                                    <span>{calculateJoined(teacher.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col gap-4">
                        <div className="bg-cardHover rounded-xl p-4 shadow flex justify-between items-center">
                            <div>
                                <p className="text-textSubtle text-sm">Total Notices</p>
                                <p className="text-textMain font-semibold text-lg">{teacher.totalNotices || 0}</p>
                            </div>
                        </div>
                        <div className="bg-cardHover rounded-xl p-4 shadow flex justify-between items-center">
                            <div>
                                <p className="text-textSubtle text-sm">Account Status</p>
                                <p className={`text-lg font-semibold ${teacher.isEnabled ? "text-green-500" : "text-red-500"}`}>
                                    {teacher.isEnabled ? "Enabled" : "Disabled"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Faculty;
