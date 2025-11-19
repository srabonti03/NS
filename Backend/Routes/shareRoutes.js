import express from 'express';
import { getShareCount, addShare } from '../Controllers/shareControllers.js';
import { verifyTokenMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/shares/:noticeId', verifyTokenMiddleware, getShareCount);
router.post('/shares/:noticeId', verifyTokenMiddleware, addShare);
export default router;
