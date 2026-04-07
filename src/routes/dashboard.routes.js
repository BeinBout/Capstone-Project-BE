import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { getDashboardStats, getDashboardMainData, getDashboardChart, isWeeklyCheckupAvailable } from '../controllers/dashboard.controller.js';

const router = express.Router();

router.get('/stats', verifyToken, getDashboardStats);
router.get('/main', verifyToken, getDashboardMainData);
router.get('/chart', verifyToken, getDashboardChart);
router.get('/is-wc-available', verifyToken, isWeeklyCheckupAvailable);

export default router;