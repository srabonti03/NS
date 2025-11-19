import express from 'express';
import { getTotalStudents } from '../Controllers/studentControllers.js';

const router = express.Router();

router.get('/total', getTotalStudents);

export default router;
