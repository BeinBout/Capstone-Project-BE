import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { submitWeeklyCheckup } from '../controllers/weekly-checkup.controller.js';

const router = express.Router();

router.post('/', verifyToken, submitWeeklyCheckup);

export default router;