import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { setupProfileAndQuiz } from '../controllers/profile-and-inpe.controller.js';

const router = express.Router();

router.post('/', verifyToken, setupProfileAndQuiz);

export default router;