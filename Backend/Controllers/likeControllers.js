import prisma from '../Config/prismaClient.js';
import { createNotification } from './notificationControllers.js';

// ================== Like a notice ==================
export const likeNotice = async (req, res) => {
    const { noticeId } = req.params;
    const userId = req.user.id;

    try {
        const existing = await prisma.noticeLike.findUnique({
            where: { noticeId_userId: { noticeId, userId } },
        });

        if (existing) {
            return res.status(400).json({ message: 'You already liked this notice' });
        }

        const notice = await prisma.notice.findUnique({ where: { id: noticeId } });
        if (!notice) return res.status(404).json({ message: 'Notice not found' });

        await prisma.noticeLike.create({
            data: {
                noticeId,
                userId,
                avatar: req.user.avatar || null,
            },
        });

        if (notice.createdBy !== userId) {
            await createNotification({
                userId: notice.createdBy,
                fromUserId: userId,
                noticeId,
                type: 'like-notice',
            });
        }

        const totalLikes = await prisma.noticeLike.count({ where: { noticeId } });

        const likes = await prisma.noticeLike.findMany({
            where: { noticeId },
            include: {
                user: { select: { firstName: true, lastName: true, avatar: true, role: true } },
            },
            orderBy: { createdAt: 'desc' },
        });

        const formattedLikes = likes.map(l => ({
            id: l.id,
            user: `${l.user?.firstName || 'Unknown'} ${l.user?.lastName || ''}`,
            avatar: l.user?.avatar || 'Fallback/avatar.png',
            role: l.user?.role || 'student',
            noticeId: l.noticeId,
            time: `${Math.floor((new Date() - new Date(l.createdAt)) / 3600000)}h ago`,
        }));

        res.status(201).json({ message: 'Notice liked', totalLikes, likes: formattedLikes });
    } catch (err) {
        console.error('Error in likeNotice:', err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// ================== Unlike a notice ==================
export const unlikeNotice = async (req, res) => {
    const { noticeId } = req.params;
    const userId = req.user.id;

    try {
        const existing = await prisma.noticeLike.findUnique({
            where: { noticeId_userId: { noticeId, userId } },
        });

        if (!existing) {
            return res.status(400).json({ message: 'You have not liked this notice' });
        }

        await prisma.noticeLike.delete({
            where: { noticeId_userId: { noticeId, userId } },
        });

        const totalLikes = await prisma.noticeLike.count({ where: { noticeId } });

        const likes = await prisma.noticeLike.findMany({
            where: { noticeId },
            include: {
                user: { select: { firstName: true, lastName: true, avatar: true, role: true } },
            },
            orderBy: { createdAt: 'desc' },
        });

        const formattedLikes = likes.map(l => ({
            id: l.id,
            user: `${l.user?.firstName || 'Unknown'} ${l.user?.lastName || ''}`,
            avatar: l.user?.avatar || 'Fallback/avatar.png',
            role: l.user?.role || 'student',
            noticeId: l.noticeId,
            time: `${Math.floor((new Date() - new Date(l.createdAt)) / 3600000)}h ago`,
        }));

        res.status(200).json({ message: 'Notice unliked', totalLikes, likes: formattedLikes });
    } catch (err) {
        console.error('Error in unlikeNotice:', err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// ================== Get total likes for a notice ==================
export const getNoticeLikes = async (req, res) => {
    const { noticeId } = req.params;

    try {
        const totalLikes = await prisma.noticeLike.count({ where: { noticeId } });

        const likes = await prisma.noticeLike.findMany({
            where: { noticeId },
            include: {
                user: { select: { firstName: true, lastName: true, avatar: true, role: true } },
            },
            orderBy: { createdAt: 'desc' },
        });

        const formattedLikes = likes.map(l => ({
            id: l.id,
            user: `${l.user?.firstName || 'Unknown'} ${l.user?.lastName || ''}`,
            avatar: l.user?.avatar || 'Fallback/avatar.png',
            role: l.user?.role || 'student',
            noticeId: l.noticeId,
            time: `${Math.floor((new Date() - new Date(l.createdAt)) / 3600000)}h ago`,
        }));

        res.status(200).json({ totalLikes, likes: formattedLikes });
    } catch (err) {
        console.error('Error in getNoticeLikes:', err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// ================== Check if user liked a notice ==================
export const checkLike = async (req, res) => {
    const { noticeId } = req.params;
    const userId = req.user.id;

    try {
        const existing = await prisma.noticeLike.findUnique({
            where: { noticeId_userId: { noticeId, userId } },
        });

        res.status(200).json({ liked: !!existing });
    } catch (err) {
        console.error('Error in checkLike:', err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};
