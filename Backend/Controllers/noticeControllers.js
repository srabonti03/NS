import prisma from '../Config/prismaClient.js';
import cloudinary from '../Config/cloudinaryConfig.js';
import fs from 'fs';
import slugify from 'slugify';

// Get dropdown options and existing categories
export const getNoticeOptions = async (req, res) => {
    try {
        const sessionOptionsRaw = await prisma.user.findMany({
            where: { role: 'student', session: { not: null } },
            distinct: ['session'],
            select: { session: true },
        });
        const departmentOptionsRaw = await prisma.user.findMany({
            where: { role: { in: ['student', 'teacher'] }, dept: { not: null } },
            distinct: ['dept'],
            select: { dept: true },
        });
        const sectionOptionsRaw = await prisma.user.findMany({
            where: { role: 'student', section: { not: null } },
            distinct: ['section'],
            select: { section: true },
        });
        const categoryOptionsRaw = await prisma.notice.findMany({
            distinct: ['category'],
            select: { category: true },
        });

        return res.json({
            sessions: sessionOptionsRaw.map(s => s.session),
            departments: departmentOptionsRaw.map(d => d.dept),
            sections: sectionOptionsRaw.map(sec => sec.section),
            categories: categoryOptionsRaw.map(c => c.category),
        });
    } catch (err) {
        console.error('Error fetching notice options:', err);
        return res.status(500).json({ message: 'Server error fetching options' });
    }
};

// Create Notice
export const createNotice = async (req, res) => {
    try {
        const { text, category, target, session, department, section } = req.body;

        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user) return res.status(401).json({ message: 'Unauthorized: User not found' });

        if (
            user.role !== 'admin' &&
            !(user.role === 'teacher' && user.status === 'accepted' && user.isEnabled)
        ) {
            return res.status(403).json({ message: 'Forbidden: You cannot post a notice' });
        }

        let imageUrl = null;
        const folderName = `NoticeSphere/Notices/${slugify(text.substring(0, 20), { lower: true, strict: true })}`;

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, { folder: folderName });
            imageUrl = result.secure_url;
            fs.unlinkSync(req.file.path);
        }

        const notice = await prisma.notice.create({
            data: {
                text,
                category,
                target,
                session: target === 'students' ? session : null,
                department: department || null,
                section: target === 'students' ? section : null,
                image: imageUrl,
                createdBy: req.user.id,
            },
        });

        res.status(201).json({ message: 'Notice created successfully', notice });
    } catch (err) {
        console.error('Error creating notice:', err);
        res.status(500).json({ message: 'Server error creating notice' });
    }
};

// Get All Notices
export const getAllNotices = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user) return res.status(401).json({ message: 'Unauthorized: User not found' });

        let notices;

        const globalTeacherNotice = { target: 'teachers', department: 'all' };
        const globalStudentNotice = { target: 'students', department: 'all' };
        const globalAllNotice = [{ target: 'all', department: 'all' }, { target: 'all', department: user.dept }];

        if (user.role === 'admin') {
            notices = await prisma.notice.findMany({
                orderBy: { createdAt: 'desc' },
                include: { createdByUser: true },
            });
        } else if (user.role === 'teacher') {
            notices = await prisma.notice.findMany({
                where: {
                    OR: [
                        ...globalAllNotice,
                        { AND: [{ target: 'teachers' }, { department: user.dept }] },
                        globalTeacherNotice,
                        { AND: [{ target: 'students' }, { createdBy: user.id }] }
                    ],
                },
                orderBy: { createdAt: 'desc' },
                include: { createdByUser: true },
            });
        } else if (user.role === 'student') {
            notices = await prisma.notice.findMany({
                where: {
                    OR: [
                        ...globalAllNotice,
                        { AND: [{ target: 'students' }, { session: user.session }] },
                        { AND: [{ target: 'students' }, { session: null }] },
                        { AND: [{ target: 'students' }, { department: user.dept }] },
                        globalStudentNotice,
                        { AND: [{ target: 'students' }, { section: user.section }] },
                        { AND: [{ target: 'students' }, { section: null }] }
                    ],
                },
                orderBy: { createdAt: 'desc' },
                include: { createdByUser: true },
            });
        } else {
            notices = [];
        }

        res.json(notices);
    } catch (err) {
        console.error('Error fetching notices:', err);
        res.status(500).json({ message: 'Server error fetching notices' });
    }
};

// Get All Notices by Category
export const getAllNoticesByCategory = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user) return res.status(401).json({ message: 'Unauthorized: User not found' });

        const { category } = req.query;
        if (!category) return res.status(400).json({ message: 'Category is required' });

        let notices;

        const globalTeacherNotice = { target: 'teachers', department: 'all' };
        const globalStudentNotice = { target: 'students', department: 'all' };
        const globalAllNotice = [{ target: 'all', department: 'all' }, { target: 'all', department: user.dept }];

        if (user.role === 'admin') {
            notices = await prisma.notice.findMany({
                where: { category },
                orderBy: { createdAt: 'desc' },
                include: { createdByUser: true },
            });
        } else if (user.role === 'teacher') {
            notices = await prisma.notice.findMany({
                where: {
                    category,
                    OR: [
                        ...globalAllNotice,
                        { AND: [{ target: 'teachers' }, { department: user.dept }] },
                        globalTeacherNotice,
                        { AND: [{ target: 'students' }, { createdBy: user.id }] }
                    ],
                },
                orderBy: { createdAt: 'desc' },
                include: { createdByUser: true },
            });
        } else if (user.role === 'student') {
            notices = await prisma.notice.findMany({
                where: {
                    category,
                    OR: [
                        ...globalAllNotice,
                        { AND: [{ target: 'students' }, { session: user.session }] },
                        { AND: [{ target: 'students' }, { session: null }] },
                        { AND: [{ target: 'students' }, { department: user.dept }] },
                        globalStudentNotice,
                        { AND: [{ target: 'students' }, { section: user.section }] },
                        { AND: [{ target: 'students' }, { section: null }] }
                    ],
                },
                orderBy: { createdAt: 'desc' },
                include: { createdByUser: true },
            });
        } else {
            notices = [];
        }

        res.json(notices);
    } catch (err) {
        console.error('Error fetching notices by category:', err);
        res.status(500).json({ message: 'Server error fetching notices by category' });
    }
};

// Get All Notices Posted by Specific User
export const getNoticesByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const userExists = await prisma.user.findUnique({ where: { id: userId } });
        if (!userExists) return res.status(404).json({ message: 'User not found' });

        const notices = await prisma.notice.findMany({
            where: { createdBy: userId },
            orderBy: { createdAt: 'desc' },
            include: { createdByUser: true },
        });

        res.json(notices);
    } catch (err) {
        console.error('Error fetching user notices:', err);
        res.status(500).json({ message: 'Server error fetching notices' });
    }
};

// Get all notices created by teachers (Admin only)
export const getAllTeacherNotices = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user) return res.status(401).json({ message: 'Unauthorized: User not found' });

        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Only admins can access teacher notices' });
        }

        const teachers = await prisma.user.findMany({
            where: { role: 'teacher' },
            select: { id: true },
        });
        const teacherIds = teachers.map(t => t.id);

        const teacherNotices = await prisma.notice.findMany({
            where: {
                createdBy: { in: teacherIds }
            },
            orderBy: { createdAt: 'desc' },
            include: { createdByUser: true }
        });

        res.json(teacherNotices);
    } catch (err) {
        console.error('Error fetching teacher notices:', err);
        res.status(500).json({ message: 'Server error fetching teacher notices' });
    }
};

// Get a single notice by ID
export const getNoticeById = async (req, res) => {
    try {
        const { id } = req.params;

        const notice = await prisma.notice.findUnique({
            where: { id },
            include: { createdByUser: true },
        });

        if (!notice) return res.status(404).json({ message: 'Notice not found' });

        res.json(notice);
    } catch (err) {
        console.error('Error fetching notice by ID:', err);
        res.status(500).json({ message: 'Server error fetching notice' });
    }
};

// Update Notice
export const updateNotice = async (req, res) => {
    try {
        const { id } = req.params;
        const { text, category, target, session, department, section, removeImage } = req.body;

        const notice = await prisma.notice.findUnique({ where: { id } });
        if (!notice) return res.status(404).json({ message: 'Notice not found' });

        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (user.role !== 'admin' && notice.createdBy !== user.id) {
            return res.status(403).json({ message: 'Forbidden: You cannot update this notice' });
        }

        let imageUrl = null;
        if (req.file) {
            const folderName = `NoticeSphere/Notices/${slugify(text.substring(0, 20), { lower: true, strict: true })}`;
            const result = await cloudinary.uploader.upload(req.file.path, { folder: folderName });
            imageUrl = result.secure_url;
            fs.unlinkSync(req.file.path);
        }

        const updatedNotice = await prisma.notice.update({
            where: { id },
            data: {
                text,
                category,
                target,
                session: target === 'students' ? session : null,
                department: department || null,
                section: target === 'students' ? section : null,
                ...(imageUrl && { image: imageUrl }),
                ...(removeImage === 'true' && { image: null }),
            },
        });

        res.json({ message: 'Notice updated successfully', notice: updatedNotice });
    } catch (err) {
        console.error('Error updating notice:', err);
        res.status(500).json({ message: 'Server error updating notice' });
    }
};

// Delete Notice
export const deleteNotice = async (req, res) => {
    try {
        const { id } = req.params;

        const notice = await prisma.notice.findUnique({ where: { id } });
        if (!notice) return res.status(404).json({ message: 'Notice not found' });

        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (user.role !== 'admin' && notice.createdBy !== user.id) {
            return res.status(403).json({ message: 'Forbidden: You cannot delete this notice' });
        }

        if (notice.image) {
            const publicId = notice.image.split('/').slice(-1)[0].split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }

        await prisma.noticeLike.deleteMany({ where: { noticeId: id } });

        await prisma.noticeShare.deleteMany({ where: { noticeId: id } });

        const comments = await prisma.noticeComment.findMany({ where: { noticeId: id } });
        for (const comment of comments) {
            await prisma.noticeCommentReply.deleteMany({ where: { commentId: comment.id } });
        }
        await prisma.noticeComment.deleteMany({ where: { noticeId: id } });
        await prisma.notification.deleteMany({ where: { noticeId: id } });
        await prisma.notice.delete({ where: { id } });

        res.json({ message: 'Notice deleted successfully' });
    } catch (err) {
        console.error('Error deleting notice:', err);
        res.status(500).json({ message: 'Server error deleting notice' });
    }
};

// Get Total Number of Notices
export const getTotalNotices = async (req, res) => {
    try {
        const totalNotices = await prisma.notice.count();
        res.status(200).json({ totalNotices });
    } catch (err) {
        console.error('Error fetching total notices:', err);
        res.status(500).json({ message: 'Server error fetching total notices' });
    }
};
