import express from 'express';
import {
    sendEmail
} from '../Controllers/emailControllers.js';
import { verifyTokenMiddleware } from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.post('/send-email', verifyTokenMiddleware, sendEmail);

export default router;
