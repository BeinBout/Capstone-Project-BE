import prisma from '../config/db.js';

export const getQuizQuestions = async (req, res) => {
    try {
        const { type } = req.query;

        if (!type) {
            return res.status(400).json({
                status: 'error',
                message: 'Type is required (example: ?type=initial or ?type=random)'
            });
        }

        if (type === 'initial') {
            const questions = await prisma.quizQuestion.findMany({
                where: { quiz_type: 'initial' },
                include: {
                    options: {
                        orderBy: { score_value: 'asc' }
                    }
                }
            });

            return res.status(200).json({
                status: 'success',
                data: questions
            });
        }

        if (type === 'weekly') {
            const staticQuestions = await prisma.quizQuestion.findMany({
                where: { quiz_type: 'weekly_static' },
                include: { options: { orderBy: { score_value: 'asc' } } }
            });

            const randomPool = await prisma.quizQuestion.findMany({
                where: { quiz_type: 'weekly_random' },
                include: { options: { orderBy: { score_value: 'asc' } } }
            });

            const suffledRandom = randomPool
                .sort(() => 0.5 - Math.random())
                .slice(0, 4);

            const weeklyQuestions = [...staticQuestions, ...suffledRandom];

            return res.status(200).json({
                status: 'success',
                data: weeklyQuestions
            });
        }

        return res.status(400).json({
            status: 'error',
            message: 'The type of the quiz is not valid. Use "initial" or "weekly".'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
            error: error.message
        });
    }
};