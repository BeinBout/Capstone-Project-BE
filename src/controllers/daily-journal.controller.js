import prisma from '../config/db.js';
import redisClient from '../config/redis.js';
import { analyzeDailyJournal } from '../utils/aiHelper.js';
import dayjs from '../utils/dayjs.js';

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

        const inputDate = dayjs.tz(journal_date, 'YYYY-MM-DD', 'Asia/Jakarta').startOf('day');
        const today = dayjs().tz('Asia/Jakarta').startOf('day');
        const inputDateForDb = dayjs.utc(inputDate.format('YYYY-MM-DD'), 'YYYY-MM-DD', true);

        if (!inputDate.isValid()) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid journal_date format. Use YYYY-MM-DD'
            });
        }

        if (inputDate.isAfter(today)) {
            return res.status(400).json({
                status: 'error',
                message: 'Cannot submit journal for future date'
            });
        }

        const existingJournal = await prisma.journalLog.findFirst({
            where: {
                user_id: userId,
                entry_date: inputDateForDb.toDate()
            }
        });

        if (existingJournal) {
            return res.status(400).json({
                status: 'error',
                message: 'Journal already exists for this date'
            });
        }

        const formattedSleepTime = sleep_time
            ? dayjs.tz(`1970-01-01 ${sleep_time}`, 'YYYY-MM-DD HH:mm', 'Asia/Jakarta')
            : null;
        const formattedWakeTime = wake_time
            ? dayjs.tz(`1970-01-01 ${wake_time}`, 'YYYY-MM-DD HH:mm', 'Asia/Jakarta')
            : null;

        if ((formattedSleepTime && !formattedSleepTime.isValid()) || (formattedWakeTime && !formattedWakeTime.isValid())) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid sleep_time or wake_time format. Use HH:mm'
            });
        }

        const sleep_duration_hours = calculateSleepDuration(sleep_time, wake_time);

        if (is_private === true) {
            const newJournal = await prisma.journalLog.create({
                data: {
                    user_id: userId,
                    entry_date: inputDateForDb.toDate(),
                    mood,
                    mood_intensity,
                    sleep_time: formattedSleepTime ? formattedSleepTime.toDate() : null,
                    wake_time: formattedWakeTime ? formattedWakeTime.toDate() : null,
                    sleep_duration_hours,
                    sleep_quality,
                    content,
                    is_private: true
                }
            });

            await redisClient.del(`journals:${userId}:${inputDate.month() + 1}:${inputDate.year()}`);

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

        const threeDaysAgo = inputDate.subtract(3, 'day');
        const threeDaysAgoForDb = dayjs.utc(threeDaysAgo.format('YYYY-MM-DD'), 'YYYY-MM-DD', true);

        const pastLogs = await prisma.journalLog.findMany({
            where: {
                user_id: userId,
                entry_date: { gte: threeDaysAgoForDb.toDate(), lt: inputDateForDb.toDate() }
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
                entry_date: inputDateForDb.toDate(),
                mood,
                mood_intensity,
                sleep_time: formattedSleepTime ? formattedSleepTime.toDate() : null,
                wake_time: formattedWakeTime ? formattedWakeTime.toDate() : null,
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

        await redisClient.del(`journals:${userId}:${inputDate.month() + 1}:${inputDate.year()}`);

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
        const today = dayjs().tz('Asia/Jakarta');
        const queryMonth = req.query.month ? parseInt(req.query.month, 10) : today.month() + 1;
        const queryYear = req.query.year ? parseInt(req.query.year, 10) : today.year();
        const cacheKey = `journals:${req.user.id}:${queryMonth}:${queryYear}`;

        const cachedJournal = await redisClient.get(cacheKey);

        if (cachedJournal) {
            res.status(200).json({
                status: 'success',
                data: JSON.parse(cachedJournal)
            });
        } else {
            const userId = req.user.id;
            const startDate = dayjs.tz(`${queryYear}-${String(queryMonth).padStart(2, '0')}-01`, 'YYYY-MM-DD', 'Asia/Jakarta');

            if (!startDate.isValid()) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid month or year query'
                });
            }

            const endDate = startDate.add(1, 'month');
            const startDateForDb = dayjs.utc(startDate.format('YYYY-MM-DD'), 'YYYY-MM-DD', true);
            const endDateForDb = dayjs.utc(endDate.format('YYYY-MM-DD'), 'YYYY-MM-DD', true);
    
            const journals = await prisma.journalLog.findMany({
                where: {
                    user_id: userId,
                    entry_date: {
                        gte: startDateForDb.toDate(),
                        lt: endDateForDb.toDate()
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

            await redisClient.setEx(cacheKey, 86400, JSON.stringify(journals));

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

    return dayjs(dateObj).tz('Asia/Jakarta').format('HH:mm');
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