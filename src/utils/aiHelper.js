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

/*
import { GoogleGenAI } from '@google/genai';

// Inisialisasi SDK Gemini yang baru
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateInitialPersonaReal = async (payload) => {
  try {
    const prompt = `
      Kamu adalah psikolog klinis. Analisis data user ini dan berikan output HANYA dalam format JSON.
      Data User: ${JSON.stringify(payload)}
      
      Struktur JSON yang WAJIB kamu kembalikan persis seperti ini:
      {
        "ai_summary": "string (1-2 paragraf)",
        "ai_insights": {
          "risk_level": "low" | "moderate" | "high",
          "risk_score": number,
          "dominant_stressor": ["string"],
          "personality_summary": "string",
          "recommendations": [
            { "focus": "string", "description": "string" }
          ],
          "progress_status": null,
          "weekly_insight": null,
          "ai_low_confidence": boolean
        }
      }
    `;

    // Kita panggil model gemini-2.5-flash (model standar terbaru untuk teks)
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        // Memaksa Gemini merespon dengan format JSON Murni
        responseMimeType: "application/json", 
      }
    });

    // Parse hasil JSON dari Gemini ke dalam Object JavaScript
    const aiResult = JSON.parse(response.text());
    return aiResult;

  } catch (error) {
    console.error("Error memanggil Gemini API:", error);
    throw new Error("Gagal mendapatkan analisis AI");
  }
};
*/