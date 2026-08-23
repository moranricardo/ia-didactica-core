import { GoogleGenAI } from '@google/genai';

function obtenerApiKeys() {
  const keys = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_KEY_1,
    process.env.GEMINI_KEY_2,
    process.env.GEMINI_KEY_3,
    process.env.GEMINI_KEY_4,
  ].filter(Boolean);

  return [...new Set(keys)];
}

const MODELOS_FALLBACK = [
  'gemini-2.5-flash',
  'gemini-1.5-flash'
];

export async function consultarCloud(prompt) {
  const apiKeys = obtenerApiKeys();

  if (apiKeys.length === 0) {
    console.error('❌ Error: No se detectaron API Keys (GEMINI_API_KEY / GEMINI_KEY_1..4).');
    return null;
  }

  for (let i = 0; i < apiKeys.length; i++) {
    const apiKey = apiKeys[i];
    console.log(`📡 Consultando API Key #${i + 1} (${apiKey.slice(0, 6)}...)...`);

    for (const model of MODELOS_FALLBACK) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
        });

        if (response && response.text) {
          console.log(`✅ Respuesta exitosa [Key #${i + 1} | Modelo: ${model}]`);
          return response.text;
        }
      } catch (error) {
        const is429 = error.status === 429 || (error.message && error.message.includes('429'));
        console.error(`⚠️ Falló [Key #${i + 1} | ${model}]: ${is429 ? 'Cuota Agotada (429)' : error.message}`);

        if (is429) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          break;
        }
      }
    }
  }

  return null;
}

export default consultarCloud;
