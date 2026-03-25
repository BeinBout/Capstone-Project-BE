export const generateInitialPersona = async (payload) => {
    console.log('Menjalankan AI Dummy dengan payload: ', payload.user_context.nama_lengkap);

    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
        ai_summary: 'Kamu cenderung memendam tekanan akademik yang cukup berat akhir-akhir ini. Kurangnya waktu istirahat membuat tubuh dan pikiranmu terus berada dalam mode waspada, yang pada akhirnya memicu kelelahan emosional.',
        ai_insights: {
            risk_level: 'moderate',
            risk_score: payload.total_score, 
            dominant_stressor: payload.dominant_categories,
            personality_summary: 'Kamu adalah tipe yang perfeksionis dan sangat bertanggung jawab, namun hal ini terkadang membuatmu mengabaikan sinyal kelelahan dari tubuhmu sendiri.',
            recommendations: [
                {
                focus: 'Kualitas Tidur',
                description: 'Coba tetapkan jam tidur yang sama selama 3 hari ke depan, matikan layar gadget 30 menit sebelum tidur.'
                },
                {
                focus: 'Manajemen Ekspektasi',
                description: 'Pecah tugas akademikmu menjadi bagian-bagian kecil agar tidak terasa terlalu mengintimidasi.'
                }
            ],
            progress_status: null,
            weekly_insight: null,
            ai_low_confidence: false
        }
    };
};

export const generateWeeklyCheckup = async (payload) => {
    console.log('Menjalankan AI Dummy dengan payload: ', payload.user_context.nama_lengkap);

    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
        ai_summary: 'Kamu cenderung memendam tekanan akademik yang cukup berat akhir-akhir ini. Kurangnya waktu istirahat membuat tubuh dan pikiranmu terus berada dalam mode waspada, yang pada akhirnya memicu kelelahan emosional.',
        ai_insights: {
            risk_level: 'moderate',
            risk_score: payload.total_score, 
            dominant_stressor: payload.dominant_categories,
            personality_summary: 'Kamu adalah tipe yang perfeksionis dan sangat bertanggung jawab, namun hal ini terkadang membuatmu mengabaikan sinyal kelelahan dari tubuhmu sendiri.',
            recommendations: [
                {
                focus: 'Kualitas Tidur',
                description: 'Coba tetapkan jam tidur yang sama selama 3 hari ke depan, matikan layar gadget 30 menit sebelum tidur.'
                },
                {
                focus: 'Manajemen Ekspektasi',
                description: 'Pecah tugas akademikmu menjadi bagian-bagian kecil agar tidak terasa terlalu mengintimidasi.'
                }
            ],
            progress_status: 'significant_deterioration',
            weekly_insight: 'Dibanding minggu lalu, risk score kamu naik dari 58 ke 71...',
            ai_low_confidence: false
        }
    };
};

export const analyzeDailyJournal = async (payload) => {
  console.log('Menjalankan AI Dummy untuk jurnal harian...', payload.journal.mood);

  await new Promise(resolve => setTimeout(resolve, 2000));

  return {
    ai_reflection: 'Kamu sedang menghadapi tekanan yang cukup berat hari ini. Menarik napas panjang sejenak mungkin bisa membantu. Aku perhatikan tidurmu juga kurang, usahakan istirahat lebih awal malam ini ya.',
    ai_tags: ['academic_pressure', 'sleep_deficit', 'frustration'],
    ai_sentiment_score: -0.72,
    ai_anomaly_detected: true,
    ai_anomaly_type: 'sleep_deficit'
  };
};