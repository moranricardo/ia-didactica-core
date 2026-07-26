export class GeminiClient {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || "";
    // Verificación estricta: si no empieza con AIzaSy, es MOCK.
    this.isMock = !this.apiKey.startsWith("AIzaSy");
    
    if (this.isMock) {
      console.warn("⚠️ [GeminiClient] Clave real no detectada. Activando modo MOCK (Sin costo).");
    }
  }

  async generarLeccion(tema) {
    if (this.isMock) {
      // Simulación asíncrona ligera para imitar el retardo de red
      await new Promise(resolve => setTimeout(resolve, 800));
      return { 
        texto: `[MOCK LOCAL] Explicación simulada sobre: ${tema}. Todo funcionando sin gastar API.`, 
        tokens: 0 
      };
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
    const payload = {
      contents: [{ parts: [{ text: `Eres un experto tutor técnico. Explica de forma concisa y directa el siguiente tema en un párrafo corto: ${tema}` }] }]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Fallo en la API de Gemini: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const texto = data.candidates[0].content.parts[0].text;
    const tokens = data.usageMetadata?.totalTokenCount || 0;

    return { texto, tokens };
  }
}
