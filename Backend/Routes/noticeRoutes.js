import express from 'express';
import {
    getNoticeOptions,
    createNotice,
    getAllNotices,
    getAllNoticesByCategory,
    updateNotice,
    deleteNotice,
    getNoticesByUser,
    getNoticeById,
    getAllTeacherNotices,
    getTotalNotices,
} from '../Controllers/noticeControllers.js';
import { verifyTokenMiddleware } from '../Middlewares/authMiddleware.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/options', verifyTokenMiddleware, getNoticeOptions);
router.post('/create', verifyTokenMiddleware, upload.single('image'), createNotice);
router.get('/all', verifyTokenMiddleware, getAllNotices);
router.get('/all-by-category', verifyTokenMiddleware, getAllNoticesByCategory);
router.put('/update/:id', verifyTokenMiddleware, upload.single('image'), updateNotice);
router.delete('/delete/:id', verifyTokenMiddleware, deleteNotice);
router.get('/user/:userId', verifyTokenMiddleware, getNoticesByUser);
router.get('/teachers-notice', verifyTokenMiddleware, getAllTeacherNotices);
router.get('/total', getTotalNotices);
router.get('/:id', verifyTokenMiddleware, getNoticeById);

export default router;
