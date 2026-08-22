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
    this.modeloUsado = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  }

  _getKey() {
    if (this.keys.length === 0) return null;
    return this.keys[this.currentKeyIndex];
  }

  _rotateKey() {
    if (this.keys.length <= 1) return false;
    this.currentKeyIndex = (this.currentKeyIndex + 1) % this.keys.length;
    console.warn(`🔄 [GeminiClient] Rotando a la API Key #${this.currentKeyIndex + 1}`);
    return true;
  }

  async _esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async generarTexto(prompt) {
    if (this.keys.length === 0) {
      console.warn("⚠️ [GeminiClient] Sin claves API configuradas. Ejecutando respuesta MOCK.");
      return this._generarMock(prompt);
    }

    let intentos = 0;
    const maxIntentosTotal = this.keys.length * 2;

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
          const err = await response.json().catch(() => ({}));
          const errorMessage = err.error?.message || response.statusText;

          if (errorMessage.includes("quota") || errorMessage.includes("Quota exceeded") || response.status === 429) {
            console.warn(`⚠️ [GeminiClient] Cuota agotada en la clave actual. Rotando...`);
            intentos++;
            this._rotateKey();
            await this._esperar(1500);
            continue;
          }
          throw new Error(errorMessage);
        }

        const data = await response.json();
        const texto = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

        if (!texto) throw new Error("Respuesta vacía por parte de la API de Gemini.");

        return {
          texto,
          modeloUsado: this.modeloUsado,
          tokensAprox: data.usageMetadata?.totalTokenCount || Math.ceil(texto.length / 4)
        };

      } catch (error) {
        intentos++;
        if (intentos >= maxIntentosTotal) {
          console.error("🔴 [GeminiClient] Límite de intentos agotado:", error.message);
          break;
        }
        this._rotateKey();
        await this._esperar(2000);
      }
    }

    console.warn("⚠️ [GeminiClient] Fallo en todas las claves. Activando MOCK de respaldo.");
    return this._generarMock(prompt);
  }

  _generarMock(prompt) {
    return {
      texto: "# Lección Técnica Generada (Modo Resiliente)\n\nContenido generado de respaldo por límite de cuota o ausencia de llaves API.\n\n### Prompt Procesado\n" + prompt.substring(0, 100) + "...",
      modeloUsado: "gemini-mock-fallback",
      tokensAprox: 45
    };
  }

  async generarLeccion(tema) {
    return this.generarTexto(`Explica de forma detallada, clara y estructurada el siguiente tema técnico: ${tema}`);
  }
}
