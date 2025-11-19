import React, { useEffect, useState } from "react";
import Notification from "../Component/Notification";

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const res = await fetch("https://ns-server.onrender.com/api/notification/notifications", {
                method: "GET",
                credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to fetch notifications");

            const data = await res.json();
            setNotifications(data.notifications || []);
        } catch (err) {
            console.error("Error fetching notifications:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleNotificationClick = async (notification) => {
        if (notification.id) {
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

        fetchNotifications();

        if (notification.link) {
            window.location.href = notification.link;
        }
    };

    return (
        <div className="p-4 sm:p-6 md:p-8 max-w-5xl w-full mx-auto min-h-[90vh]">
            <h2 className="text-xl sm:text-2xl font-semibold text-textMain mb-4">
                Notifications
            </h2>
            <div className="flex flex-col gap-4">
                {loading && <p className="text-textSubtle text-center">Loading...</p>}
                {!loading && notifications.length === 0 && (
                    <p className="text-textSubtle text-center">No notifications yet.</p>
                )}
                {!loading &&
                    notifications.map((notif) => (
                        <Notification
                            key={notif.id}
                            notification={notif}
                            onClick={() => handleNotificationClick(notif)}
                        />
                    ))}
            </div>
        </div>
    );
}

export default Notifications;
