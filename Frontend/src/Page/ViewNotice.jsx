import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Notice from "../Component/Notice";
import axios from "axios";

function ViewNotice() {
    const { id } = useParams();
    const [notice, setNotice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNotice = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/notice/${id}`, {
                    withCredentials: true,
                });
                setNotice(response.data);
            } catch (err) {
                console.error("Error fetching notice:", err);
                if (err.response && err.response.status === 404) {
                    setError("Notice not found.");
                } else if (err.response && err.response.status === 401) {
                    setError("Unauthorized. Please log in.");
                } else {
                    setError("Server error fetching notice.");
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchNotice();
        else setError("No notice ID provided.");
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[90vh]">
                <p className="text-textSubtle">Loading notice...</p>
            </div>
        );
    }

    if (error || !notice) {
        return (
            <div className="flex justify-center items-center h-[90vh]">
                <p className="text-textSubtle">{error || "No notice selected."}</p>
            </div>
        );
    }

    return (
        <div className="flex justify-center py-4 px-2 sm:px-4 min-h-[90vh]">
            <div className="w-full max-w-4xl">
                <Notice notice={notice} />
            </div>
        </div>
    );
}

export default ViewNotice;
