export class GeminiClient {
  constructor() {
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
  }
}
