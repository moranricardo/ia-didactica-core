import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

export class GeminiClient {
  constructor(apiKey) {
    if (!apiKey) throw new Error("[GeminiClient] API_KEY faltante");
    
    const cleanKey = apiKey.trim();
    
    // 🔍 SISTEMA DE DEBUG INYECTADO
    console.log(`[GeminiClient] Usando key: ${cleanKey.slice(0, 6)}...${cleanKey.slice(-4)}`);
    if (cleanKey.startsWith('"') || cleanKey.endsWith('"') || cleanKey.startsWith("'") || cleanKey.endsWith("'")) {
      throw new Error("[GeminiClient] Tu API_KEY tiene comillas. Quítalas del .env");
    }

    this.isMock = cleanKey === 'MOCK_GRATIS';
    
    if (!this.isMock) {
      this.genAI = new GoogleGenerativeAI(cleanKey);
      this.model = this.genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        ],
        generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
      });
    }
  }

  async generarTexto(prompt, opciones = {}) {
    if (this.isMock) {
      console.log("🟡 [GeminiClient] MODO MOCK ACTIVO: Simulando respuesta sin costo.");
      return JSON.stringify({
        aprobado: false,
        razon: "Mock: Simulando que la lección tiene más de una pregunta.",
        datos_refinados: "Los autocodificadores son redes neuronales fascinantes. ¿Te animas a ver un ejemplo práctico?",
        confianza: 0.99
      });
    }

    const { signal, response_format, maxRetries = 2 } = opciones;
    let intento = 0;

    while (intento <= maxRetries) {
      try {
        let promptFinal = prompt;
        if (response_format?.type === "json_object") {
          promptFinal = `${prompt}\n\nIMPORTANTE: Responde únicamente con JSON válido. Sin markdown, sin explicaciones antes o después.`;
        }

        const result = await this.model.generateContent(promptFinal, { signal });
        const response = result.response;

        if (response.promptFeedback?.blockReason) {
          throw new Error(`Bloqueado por seguridad: ${response.promptFeedback.blockReason}`);
        }

        const text = response.text();
        if (!text || text.trim().length === 0) {
          throw new Error("Gemini devolvió respuesta vacía");
        }
        return text;
      } catch (error) {
        intento++;
        const esRecuperable = error.message.includes('503') || error.message.includes('429') || error.message.includes('timeout') || error.name === 'AbortError';

        if (intento > maxRetries || !esRecuperable) {
          console.error(`[GeminiClient] Fallo definitivo:`, { intento, error: error.message });
          throw error;
        }

        const delay = Math.pow(2, intento - 1) * 1000;
        console.warn(`[GeminiClient] Reintento ${intento}/${maxRetries} en ${delay}ms. Error: ${error.message}`);
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }
}
