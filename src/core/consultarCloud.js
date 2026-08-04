import { GoogleGenAI } from '@google/genai';

// Usar la variable de entorno de forma segura
const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_KEY_1;

const ai = new GoogleGenAI({ apiKey });

export async function consultarCloud(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error('Error al consultar la nube:', error);
    return null;
  }
}

export default consultarCloud;
