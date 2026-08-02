import { GeminiClient } from './GeminiClient.js';

export class AgenteGenerador {
  constructor(geminiClient = null, constitucion = '') {
    this.client = geminiClient || new GeminiClient();
    this.constitucion = constitucion?.trim() || 'Claridad conceptual, ejemplo práctico con código, resumen accionable.';
  }

  _buildPrompt(tema, contexto) {
    return `
ROL: Arquitecto de software senior y docente experto en ${tema}.
OBJETIVO: Lección técnica en Markdown que un junior pueda implementar hoy.
TEMA: "${tema}"
CONTEXTO: ${JSON.stringify(contexto, null, 2)}
CONSTITUCION (OBLIGATORIA):
${this.constitucion}
`.trim();
  }

  async generarBorrador(tema, contextoUsuario = {}) {
    if (!tema?.trim()) throw new Error('[AgenteGenerador] tema requerido');

    console.log(`[AgenteGenerador] ✍️ Redactando: "${tema}" | Nivel: ${contextoUsuario.nivel || 'avanzado'}`);
    const prompt = this._buildPrompt(tema, contextoUsuario);

    try {
      let raw;
      // Estrategia de fallback dinámico para soportar tanto Modo Producción como Modo MOCK
      if (typeof this.client.generarTexto === 'function') {
        raw = await this.client.generarTexto(prompt);
      } else if (typeof this.client.generarLeccion === 'function') {
        raw = await this.client.generarLeccion(tema);
      } else if (typeof this.client.generateContent === 'function') {
        raw = await this.client.generateContent({ contents: prompt });
      } else {
        throw new Error("El cliente Gemini no expone un método compatible (generarTexto, generarLeccion, generateContent)");
      }

      const texto = typeof raw === 'string' ? raw : (raw.texto || raw.text || raw.content || JSON.stringify(raw));
      
      if (!texto || texto.length < 1) throw new Error(`Respuesta LLM demasiado corta o nula`);

      console.log(`[AgenteGenerador] ✅ Borrador OK (${texto.length} chars)`);

      return {
        tema,
        texto: texto.trim(),
        modeloUsado: raw.modeloUsado || raw.modelo || this.client.modeloUsado || 'gemini-mock',
        tokensAprox: raw.tokensAprox || raw.tokens || Math.ceil(texto.length / 4),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`[AgenteGenerador] ❌ Falla generando "${tema}":`, error.message);
      throw error;
    }
  }
}
