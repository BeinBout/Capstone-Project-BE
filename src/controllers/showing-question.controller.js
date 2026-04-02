import prisma from '../config/db.js';
import redisClient from '../config/redis.js';

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
            const cachedInitial = await redisClient.get('quiz:initial');

            if (cachedInitial) {
                return res.status(200).json({
                    status: 'success',
                    data: JSON.parse(cachedInitial)
                });
            }

            const questions = await prisma.quizQuestion.findMany({
                where: { quiz_type: 'initial' },
                include: {
                    options: {
                        orderBy: { score_value: 'asc' }
                    }
                }
            });

            await redisClient.setEx('quiz:initial', 86400, JSON.stringify(questions));

            return res.status(200).json({
                status: 'success',
                data: questions
            });
        }

        if (type === 'weekly') {
            let staticQuestions = [];
            let randomPool = [];

            const cachedWeeklyStatic = await redisClient.get('quiz:weekly_static');
            const cachedWeeklyRandom = await redisClient.get('quiz:weekly_random');

            if (cachedWeeklyStatic && cachedWeeklyRandom) {
                staticQuestions = JSON.parse(cachedWeeklyStatic);
                randomPool = JSON.parse(cachedWeeklyRandom);
            } else {
                staticQuestions = await prisma.quizQuestion.findMany({
                    where: { quiz_type: 'weekly_static' },
                    include: { options: { orderBy: { score_value: 'asc' } } }
                });
    
                randomPool = await prisma.quizQuestion.findMany({
                    where: { quiz_type: 'weekly_random' },
                    include: { options: { orderBy: { score_value: 'asc' } } }
                });

                await redisClient.setEx('quiz:weekly_static', 86400, JSON.stringify(staticQuestions));
                await redisClient.setEx('quiz:weekly_random', 86400, JSON.stringify(randomPool));
            }

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