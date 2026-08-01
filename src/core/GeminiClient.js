export class GeminiClient {
  constructor() {
 HEAD
    this.apiKey = process.env.GEMINI_API_KEY || '';
    this.isValidKey = this.apiKey.length > 30 && !this.apiKey.includes('AQUI');
    this.modeloUsado = 'gemini-3.5-flash'; // 👈 Actualizado a tu modelo disponible
  }

  async generarTexto(prompt) {
    if (!this.isValidKey) {
      console.warn("⚠️ [GeminiClient] Clave real no detectada o inválida. Activando modo MOCK.");
      return { 
        texto: `[MOCK LOCAL] Explicación simulada.`, 
        modeloUsado: 'gemini-mock', 
        tokensAprox: 25 
      };
    }

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.modeloUsado}:generateContent?key=${this.apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(`${err.error?.message || response.statusText}`);
      }
      
      const data = await response.json();
      const texto = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      return { 
        texto, 
        modeloUsado: this.modeloUsado, 
        tokensAprox: Math.ceil(texto.length / 4) 
      };
    } catch (error) {
      console.error("[GeminiClient] Error de red o API:", error.message);
      throw error;
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
  }
}
