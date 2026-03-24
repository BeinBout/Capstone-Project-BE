import prisma from '../config/db.js';

export const createQuestion = async (req, res) => {
    try {
        const { question_text, category, emotion_tag } = req.body;

        if (!question_text || !category) {
            return res.status(400).json({
                status: 'error',
                message: 'Question text, and category are required.'
            });
        }

        const staticOptions = [
            { option_text: 'Tidak Pernah', score_value: 1 },
            { option_text: 'Jarang', score_value: 2 },
            { option_text: 'Kadang-kadang', score_value: 3 },
            { option_text: 'Sering', score_value: 4 },
            { option_text: 'Hampir Selalu', score_value: 5 },
        ];

        const newQuestion = await prisma.quizQuestion.create({
            data: {
                question_text,
                category,
                options: {
                    create: staticOptions.map(opt => ({
                        option_text: opt.option_text,
                        score_value: opt.score_value,
                        emotion_tag: emotion_tag || null
                    }))
                }
            },
            include: {
                options: true
            }
        });

        res.status(201).json({
            status: 'success',
            message: 'Question created successfully',
            data: newQuestion
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

export const getAllQuestions = async (req, res) => {
    try {
        const questions = await prisma.quizQuestion.findMany({
            include: {
                options: true
            }
        });

        res.status(200).json({
            status: 'success',
            messgae: 'All questions fetched successfully',
            data: questions
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
            error: error.message
        });
    }
};