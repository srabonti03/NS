import express from 'express';
import { updateProfile, changePassword } from '../Controllers/userControllers.js';
import { verifyTokenMiddleware } from '../Middlewares/authMiddleware.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.put('/update-profile', verifyTokenMiddleware, upload.single('avatar'), updateProfile);
router.put('/change-password', verifyTokenMiddleware, changePassword);

export default router;
