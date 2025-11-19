import prisma from '../Config/prismaClient.js';
import { createNotification } from './notificationControllers.js';

// ================== Get Share Count ==================
export const getShareCount = async (req, res) => {
    try {
        const { noticeId } = req.params;
        if (!noticeId) return res.status(400).json({ message: "Notice ID is required" });

        const totalShares = await prisma.noticeShare.count({ where: { noticeId } });

        const shares = await prisma.noticeShare.findMany({
            where: { noticeId },
            include: {
                user: { select: { firstName: true, lastName: true, avatar: true, role: true } },
            },
            orderBy: { createdAt: 'desc' },
        });

        const formattedShares = shares.map(s => ({
            id: s.id,
            user: `${s.user?.firstName || 'Unknown'} ${s.user?.lastName || ''}`,
            avatar: s.user?.avatar || 'Fallback/avatar.png',
            role: s.user?.role || 'student',
            noticeId: s.noticeId,
            time: `${Math.floor((new Date() - new Date(s.createdAt)) / 3600000)}h ago`,
        }));

        return res.status(200).json({ noticeId, totalShares, shares: formattedShares });
    } catch (error) {
        console.error("Error fetching share count:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ================== Add Share ==================
export const addShare = async (req, res) => {
    try {
        const { noticeId } = req.params;
        const userId = req.user.id;

        if (!noticeId) return res.status(400).json({ message: "Notice ID is required" });

        try {
            await prisma.noticeShare.create({
                data: { noticeId, userId }
            });
        } catch (err) {
            if (err.code !== 'P2002') {
                throw err;
            }
        }

        const totalShares = await prisma.noticeShare.count({ where: { noticeId } });

        const notice = await prisma.notice.findUnique({ where: { id: noticeId } });
        if (notice && notice.createdBy !== userId) {
            await createNotification({
                userId: notice.createdBy,
                fromUserId: userId,
                noticeId,
                type: 'share-notice',
            });
        }

        const shares = await prisma.noticeShare.findMany({
            where: { noticeId },
            include: {
                user: { select: { firstName: true, lastName: true, avatar: true, role: true } },
            },
            orderBy: { createdAt: 'desc' },
        });

        const formattedShares = shares.map(s => ({
            id: s.id,
            user: `${s.user?.firstName || 'Unknown'} ${s.user?.lastName || ''}`,
            avatar: s.user?.avatar || 'Fallback/avatar.png',
            role: s.user?.role || 'student',
            noticeId: s.noticeId,
            time: `${Math.floor((new Date() - new Date(s.createdAt)) / 3600000)}h ago`,
        }));

        return res.status(201).json({ message: "Shared successfully", totalShares, shares: formattedShares });
    } catch (error) {
        console.error("Error adding share:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
