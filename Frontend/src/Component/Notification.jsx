import React from "react";
import { FiThumbsUp, FiMessageCircle, FiShare2 } from "react-icons/fi";

function Notification({ notification }) {
    const getIcon = (type) => {
        switch (type) {
            case "like-notice":
            case "like-comment":
                return <FiThumbsUp className="w-5 h-5 text-blue-500" />;
            case "comment-notice":
            case "reply-comment":
                return <FiMessageCircle className="w-5 h-5 text-green-500" />;
            case "share-notice":
                return <FiShare2 className="w-5 h-5 text-purple-500" />;
            default:
                return null;
        }
    };

    const handleClick = async () => {
        if (notification.id && !notification.isRead) {
            try {
                await fetch(
                    `https://ns-server.onrender.com/api/notification/notifications/${notification.id}/read`,
                    {
                        method: "PATCH",
                        credentials: "include",
                    }
                );
            } catch (err) {
                console.error("Error marking notification as read:", err);
            }
        }

        if (notification.link) {
            window.location.href = notification.link;
        }
    };

    const avatarSrc = notification.avatar || "Fallback/avatar.png";

    return (
        <div
            className={`flex items-start gap-3 p-3 shadow rounded-lg border border-borderSubtle transition cursor-pointer w-full
                ${notification.isRead ? "bg-card hover:bg-cardHover" : "bg-cardHover font-bold"}`}
            onClick={handleClick}
        >
            <div className="flex-shrink-0">
                <img
                    src={avatarSrc}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                />
            </div>
            <div className="flex-1">
                <p className={`text-sm md:text-base ${!notification.isRead ? "font-bold" : ""} text-textSubtle`}>
                    <span className="font-semibold">{notification.user}</span>{" "}
                    {notification.mainText}{" "}
                    <span className="font-medium text-textMain line-clamp-2">
                        {notification.highlight}
                    </span>
                </p>
                <div className="flex items-center gap-2 mt-1 text-textFaint text-xs md:text-sm">
                    {getIcon(notification.type)}
                    <span>{notification.time}</span>
                </div>
            </div>
        </div>
    );
}

export default Notification;
