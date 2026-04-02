import prisma from '../config/db.js';
import redisClient from '../config/redis.js';
import { analyzeDailyJournal } from '../utils/aiHelper.js';

const calculateSleepDuration = (sleepTime, wakeTime) => {
    if (!sleepTime || !wakeTime) return 0;

    const [sleepH, sleepM] = sleepTime.split(':').map(Number);
    const [wakeH, wakeM] = wakeTime.split(':').map(Number);

    let sleepInMinutes = (sleepH * 60) + sleepM;
    let wakeInMinutes = (wakeH * 60) + wakeM;

    if (wakeInMinutes < sleepInMinutes) {
        wakeInMinutes += (24 * 60);
    }

    const durationHours = (wakeInMinutes - sleepInMinutes) / 60;

    return parseFloat(durationHours.toFixed(1));
};

export const submitDailyJournal = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            journal_date,
            mood,
            mood_intensity,
            sleep_time,
            wake_time,
            sleep_quality,
            content,
            is_private
        } = req.body;

        const inputDate = new Date(journal_date);
        const today = new Date();

        inputDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        if (inputDate > today) {
            return res.status(400).json({
                status: 'error',
                message: 'Cannot submit journal for future date'
            });
        }

        const existingJournal = await prisma.journalLog.findFirst({
            where: {
                user_id: userId,
                entry_date: inputDate
            }
        });

        if (existingJournal) {
            return res.status(400).json({
                status: 'error',
                message: 'Journal already exists for this date'
            });
        }

        const formattedSleepTime = sleep_time ? new Date(`1970-01-01T${sleep_time}:00.000Z`) : null;
        const formattedWakeTime = wake_time ? new Date(`1970-01-01T${wake_time}:00.000Z`) : null;
        const sleep_duration_hours = calculateSleepDuration(sleep_time, wake_time);

        if (is_private === true) {
            const newJournal = await prisma.journalLog.create({
                data: {
                    user_id: userId,
                    entry_date: inputDate,
                    mood,
                    mood_intensity,
                    sleep_time: formattedSleepTime,
                    wake_time: formattedWakeTime,
                    sleep_duration_hours,
                    sleep_quality,
                    content,
                    is_private: true
                }
            });

            await redisClient.del(`journals:${userId}:${inputDate.getMonth()+1}:${inputDate.getFullYear()}`);

            return res.status(201).json({
                status: 'success',
                message: 'Journal successfully saved privately',
                data: {
                    journal_id: newJournal.id,
                    journal_date: journal_date,
                    is_private: true,
                    ai_report: null
                }
            });
        }

        const userContext = await prisma.user.findUnique({
            where: { id: userId },
            select: { umur: true, berat_badan: true, tinggi_badan: true }
        });

        const currentPersona = await prisma.userPersona.findFirst({
            where: { user_id: userId },
            orderBy: { created_at: 'desc' },
            select: { risk_level: true, risk_score: true, dominant_stressor: true }
        });

        const threeDaysAgo = new Date(inputDate);
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        const pastLogs = await prisma.journalLog.findMany({
            where: {
                user_id: userId,
                entry_date: { gte: threeDaysAgo, lt: inputDate }
            },
            orderBy: { entry_date: 'desc' }
        });

        let totalMood = 0;
        let totalSleep = 0;
        let consecutive_negative_days = 0;

        pastLogs.forEach(log => {
            totalMood += log.mood_intensity || 0;
            totalSleep += log.sleep_duration_hours ? parseFloat(log.sleep_duration_hours) : 0;

            if (log.ai_sentiment_score && parseFloat(log.ai_sentiment_score) < 0) {
                consecutive_negative_days++;
            }
        });

        const logsCount = pastLogs.length;
        const recent_trend = {
            last_3_days_avg_mood: logsCount > 0 ? parseFloat((totalMood / logsCount).toFixed(1)) : 0,
            last_3_days_avg_sleep: logsCount > 0 ? parseFloat((totalSleep / logsCount).toFixed(1)) : 0,
            consecutive_negative_days
        };

        const aiPayload = {
            user_context: userContext,
            current_persona: currentPersona || null,
            recent_trend: recent_trend,
            journal: { mood, mood_intensity, sleep_duration_hours, sleep_quality, content }
        };

        const aiResponse = await analyzeDailyJournal(aiPayload);

        const newJournal = await prisma.journalLog.create({
            data: {
                user_id: userId,
                entry_date: inputDate,
                mood,
                mood_intensity,
                sleep_time: formattedSleepTime,
                wake_time: formattedWakeTime,
                sleep_duration_hours,
                sleep_quality,
                content,
                is_private: false,
                ai_reflection: aiResponse.ai_reflection,
                ai_tags: aiResponse.ai_tags,
                ai_sentiment_score: aiResponse.ai_sentiment_score,
                ai_anomaly_detected: aiResponse.ai_anomaly_detected,
                ai_anomaly_type: aiResponse.ai_anomaly_type,
                ai_low_confidence: false
            }
        });

        await redisClient.del(`journals:${userId}:${inputDate.getMonth()+1}:${inputDate.getFullYear()}`);

        return res.status(201).json({
            status: 'success',
            message: 'Journal successfully saved',
            data: {
                journal_id: newJournal.id,
                journal_date: journal_date,
                is_private: false,
                ai_report: aiResponse
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

export const getJournalsByMonth = async (req, res) => {
    try {
        const cachedJournal = await redisClient.get(`journals:${req.user.id}:${req.query.month}:${req.query.year}`);

        if (cachedJournal) {
            res.status(200).json({
                status: 'success',
                data: JSON.parse(cachedJournal)
            });
        } else {
            const userId = req.user.id;
            const today = new Date();
            const queryMonth = req.query.month ? parseInt(req.query.month, 10) : today.getMonth() + 1;
            const queryYear = req.query.year ? parseInt(req.query.year, 10) : today.getFullYear();
            const startDate = new Date(queryYear, queryMonth - 1, 1);
            const endDate = new Date(queryYear, queryMonth, 1);
    
            const journals = await prisma.journalLog.findMany({
                where: {
                    user_id: userId,
                    entry_date: {
                        gte: startDate,
                        lt: endDate
                    }
                },
                select: {
                    id: true,
                    entry_date: true,
                    mood: true,
                    is_private: true
                },
                orderBy: {
                    entry_date: 'asc'
                }
            });

            await redisClient.setEx(`journals:${userId}:${queryMonth}:${queryYear}`, 86400, JSON.stringify(journals));

            res.status(200).json({
                status: 'success',
                data: journals
            });
        }

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

const formatTimeBackToString = (dateObj) => {
    if (!dateObj) return null;

    const h = dateObj.getUTCHours().toString().padStart(2, '0');
    const m = dateObj.getUTCMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
};

export const getJournalById = async (req, res) => {
    try {
        const userId = req.user.id;
        const journalId = parseInt(req.params.id, 10);

        const journal = await prisma.journalLog.findUnique({
            where: {
                id: journalId,
                user_id: userId
            }
        });

        if (!journal) {
            return res.status(404).json({
                status: 'error',
                message: 'Journal not found'
            });
        }

        const formattedJournal = {
            ...journal,
            sleep_time: formatTimeBackToString(journal.sleep_time),
            wake_time: formatTimeBackToString(journal.wake_time),
        };

        res.status(200).json({
            status: 'success',
            data: formattedJournal
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
            error: error.message
        });
    }
};