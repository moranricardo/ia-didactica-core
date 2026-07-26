export class GeminiClient {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    if (!this.apiKey) {
      console.warn("⚠️ [GeminiClient] No se detectó GEMINI_API_KEY. Operando en modo MOCK.");
    }
  }

  async generarLeccion(tema) {
    if (!this.apiKey) {
      return { 
        texto: `[MOCK] Lección simulada sobre ${tema}. Para contenido real, configura GEMINI_API_KEY.`, 
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
