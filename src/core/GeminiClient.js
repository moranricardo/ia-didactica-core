import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

export class GeminiClient {
  constructor(apiKey) {
    if (!apiKey) throw new Error("[GeminiClient] API_KEY faltante");

    this.genAI = new GoogleGenerativeAI(apiKey);

    // 1. Config base: Flash para velocidad, pero con controles
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      // 2. Safety: Permitimos contenido educativo. Bloqueamos lo peligroso
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
      generationConfig: {
        temperature: 0.7, // Se puede sobrescribir a 0.2 para el Agente Crítico
        maxOutputTokens: 2048,
      }
    });
  }

  async generarTexto(prompt, opciones = {}) {
    const {
      signal, // Para AbortController timeout
      response_format, // { type: "json_object" }
      maxRetries = 2
    } = opciones;

    let intento = 0;

    while (intento <= maxRetries) {
      try {
        // 3. JSON Mode: Forzamos la estructura en el prompt
        let promptFinal = prompt;
        if (response_format?.type === "json_object") {
          promptFinal = `${prompt}\n\nIMPORTANTE: Responde únicamente con JSON válido. Sin markdown, sin explicaciones antes o después.`;
        }

        const result = await this.model.generateContent(promptFinal, { signal });
        const response = result.response;

        // 4. Validar bloqueos de seguridad ANTES de extraer el texto
        if (response.promptFeedback?.blockReason) {
          throw new Error(`Bloqueado por seguridad: ${response.promptFeedback.blockReason}`);
        }

        const text = response.text();

        // 5. Validar respuesta vacía
        if (!text || text.trim().length === 0) {
          throw new Error("Gemini devolvió respuesta vacía");
        }

        return text;

      } catch (error) {
        intento++;

        // 6. Reintentos solo en errores recuperables de red o cuota
        const esRecuperable = error.message.includes('503') ||
                             error.message.includes('429') ||
                             error.message.includes('timeout') ||
                             error.name === 'AbortError';

        if (intento > maxRetries || !esRecuperable) {
          console.error(`[GeminiClient] Fallo definitivo:`, {
            intento,
            error: error.message,
            prompt: prompt.slice(0, 50) + '...'
          });
          throw error;
        }

        // Backoff exponencial para no saturar la API
        const delay = Math.pow(2, intento - 1) * 1000;
        console.warn(`[GeminiClient] Reintento ${intento}/${maxRetries} en ${delay}ms. Error: ${error.message}`);
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }

  // 7. Stream para renderizado condicional progresivo (opcional para el frontend)
  async *generarTextoStream(prompt, opciones = {}) {
    try {
      const result = await this.model.generateContentStream(prompt, opciones);
      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) yield text;
      }
    } catch (error) {
      console.error("[GeminiClient] Error en stream:", error.message);
      throw error;
    }
  }
}
