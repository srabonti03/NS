import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import { useLocation } from "react-router-dom";
import Loading from "../Component/Loading";
import Notice from "../Component/Notice";

function NoticeFeed() {
    const { user } = useAuth();
    const location = useLocation();
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotices = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams(location.search);
            const category = params.get("category");

            const url = category
                ? "http://localhost:5000/api/notice/all-by-category?category=" + encodeURIComponent(category)
                : "http://localhost:5000/api/notice/all";

            const response = await axios.get(url, { withCredentials: true });
            let fetchedNotices = response.data;

            fetchedNotices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setNotices(fetchedNotices);
        } catch (err) {
            console.error("Error fetching notices:", err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotices();
    }, [user, location.search]);

    if (loading) return <Loading />;

    if (!notices.length)
        return <div className="text-center mt-10 text-gray-500 text-sm sm:text-base min-h-[90vh]">No notices available.</div>;

    return (
        <div className="max-w-5xl w-full px-2 sm:px-4 md:px-6 mx-auto py-4 space-y-6 min-h-[90vh]">
            {notices.map((notice) => (
                <Notice key={notice.id} notice={notice} />
            ))}
        </div>
    );
}

export default NoticeFeed;
