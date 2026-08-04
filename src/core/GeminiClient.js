export class GeminiClient {
  constructor() {
    const keysConfig = process.env.GEMINI_API_KEYS || [
      process.env.GEMINI_API_KEY_1,
      process.env.GEMINI_API_KEY_2,
      process.env.GEMINI_API_KEY_3,
      process.env.GEMINI_API_KEY_4
    ].filter(Boolean).join(",");

    this.keys = keysConfig.split(",").map(k => k.trim()).filter(k => k.length > 10);
    this.currentKeyIndex = 0;
    this.modeloUsado = "gemini-3.5-flash";
  }

  _getKey() {
    if (this.keys.length === 0) return null;
    return this.keys[this.currentKeyIndex];
  }

  _rotateKey() {
    if (this.keys.length <= 1) return false;
    this.currentKeyIndex = (this.currentKeyIndex + 1) % this.keys.length;
    console.warn(`🔄 [GeminiClient] Rotando automáticamente a la API Key #${this.currentKeyIndex + 1}`);
    return true;
  }

  async _esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async generarTexto(prompt) {
    if (this.keys.length === 0) {
      console.warn("⚠️ [GeminiClient] No hay claves configuradas. Usando MOCK.");
      return this._generarMock(prompt);
    }

    let intentos = 0;
    const maxIntentosTotal = this.keys.length * 2; // Dos vueltas completas a las llaves si es necesario

    while (intentos < maxIntentosTotal) {
      const apiKey = this._getKey();
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.modeloUsado}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 4096 }
          })
        });

        if (!response.ok) {
          const err = await response.json();
          const errorMessage = err.error?.message || response.statusText;

          if (errorMessage.includes("quota") || errorMessage.includes("Quota exceeded") || response.status === 429) {
            console.warn(`⚠️ [GeminiClient] Cuota excedida en llave actual. Rotando...`);
            intentos++;
            this._rotateKey();
            // Pequeña pausa de cortesía antes de reintentar con la siguiente llave
            await this._esperar(2000);
            continue;
          }
          throw new Error(errorMessage);
        }

        const data = await response.json();
        const texto = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

        if (!texto) throw new Error("Respuesta nula del modelo");

        return {
          texto,
          modeloUsado: this.modeloUsado,
          tokensAprox: data.usageMetadata?.totalTokenCount || Math.ceil(texto.length / 4)
        };

      } catch (error) {
        intentos++;
        if (intentos >= maxIntentosTotal) {
          console.error("🔴 [GeminiClient] Error crítico en la petición:", error.message);
          break;
        }
        this._rotateKey();
        await this._esperar(3000);
      }
    }

    console.warn("⚠️ [GeminiClient] Límite superado en todas las claves. Usando MOCK de respaldo.");
    return this._generarMock(prompt);
  }

  _generarMock(prompt) {
    return {
      texto: "# Lección Técnica Generada (Modo Resiliente)\n\nContenido generado localmente debido a límites de cuota en las claves activas.\n\n### Tema Tratado\n" + prompt.substring(0, 100) + "...",
      modeloUsado: "gemini-mock-fallback",
      tokensAprox: 45
    };
  }

  async generarLeccion(tema) {
    return this.generarTexto(`Explica de forma detallada, clara y estructurada el siguiente tema técnico: ${tema}`);
  }
}
