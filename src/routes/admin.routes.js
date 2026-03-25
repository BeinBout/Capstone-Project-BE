import express from 'express';
import { getAllQuestions, createQuestion, getQuestionById, updateQuestion, deleteQuestion } from '../controllers/admin/question.controller.js';

const router = express.Router();

router.get('/questions', getAllQuestions);
router.post('/questions', createQuestion);
router.get('/question/:id', getQuestionById);
router.put('/question/:id', updateQuestion);
router.delete('/question/:id', deleteQuestion);

export default router;