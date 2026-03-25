import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { submitDailyJournal, getJournalsByMonth, getJournalById } from '../controllers/daily-journal.controller.js';

const router = express.Router();

router.get('/', verifyToken, getJournalsByMonth);
router.post('/', verifyToken, submitDailyJournal);
router.get('/:id', verifyToken, getJournalById);

export default router;