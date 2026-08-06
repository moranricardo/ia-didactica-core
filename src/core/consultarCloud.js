import { GoogleGenAI } from '@google/genai';

const API_KEYS = [
  process.env.GEMINI_KEY_1,
  process.env.GEMINI_KEY_2,
  process.env.GEMINI_KEY_3,
  process.env.GEMINI_KEY_4,
].filter(Boolean);

export async function consultarCloud(prompt) {
  if (API_KEYS.length === 0) {
    console.error('❌ Error: No se ha detectado ninguna API Key en las variables de entorno.');
    return null;
  }

  for (let i = 0; i < API_KEYS.length; i++) {
    const apiKey = API_KEYS[i];
    console.log(`📡 Consultando API Key #${i + 1} (${apiKey.slice(0, 6)}...)...`);
    
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
      });

      if (response && response.text) {
        console.log(`✅ Respuesta exitosa de Key #${i + 1}`);
        return response.text;
      }
    } catch (error) {
      const is429 = error.status === 429 || (error.message && error.message.includes('429'));
      console.error(`⚠️ Falló Key #${i + 1}: ${is429 ? 'Límite de cuota (429)' : error.message}`);

      if (is429) {
        // Pausa breve para dar un respiro a la cuota antes de probar la siguiente llave
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    }
  }

  return null;
}

export default consultarCloud;
