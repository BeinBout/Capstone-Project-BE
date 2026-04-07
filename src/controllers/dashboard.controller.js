import prisma from '../config/db.js';

export const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const latestPersonaData = await prisma.userPersona.findFirst({
            where: { user_id: userId },
            orderBy: { created_at: 'desc' },
        });

        const latestJournalData = await prisma.journalLog.findFirst({
            where: { user_id: userId },
            orderBy: { created_at: 'desc' },
        });

        const responseData = {
            risk_level: latestPersonaData.risk_level,
            risk_score: latestPersonaData.risk_score,
            dominant_stressor: latestPersonaData.dominant_stressor,
            progress_status: latestPersonaData.progress_status,
            sleep_quality: latestJournalData.sleep_quality,
            mood: latestJournalData.mood
        };

        res.status(200).json({
            status: 'success',
            data: responseData
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

export const getDashboardMainData = async (req, res) => {
    try {
        const userId = req.user.id;

        const personaData = await prisma.userPersona.findFirst({
            where: { user_id: userId },
            orderBy: { created_at: 'desc' },
            select: {
                recommendations: true,
                weekly_insight: true,
            }
        });

        res.status(200).json({
            status: 'success',
            data: personaData
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

export const getDashboardChart = async (req, res) => {
    try {
        const userId = req.user.id;

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const logs = await prisma.journalLog.findMany({
            where: {
                user_id: userId,
                entry_date: {
                    gte: sevenDaysAgo,
                }
            },
            orderBy: {
                entry_date: 'asc'
            },
            select: {
                entry_date: true,
                mood_intensity: true,
                sleep_duration_hours: true
            }
        });

        const chartData = logs.map(log => ({
            date: log.entry_date.toISOString().split('T')[0],
            mood_intensity: log.mood_intensity,
            sleep_duration_hours: log.sleep_duration_hours ? parseFloat(log.sleep_duration_hours) : 0
        }));

        res.status(200).json({
            status: 'success',
            data: chartData
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

export const isWeeklyCheckupAvailable = async (req, res) => {
    try {
        const userId = req.user.id;

        const lastQuiz = await prisma.quiz.findFirst({
            where: {
                user_id: userId,
                type: { in: ['initial_persona', 'weekly_checkup'] },
            },
            orderBy: { created_at: 'desc' }
        });

        const now = new Date();
        const lastQuizDate = new Date(lastQuiz.completed_at);
        const diffDays = Math.ceil(Math.abs(now - lastQuizDate) / (1000 * 60 * 60 * 24));

        const isAvailable = diffDays >= 7 ? true : false;

        res.status(200).json({
            status: 'success',
            data: { is_available: isAvailable }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
            error: error.message
        });
    }
};