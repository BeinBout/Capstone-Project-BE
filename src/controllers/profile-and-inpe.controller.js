import prisma from '../config/db.js';
import { generateInitialPersona } from '../utils/aiHelper.js';

export const setupProfileAndQuiz = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            nama_lengkap,
            umur,
            berat_badan,
            tinggi_badan,
            quiz_answers
        } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { 
                nama_lengkap: true,
                berat_badan: true,
                tinggi_badan: true,
                umur: true
            }
        });

        const isProfileComplete = 
            existingUser.berat_badan !== null && 
            existingUser.tinggi_badan !== null && 
            existingUser.umur !== null;

        if (isProfileComplete) {
            return res.status(400).json({
                status: 'error',
                message: 'Profile has been filled in'
            });
        }

        const tinggiMeter = tinggi_badan / 100;
        const bmi_calc = parseFloat((berat_badan / (tinggiMeter * tinggiMeter)).toFixed(2));

        const optionIds = quiz_answers.map(ans => ans.selected_option_id);
        const optionsDetail = await prisma.quizOption.findMany({
            where: { id: { in: optionIds } },
            include: { question: true }
        });

        let total_score = 0;
        const categoryCount = {};
        const formattedAnswersForAI = [];

        optionsDetail.forEach(opt => {
            total_score += opt.score_value || 0;

            const cat = opt.question.category;
            categoryCount[cat] = (categoryCount[cat] || 0) + (opt.score_value || 0);

            formattedAnswersForAI.push({
                category: cat,
                question_text: opt.question.question_text,
                selected_option: opt.option_text,
                emotion_tag: opt.emotion_tag,
                score_value: opt.score_value
            });
        });

        const dominant_categories = Object.keys(categoryCount)
            .sort((a, b) => categoryCount[b] - categoryCount[a])
            .slice(0, 3);

        const aiPayload = {
            user_context: {
                nama_lengkap,
                umur,
                berat_badan,
                tinggi_badan,
                bmi_calc
            },
            answers: formattedAnswersForAI,
            total_score,
            dominant_categories
        };

        const aiResponse = await generateInitialPersona(aiPayload);
        const result = await  prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: userId },
                data: {
                    nama_lengkap, umur, berat_badan, tinggi_badan
                }
            });

            const newQuiz = await tx.quiz.create({
                data: {
                    user_id: userId,
                    type: 'initial_persona',
                    total_question: quiz_answers.length,
                    answered_question: quiz_answers.length,
                    total_score: total_score,
                    ai_summary: aiResponse.ai_summary,
                    ai_insights: aiResponse.ai_insights,
                    started_at: new Date(),
                    completed_at: new Date()
                }
            });

            const answersData = quiz_answers.map(ans => ({
                quiz_id: newQuiz.id,
                question_id: ans.question_id,
                selected_option_id: ans.selected_option_id,
                answered_at: new Date()
            }));
            await tx.quizAnswer.createMany({ data: answersData });

            await tx.userPersona.create({
                data: {
                    user_id: userId,
                    risk_level: aiResponse.ai_insights.risk_level,
                    risk_score: aiResponse.ai_insights.risk_score,
                    dominant_stressor: aiResponse.ai_insights.dominant_stressor,
                    recommendations: aiResponse.ai_insights.recommendations,
                    personality_summary: aiResponse.ai_insights.personality_summary,
                    progress_status: 'new',
                    source_type: 'initial_persona',
                    source_id: newQuiz.id
                }
            });

            return newQuiz;
        });

        res.status(200).json({
            status: 'success',
            message: 'Profile and quiz successfully saved, AI has responded',
            data: aiResponse,
            quiz: result
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to process profile & AI data',
            error: error.message
        });
    }
};