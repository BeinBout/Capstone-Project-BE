import prisma from '../../config/db.js';
import redisClient from '../../config/redis.js';

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

export const createQuestion = async (req, res) => {
    try {
        const { question_text, category, emotion_tag, quiz_type } = req.body;

        if (!question_text || !category || !quiz_type) {
            return res.status(400).json({
                status: 'error',
                message: 'Question text, category, or quiz type are required.'
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
                quiz_type,
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

        await redisClient.del('quiz:initial');
        await redisClient.del('quiz:weekly_static');
        await redisClient.del('quiz:weekly_random');

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

export const getQuestionById = async (req, res) => {
    try {
        const questionId = parseInt(req.params.id, 10);

        const question = await prisma.quizQuestion.findUnique({
            where: {
                id: questionId
            },
            include: {
                options: true
            }
        });

        if (!question) {
            return res.status(400).json({
                status: 'error',
                message: 'Question id is required'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Question fetched successfully',
            data: question
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

export const updateQuestion = async (req, res) => {
    try {
        const questionId = parseInt(req.params.id, 10);
        const { question_text, category, emotion_tag, quiz_type } = req.body;

        if (!questionId) {
            return res.status(400).json({
                status: 'error',
                message: 'Question id is required'
            });
        }

        if (!question_text || !category || !quiz_type) {
            return res.status(400).json({
                status: 'error',
                message: 'Question text, category, or quiz type are required.'
            });
        }

        await prisma.quizQuestion.update({
            where: {
                id: questionId
            },
            data: {
                question_text,
                category,
                quiz_type,
            }
        });

        await prisma.quizOption.updateMany({
            where: {
                question_id: questionId
            },
            data: {
                emotion_tag: emotion_tag || null
            }
        });

        const finalQuestion = await prisma.quizQuestion.findUnique({
            where: {
                id: questionId
            },
            include: {
                options: true
            }
        });

        await redisClient.del('quiz:initial');
        await redisClient.del('quiz:weekly_static');
        await redisClient.del('quiz:weekly_random');

        res.status(200).json({
            status: 'success',
            message: 'Question updated successfully',
            data: finalQuestion
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

export const deleteQuestion = async (req, res) => {
    try {
        const questionId = parseInt(req.params.id, 10);

        if (!questionId) {
            return res.status(400).json({
                status: 'error',
                message: 'Question id is required'
            });
        }

        await prisma.quizOption.deleteMany({
            where: {
                question_id: questionId
            }
        });

        await prisma.quizAnswer.deleteMany({
            where: {
                question_id: questionId
            }
        });

        const deletedQuestion = await prisma.quizQuestion.delete({
            where: {
                id: questionId
            },
        });

        await redisClient.del('quiz:initial');
        await redisClient.del('quiz:weekly_static');
        await redisClient.del('quiz:weekly_random');

        res.status(200).json({
            status: 'success',
            message: 'Question deleted successfully',
            data: deletedQuestion
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
            error: error.message
        });
    }
};