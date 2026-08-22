import { GeminiClient } from './GeminiClient.js';

export class AgenteGenerador {
  constructor(geminiClient = null, constitucion = '') {
    this.client = geminiClient || new GeminiClient();
    this.constitucion = constitucion?.trim() || 'Claridad conceptual, ejemplo práctico con código, resumen accionable.';
  }

  _buildPrompt(tema, contexto) {
    return `
ROL: Arquitecto de software senior y docente experto en ${tema}.
OBJETIVO: Crear una lección técnica en Markdown accesible y de aplicación inmediata.
TEMA: "${tema}"
CONTEXTO DEL ESTUDIANTE: ${JSON.stringify(contexto, null, 2)}
CONSTITUCIÓN PEDAGÓGICA (OBLIGATORIA):
${this.constitucion}
`.trim();
  }

  async generarBorrador(tema, contextoUsuario = {}) {
    if (!tema?.trim()) throw new Error('[AgenteGenerador] El parámetro "tema" es requerido.');

    console.log(`[AgenteGenerador] ✍️ Redactando: "${tema}" | Nivel: ${contextoUsuario.nivel || 'avanzado'}`);
    const prompt = this._buildPrompt(tema, contextoUsuario);

    try {
      let raw;
      if (typeof this.client.generarTexto === 'function') {
        raw = await this.client.generarTexto(prompt);
      } else if (typeof this.client.generarLeccion === 'function') {
        raw = await this.client.generarLeccion(tema);
      } else if (typeof this.client.generateContent === 'function') {
        raw = await this.client.generateContent({ contents: prompt });
      } else {
        throw new Error("El cliente Gemini no expone un método compatible (generarTexto, generarLeccion, generateContent).");
      }

      let texto = '';
      if (typeof raw === 'string') {
        texto = raw;
      } else if (raw?.response && typeof raw.response.text === 'function') {
        texto = raw.response.text();
      } else {
        texto = raw?.texto || raw?.text || raw?.content || JSON.stringify(raw);
      }

      if (!texto || texto.trim().length === 0) {
        throw new Error('La respuesta del modelo de lenguaje regresó vacía.');
      }

      console.log(`[AgenteGenerador] ✅ Borrador completado (${texto.length} caracteres).`);

      return {
        tema,
        texto: texto.trim(),
        modeloUsado: raw?.modeloUsado || raw?.modelo || this.client.modeloUsado || 'gemini-flash',
        tokensAprox: raw?.tokensAprox || raw?.tokens || Math.ceil(texto.length / 4),
        propietario: "Ricardo Moran",
        custodio: "@ricardomoranbot",
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`[AgenteGenerador] ❌ Falla al generar "${tema}":`, error.message);
      throw error;
    }
  }
}
