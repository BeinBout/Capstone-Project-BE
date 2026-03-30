import api from '../lib/api.js';

export const generateInitialPersona = async (payload) => await api.post('/api/initial_persona', payload);

export const generateWeeklyCheckup = async (payload) => await api.post('/api/weekly_checkup', payload);

export const analyzeDailyJournal = async (payload) => await api.post('/api/daily_journal', payload);