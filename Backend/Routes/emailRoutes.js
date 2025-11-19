import express from 'express';
import {
    sendEmail
} from '../Controllers/emailControllers.js';
import { verifyTokenMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/send-email', verifyTokenMiddleware, sendEmail);

export default router;
