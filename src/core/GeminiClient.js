export class GeminiClient {
  constructor() {
 HEAD
    this.apiKey = process.env.GEMINI_API_KEY || '';
    this.isValidKey = this.apiKey.length > 30 && !this.apiKey.includes('AQUI');
    this.modeloUsado = 'gemini-3.5-flash'; // 👈 Actualizado a tu modelo disponible
    this.apiKey = process.env.GEMINI_API_KEY || "";
    this.isMock = !this.apiKey || this.apiKey === "";
  }

  async generarTexto(prompt, intentos = 3) {
    if (this.isMock) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return { texto: `[MOCK LOCAL] Generación simulada para: ${prompt}`, tokens: 0 };
    }

    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`;
    const payload = {
      contents: [{ parts: [{ text: prompt }] }]
    };

    for (let i = 1; i <= intentos; i++) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.status === 503 || response.status === 429) {
          console.warn(`⚠️ [GeminiClient] Servidor ocupado (${response.status}). Reintento ${i}/${intentos} en 3s...`);
          await new Promise(resolve => setTimeout(resolve, 3000 * i));
          continue;
        }

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error?.message || response.statusText);
        }

        const data = await response.json();
        const texto = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sin respuesta del modelo.";
        const tokens = data.usageMetadata?.totalTokenCount || 0;
        return { texto, tokens };
      } catch (err) {
        if (i === intentos) {
          console.error("🔴 [GeminiClient] Agotados los reintentos. Activando fallback MOCK.");
          return {
            texto: `[FALLBACK MOCK] Contenido generado en contingencia por alta demanda de la API.`,
            tokens: 0
          };
        }
      }
    }

    this.apiKey = process.env.GEMINI_API_KEY || "";
    this.isMock = !this.apiKey || this.apiKey === "";

    if (this.isMock) {
      console.warn("⚠️ [GeminiClient] Clave real no detectada. Activando modo MOCK (Sin costo).");
    }
  }

  async generarLeccion(tema) {
    if (this.isMock) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        texto: `[MOCK LOCAL] Explicación simulada sobre: ${tema}. Todo funcionando sin gastar API.`,
        tokens: 0
      };
    }

    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`;
    const payload = {
      contents: [{ parts: [{ text: `Eres un experto tutor técnico. Explica de forma concisa y directa el siguiente tema en un párrafo corto: ${tema}` }] }]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Fallo en la API de Gemini (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const textoGenerado = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sin respuesta del modelo.";

    return {
      texto: textoGenerado,
      tokens: data.usageMetadata?.totalTokenCount || 0
    };
 fb315fe (feat(core): actualizar validacion de modo mock en GeminiClient)
    return {
      texto: `[FALLBACK MOCK] Generación por tiempo de espera de la API.`,
      tokens: 0
    };
  }

  async generarLeccion(tema) {
    const prompt = `Eres un experto tutor técnico. Explica de forma concisa y directa el siguiente tema en un párrafo corto: ${tema}`;
    return await this.generarTexto(prompt);
  }
}
