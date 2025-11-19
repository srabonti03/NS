import React, { useState, useRef, useEffect } from "react";
import { FiThumbsUp, FiMessageCircle, FiShare2 } from "react-icons/fi";
import { FaThumbsUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Comments from "./Comments";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";

function Notice({ notice }) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    const [showFullText, setShowFullText] = useState(false);
    const commentsRef = useRef(null);
    const textRef = useRef(null);
    const [showToggleButton, setShowToggleButton] = useState(false);
    const [commentCount, setCommentCount] = useState(0);
    const [shareCount, setShareCount] = useState(0);
    const [likeCount, setLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        if (textRef.current) {
            setShowToggleButton(textRef.current.scrollHeight > textRef.current.clientHeight);
        }
    }, [notice.text]);

    useEffect(() => {
        const fetchCommentCount = async () => {
            try {
                const res = await axios.get(
                    `https://ns-server.onrender.com/api/comment/comments/${notice.id}`,
                    { withCredentials: true }
                );
                setCommentCount(res.data.totalCount || 0);
            } catch (err) {
                setCommentCount(0);
            }
        };
        fetchCommentCount();
    }, [notice.id]);

    useEffect(() => {
        const fetchShareCount = async () => {
            try {
                const res = await axios.get(
                    `https://ns-server.onrender.com/api/share/shares/${notice.id}`,
                    { withCredentials: true }
                );
                setShareCount(res.data.totalShares || 0);
            } catch (err) {
                setShareCount(0);
            }
        };
        fetchShareCount();
    }, [notice.id]);

    useEffect(() => {
        const fetchLikes = async () => {
            try {
                const res = await axios.get(
                    `https://ns-server.onrender.com/api/like/count/${notice.id}`,
                    { withCredentials: true }
                );
                setLikeCount(res.data.totalLikes || 0);

                const check = await axios.get(
                    `https://ns-server.onrender.com/api/like/check/${notice.id}`,
                    { withCredentials: true }
                );
                setIsLiked(check.data.liked || false);
            } catch (err) {
                setLikeCount(0);
                setIsLiked(false);
            }
        };
        if (user) fetchLikes();
    }, [notice.id, user]);

    const handleImageClick = () => navigate("/image", { state: { image: notice.image } });
    const toggleText = () => setShowFullText(!showFullText);
    const handleCommentIconClick = () => commentsRef.current && commentsRef.current.focusInput();
    const handleTitleClick = (notice) => navigate(`/view-notice/${notice.id}`);

    const handleShareClick = async (e) => {
        e.stopPropagation();
        const shareUrl = `${window.location.origin}/notice/${notice.id}`;
        try {
            const res = await axios.post(
                `https://ns-server.onrender.com/api/share/shares/${notice.id}`,
                {},
                { withCredentials: true }
            );
            setShareCount(res.data.totalShares || 0);
        } catch { }
        if (navigator.share) {
            navigator.share({
                title: "Notice",
                text: notice.text.slice(0, 100) + "...",
                url: shareUrl,
            }).catch(() => { });
        } else {
            navigator.clipboard.writeText(shareUrl);
            alert("Link copied to clipboard!");
        }
    };

    const handleLikeClick = async (e) => {
        e.stopPropagation();
        try {
            if (isLiked) {
                const res = await axios.post(
                    `https://ns-server.onrender.com/api/like/unlike/${notice.id}`,
                    {},
                    { withCredentials: true }
                );
                setIsLiked(false);
                setLikeCount(res.data.totalLikes || (likeCount - 1));
            } else {
                const res = await axios.post(
                    `https://ns-server.onrender.com/api/like/like/${notice.id}`,
                    {},
                    { withCredentials: true }
                );
                setIsLiked(true);
                setLikeCount(res.data.totalLikes || (likeCount + 1));
            }
        } catch { }
    };

    const showInfo = user && (user.role === "admin" || user.id === notice.createdByUser.id);

    return (
        <div
            className="p-4 bg-card shadow rounded-lg border border-borderSubtle hover:bg-cardHover transition duration-300 w-full cursor-pointer"
            onClick={() => handleTitleClick(notice)}
        >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                <h3
                    className="font-heading font-semibold text-sm text-textSubtle break-words cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleTitleClick(notice);
                    }}
                >
                    {capitalizeFirst(notice.category)}
                </h3>
                <span className="text-xs sm:text-sm text-textSubtle mt-1 sm:mt-0">
                    {new Date(notice.createdAt).toLocaleString()}
                </span>
            </div>
            {showInfo && (
                <div className="text-xs text-textSubtle mb-2 flex flex-wrap gap-1" onClick={(e) => e.stopPropagation()}>
                    {notice.createdByUser ? (
                        <>
                            <span>{notice.createdByUser.firstName} {notice.createdByUser.lastName}</span>
                            <span className="text-textFaint">• {notice.createdByUser.role}</span>
                            <span>{" | "}Target: {notice.target ? capitalizeFirst(notice.target) : "All"}</span>
                            <span>{" | "}Department: {notice.department ? capitalizeFirst(notice.department) : "All"}</span>
                            {notice.target === "students" && (
                                <>
                                    <span>{" | "}Session: {notice.session ? capitalizeFirst(notice.session) : "All"}</span>
                                    <span>{" | "}Section: {notice.section ? capitalizeFirst(notice.section) : "All"}</span>
                                </>
                            )}
                        </>
                    ) : "Unknown"}
                </div>
            )}
            <p
                ref={textRef}
                className={`mb-2 text-textMain text-sm sm:text-base overflow-hidden ${showFullText ? "" : "line-clamp-5"}`}
                onClick={(e) => e.stopPropagation()}
            >
                {notice.text}
            </p>
            {showToggleButton && (
                <button
                    onClick={(e) => { e.stopPropagation(); toggleText(); }}
                    className="text-textFaint hover:text-textSubtle text-sm mb-2 cursor-pointer hover:underline"
                >
                    {showFullText ? "See Less" : "See More"}
                </button>
            )}
            {notice.image && (
                <div className="w-full overflow-visible rounded mb-2 flex justify-center cursor-pointer" onClick={(e) => { e.stopPropagation(); handleImageClick(); }}>
                    <img src={notice.image} alt="Notice" className="w-full max-w-[600px] lg:max-w-[500px] h-auto object-contain" />
                </div>
            )}
            <div className="flex justify-between mt-2 border-t border-borderSubtle pt-2 px-0 md:px-10 lg:px-20">
                <div className="flex items-center gap-1 px-2 py-1 rounded-full cursor-pointer transition duration-200 bg-bg text-textSubtle hover:bg-btnHover hover:text-textMain" onClick={handleLikeClick}>
                    {isLiked ? <FaThumbsUp className="w-4 h-4 md:w-5 md:h-5 text-primary transition" /> : <FiThumbsUp className="w-4 h-4 md:w-5 md:h-5" />}
                    <span className="text-xs sm:text-sm lg:text-base">{likeCount}</span>
                </div>
                <div className="flex items-center gap-1 bg-bg text-textSubtle px-2 py-1 rounded-full cursor-pointer transition duration-200 hover:bg-btnHover hover:text-textMain" onClick={(e) => { e.stopPropagation(); handleCommentIconClick(); }}>
                    <FiMessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-xs sm:text-sm lg:text-base">{commentCount}</span>
                </div>
                <div className="flex items-center gap-1 bg-bg text-textSubtle px-2 py-1 rounded-full cursor-pointer transition duration-200 hover:bg-btnHover hover:text-textMain" onClick={handleShareClick}>
                    <FiShare2 className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-xs sm:text-sm lg:text-base">{shareCount}</span>
                </div>
            </div>
            <div className="mt-4" onClick={(e) => e.stopPropagation()}>
                <Comments ref={commentsRef} noticeId={notice.id} noticeAuthorId={notice.createdByUser?.id} />
            </div>
        </div>
    );
}

export default Notice;
