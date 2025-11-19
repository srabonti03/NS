import express from 'express';
import { getTotalTeachers } from '../Controllers/teacherControllers.js';

const router = express.Router();

router.get('/total', getTotalTeachers);

export default router;
