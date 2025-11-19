import express from 'express';
import { getUserNotifications, markNotificationAsRead } from '../Controllers/notificationControllers.js';
import { verifyTokenMiddleware } from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.get('/notifications', verifyTokenMiddleware, getUserNotifications);
router.patch('/notifications/:notificationId/read', verifyTokenMiddleware, markNotificationAsRead);

export default router;
