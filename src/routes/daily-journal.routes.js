import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { submitDailyJournal } from '../controllers/daily-journal.controller.js';

const router = express.Router();

router.post('/', verifyToken, submitDailyJournal);

export default router;