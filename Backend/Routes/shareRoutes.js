import express from 'express';
import { getShareCount, addShare } from '../Controllers/shareControllers.js';
import { verifyTokenMiddleware } from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.get('/shares/:noticeId', verifyTokenMiddleware, getShareCount);
router.post('/shares/:noticeId', verifyTokenMiddleware, addShare);
export default router;
