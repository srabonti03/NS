import express from 'express';
import {
  getAllTeachers,
  getTeacherById,
  approveTeacher,
  toggleTeacherStatus,
  rejectTeacher,
  getAllStudents,
  getStudentById,
  toggleStudentStatus,
  getInsights,
  getAllAdmins,
} from '../Controllers/adminControllers.js';
import { verifyTokenMiddleware, isAdmin } from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.get('/teachers/all', verifyTokenMiddleware, isAdmin, getAllTeachers);
router.get('/teachers/:id', verifyTokenMiddleware, isAdmin, getTeacherById);
router.patch('/teachers/:id/approve', verifyTokenMiddleware, isAdmin, approveTeacher);
router.patch('/teachers/:id/status', verifyTokenMiddleware, isAdmin, toggleTeacherStatus);
router.delete('/teachers/:id/reject', verifyTokenMiddleware, isAdmin, rejectTeacher);
router.get('/students/all', verifyTokenMiddleware, isAdmin, getAllStudents);
router.get('/students/:id', verifyTokenMiddleware, isAdmin, getStudentById);
router.patch('/students/:id/status', verifyTokenMiddleware, isAdmin, toggleStudentStatus);
router.get('/insights', verifyTokenMiddleware, isAdmin, getInsights);
router.get('/admins/all', getAllAdmins);

export default router;
