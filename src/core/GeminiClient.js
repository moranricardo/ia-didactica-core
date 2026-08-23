export class GeminiClient {
  constructor() {
    const rawKeys = process.env.GEMINI_API_KEYS || [
      process.env.GEMINI_API_KEY,
      process.env.GEMINI_API_KEY_1,
      process.env.GEMINI_API_KEY_2,
      process.env.GEMINI_API_KEY_3,
      process.env.GEMINI_API_KEY_4
    ].filter(Boolean).join(",");

    this.keys = [...new Set(rawKeys.split(",").map(k => k.trim()).filter(k => k.length > 10))];
    this.currentKeyIndex = 0;
    
    this.modelos = [
      process.env.GEMINI_MODEL || "gemini-2.5-flash",
      "gemini-1.5-flash"
    ];
    this.currentModelIndex = 0;
  }

  _getKey() {
    if (this.keys.length === 0) return null;
    return this.keys[this.currentKeyIndex];
  }

  _getModel() {
    return this.modelos[this.currentModelIndex];
  }

  _rotateKey() {
    if (this.keys.length <= 1) return false;
    this.currentKeyIndex = (this.currentKeyIndex + 1) % this.keys.length;
    console.warn(`🔄 [GeminiClient] Rotando a la API Key #${this.currentKeyIndex + 1}`);
    return true;
  }

  _rotateModel() {
    if (this.modelos.length <= 1) return false;
    this.currentModelIndex = (this.currentModelIndex + 1) % this.modelos.length;
    console.warn(`🔄 [GeminiClient] Cambiando a modelo fallback: ${this._getModel()}`);
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
    const maxIntentosTotal = this.keys.length * this.modelos.length * 2;

    while (intentos < maxIntentosTotal) {
      const apiKey = this._getKey();
      const modelo = this._getModel();

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 4096 }
          })
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          const errorMessage = err.error?.message || response.statusText;

          if (errorMessage.includes("quota") || errorMessage.includes("Quota exceeded") || response.status === 429) {
            console.warn(`⚠️ [GeminiClient] Cuota agotada en Key #${this.currentKeyIndex + 1}. Rotando...`);
            intentos++;
            this._rotateKey();
            await this._esperar(1000);
            continue;
          }
          
          if (response.status === 404 || errorMessage.includes("not found")) {
            this._rotateModel();
          }

          throw new Error(errorMessage);
        }

        const data = await response.json();
        const texto = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

        if (!texto) throw new Error("Respuesta vacía por parte de la API de Gemini.");

        return {
          texto,
          modeloUsado: modelo,
          tokensAprox: data.usageMetadata?.totalTokenCount || Math.ceil(texto.length / 4)
        };

      } catch (error) {
        clearTimeout(timeoutId);
        intentos++;
        if (intentos >= maxIntentosTotal) {
          console.error("🔴 [GeminiClient] Límite de intentos agotado:", error.message);
          break;
        }
        this._rotateKey();
        await this._esperar(1500);
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

export default GeminiClient;
