import prisma from '../config/db.js';
import { generateWeeklyCheckup } from '../utils/aiHelperDummy.js';

export const submitWeeklyCheckup = async (req, res) => {
    try {
        const userId = req.user.id;
        const { quiz_answers } = req.body;

        const lastQuiz = await prisma.quiz.findFirst({
            where: { user_id: userId, type: { in: ['initial_persona', 'weekly_checkup'] } },
            orderBy: { created_at: 'desc' }
        });

        if (!lastQuiz) {
            return res.status(400).json({
                status: 'error',
                message: 'No initial persona or weekly checkup found for this user'
            });
        }

        const now = new Date();
        const lastQuizDate = new Date(lastQuiz.completed_at);
        const diffDays = Math.ceil(Math.abs(now - lastQuizDate) / (1000 * 60 * 60 * 24));

        if (diffDays < 7) {
            return res.status(403).json({
                status: 'error',
                message: `Weekly checkup can only be submitted once a week. Please try again in ${7 - diffDays} days.`
            });
        }

        const currentPersonaData = await prisma.userPersona.findFirst({
            where: { user_id: userId },
            orderBy: { created_at: 'desc' }
        });

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);

        const recentLogs = await prisma.journalLog.findMany({
            where: {
                user_id: userId,
                entry_date: { gte: sevenDaysAgo }
            }
        });

        let totalMoodIntensity = 0;
        let totalSleepHours = 0;
        let negativeSentimentCount = 0;
        let anomalyCount = 0;
        const moodFrequency = {};

        recentLogs.forEach(log => {
            totalMoodIntensity += log.mood_intensity || 0;
            totalSleepHours += log.sleep_duration_hours ? parseFloat(log.sleep_duration_hours) : 0;

            if (log.mood) {
                moodFrequency[log.mood] = (moodFrequency[log.mood] || 0) + 1;
            }

            const sentimentScore = log.ai_sentiment_score ? parseFloat(log.ai_sentiment_score) : 0;
            if (sentimentScore < 0) negativeSentimentCount++;

            if (log.ai_anomaly_detected) anomalyCount++;
        });

        const logsCount = recentLogs.length;
        let dominant_mood = 'netral';
        if (logsCount > 0) {
            dominant_mood = Object.keys(moodFrequency).reduce((a, b) => moodFrequency[a] > moodFrequency[b] ? a : b);
        }

        const weekly_metrics = {
            avg_mood_intensity: logsCount > 0 ? parseFloat((totalMoodIntensity / logsCount).toFixed(1)) : 0,
            avg_sleep_hours: logsCount > 0 ? parseFloat((totalSleepHours / logsCount).toFixed(1)) : 0,
            dominant_mood: logsCount > 0 ? dominant_mood : 'netral',
            negative_sentiment_ratio: logsCount > 0 ? parseFloat((negativeSentimentCount / logsCount).toFixed(2)) : 0,
            journal_entries_count: logsCount,
            anomaly_count: anomalyCount
        };

        const optionIds = quiz_answers.map(ans => ans.selected_option_id);
        const optionsDetail = await prisma.quizOption.findMany({
            where: { id: { in: optionIds } },
            include: { question: true }
        });

        let total_score = 0;
        const categoryCount = {};
        const checkup_answers = [];

        optionsDetail.forEach(opt => {
            total_score += opt.score_value || 0;
            const cat = opt.question.category;
            categoryCount[cat] = (categoryCount[cat] || 0) + (opt.score_value || 0);

            checkup_answers.push({
                category: cat,
                question_text: opt.question.question_text,
                selected_option: opt.option_text,
                emotion_tag: opt.emotion_tag,
                score_value: opt.score_value
            });
        });

        const dominant_categories = Object.keys(categoryCount).sort((a, b) => categoryCount[b] - categoryCount[a]).slice(0, 3);

        const userContext = await prisma.user.findUnique({
            where: { id: userId },
            select: { nama_lengkap: true, umur: true, berat_badan: true, tinggi_badan: true }
        });

        const aiPayload = {
            user_context: userContext,
            current_persona: currentPersonaData ? {
                risk_level: currentPersonaData.risk_level,
                risk_score: currentPersonaData.risk_score,
                dominant_stressor: currentPersonaData.dominant_stressor,
                personality_summary: currentPersonaData.personality_summary,
            } : null,
            weekly_metrics: weekly_metrics,
            checkup_answers: checkup_answers,
            dominant_categories: dominant_categories
        };

        const aiResponse = await generateWeeklyCheckup(aiPayload);

        const result =await prisma.$transaction(async (tx) => {
            const newQuiz = await tx.quiz.create({
                data: {
                    user_id: userId,
                    type: 'weekly_checkup',
                    total_question: quiz_answers.length,
                    answered_question: quiz_answers.length,
                    total_score: total_score,
                    ai_summary: aiResponse.ai_summary,
                    ai_insights: aiResponse.ai_insights,
                    started_at: now,
                    completed_at: now
                }
            });

            const answersData = quiz_answers.map(ans => ({
                quiz_id: newQuiz.id,
                question_id: ans.question_id,
                selected_option_id: ans.selected_option_id,
                answered_at: now
            }));
            await tx.quizAnswer.createMany({ data: answersData });

            await tx.userPersona.create({
                user_id: userId,
                risk_level: aiResponse.ai_insights.risk_level,
                risk_score: aiResponse.ai_insights.risk_score,
                dominant_stressor: aiResponse.ai_insights.dominant_stressor,
                recomendations: aiResponse.ai_insights.recommendations, // Typo skema
                personality_summary: aiResponse.ai_insights.personality_summary || aiResponse.ai_insights.presonality_summary,
                progress_status: aiResponse.ai_insights.progress_status,
                weekly_insight: aiResponse.ai_insights.weekly_insight,
                source_type: 'weekly_checkup',
                source_id: newQuiz.id
            });

            return newQuiz;
        });

        res.status(200).json({
            status: 'success',
            message: 'Weekly-checkup is processed successfuly!',
            data: aiResponse,
            quiz: result
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
            error: error.message
        });
    }
};