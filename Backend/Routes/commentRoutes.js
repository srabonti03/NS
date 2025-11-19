import express from 'express';
import {
    createComment,
    createReply,
    deleteComment,
    deleteReply,
    getCommentsByNotice
} from '../Controllers/commentControllers.js';
import { verifyTokenMiddleware } from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.post('/comment', verifyTokenMiddleware, createComment);
router.post('/reply', verifyTokenMiddleware, createReply);
router.delete('/comment/:id', verifyTokenMiddleware, deleteComment);
router.delete('/reply/:id', verifyTokenMiddleware, deleteReply);
router.get('/comments/:noticeId', verifyTokenMiddleware, getCommentsByNotice);

export default router;
