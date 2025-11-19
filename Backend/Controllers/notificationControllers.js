import prisma from '../Config/prismaClient.js';

// ================== Get Notifications for a Specific User ==================
export const getUserNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const { filter } = req.query;

        const notifications = await prisma.notification.findMany({
            where: {
                userId,
                ...(filter === 'read' ? { isRead: true } : {}),
                ...(filter === 'unread' ? { isRead: false } : {}),
            },
            include: {
                fromUser: { select: { firstName: true, lastName: true, avatar: true, role: true } },
                notice: { select: { id: true, text: true, image: true, category: true, target: true, session: true, department: true, section: true, createdAt: true } },
            },
            orderBy: { createdAt: 'desc' },
        });

        const formattedNotifications = await Promise.all(
            notifications.map(async (n) => {
                let totalComments = 0;
                let totalLikes = 0;
                let totalShares = 0;
                let commentText = null;

                if (n.noticeId) {
                    totalComments = await prisma.noticeComment.count({ where: { noticeId: n.noticeId } });
                    totalLikes = await prisma.noticeLike.count({ where: { noticeId: n.noticeId } });
                    totalShares = await prisma.noticeShare.count({ where: { noticeId: n.noticeId } });
                }

                if (n.type === 'comment-notice') {
                    const comment = await prisma.noticeComment.findFirst({
                        where: { noticeId: n.noticeId, userId: n.fromUserId },
                    });
                    commentText = comment?.text || null;
                }
                if (n.type === 'reply-comment') {
                    const reply = await prisma.noticeCommentReply.findFirst({
                        where: { userId: n.fromUserId },
                    });
                    commentText = reply?.text || null;
                }

                let link = n.noticeId ? `/view-notice/${n.noticeId}` : '';
                if (n.type === 'reply-comment' || n.type === 'like-comment') {
                    link += `#comment-${n.noticeId}`;
                }

                return {
                    id: n.id,
                    type: n.type,
                    user: `${n.fromUser?.firstName || 'Unknown'} ${n.fromUser?.lastName || ''}`,
                    avatar: n.fromUser?.avatar || 'Fallback/avatar.png',
                    role: n.fromUser?.role || 'student',
                    mainText:
                        n.type === 'like-notice'
                            ? 'liked your notice on'
                            : n.type === 'comment-notice'
                                ? 'commented:'
                                : n.type === 'reply-comment'
                                    ? 'replied to your comment on'
                                    : n.type === 'like-comment'
                                        ? 'liked your comment regarding'
                                        : n.type === 'share-notice'
                                            ? 'shared your notice'
                                            : 'updated',
                    highlight: commentText || n.notice?.text || n.text,
                    noticeDetails: {
                        image: n.notice?.image || null,
                        category: n.notice?.category || null,
                        target: n.notice?.target || null,
                        session: n.notice?.session || null,
                        department: n.notice?.department || null,
                        section: n.notice?.section || null,
                        createdAt: n.notice?.createdAt || null,
                    },
                    time: `${Math.floor((new Date() - new Date(n.createdAt)) / 3600000)}h ago`,
                    totalComments,
                    totalLikes,
                    totalShares,
                    isRead: n.isRead,
                    link,
                };
            })
        );

        const unreadCount = await prisma.notification.count({
            where: { userId, isRead: false },
        });

        const totalNotifications = notifications.length;

        res.json({ totalNotifications, unreadCount, notifications: formattedNotifications });
    } catch (err) {
        console.error('getUserNotifications error:', err);
        res.status(500).json({ message: 'Error fetching notifications' });
    }
};

// ================== Mark a Single Notification as Read ==================
export const markNotificationAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const userId = req.user.id;

        if (!notificationId) return res.status(400).json({ message: "Notification ID is required" });

        const notification = await prisma.notification.findUnique({ where: { id: notificationId } });

        if (!notification) return res.status(404).json({ message: "Notification not found" });
        if (notification.userId !== userId) return res.status(403).json({ message: "Not authorized" });

        const updatedNotification = await prisma.notification.update({
            where: { id: notificationId },
            data: { isRead: true },
        });

        res.status(200).json({ message: "Notification marked as read", notification: updatedNotification });
    } catch (err) {
        console.error("markNotificationAsRead error:", err);
        res.status(500).json({ message: "Error updating notification" });
    }
};

// ================== Helper to Create a Notification ==================
export const createNotification = async ({
    userId,
    fromUserId,
    noticeId,
    type,
    text = '',
    avatar = null,
}) => {
    try {
        if (!userId || !type) return null;

        return await prisma.notification.create({
            data: {
                userId,
                fromUserId,
                noticeId: noticeId || null,
                type,
                text,
                avatar,
            },
        });
    } catch (err) {
        console.error('createNotification error:', err);
        return null;
    }
};
