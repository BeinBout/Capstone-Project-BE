import express from 'express';
import { getQuizQuestions } from '../controllers/showing-question.controller.js';

const router = express.Router();

router.get('/', getQuizQuestions);

export default router;