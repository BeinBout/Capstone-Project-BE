import express from 'express';
import { getAllQuestions, createQuestion } from '../controllers/question.controller.js';

const router = express.Router();

router.get('/questions', getAllQuestions);
router.post('/questions', createQuestion);

export default router;