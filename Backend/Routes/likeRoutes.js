import express from 'express';
import { likeNotice, unlikeNotice, getNoticeLikes, checkLike } from '../Controllers/likeControllers.js';
import { verifyTokenMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/like/:noticeId', verifyTokenMiddleware, likeNotice);
router.post('/unlike/:noticeId', verifyTokenMiddleware, unlikeNotice);
router.get('/count/:noticeId', getNoticeLikes);
router.get('/check/:noticeId', verifyTokenMiddleware, checkLike);

export default router;
