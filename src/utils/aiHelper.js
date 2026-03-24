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