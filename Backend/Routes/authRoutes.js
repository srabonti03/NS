import express from 'express';
import {
    registerUser,
    loginUser,
    verifyOtp,
    resetOtp,
    resendOtp,
    resetPasswordWithOtp,
    getCurrentUser,
    logoutUser
} from '../Controllers/authControllers.js';
import { verifyTokenMiddleware } from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOtp);
router.post('/reset-otp', resetOtp);
router.post('/resend-otp', resendOtp);
router.post('/reset-password', resetPasswordWithOtp);
router.get('/user-info', verifyTokenMiddleware, getCurrentUser);
router.post('/logout', verifyTokenMiddleware, logoutUser);

export default router;
