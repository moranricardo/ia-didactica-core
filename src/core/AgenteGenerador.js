import { GeminiClient } from './GeminiClient.js';

export class AgenteGenerador {
  constructor(geminiClient = null, constitucion = '') {
    this.llm = geminiClient || new GeminiClient();
    this.constitucion = constitucion || `Tono: profesional y cercano. Estructura: Definición -> Conceptos Clave -> Ejemplo Práctico con código -> Ventajas/Desafíos. Máx 900 palabras.`;
  }

  _construirPrompt(tema, contextoUsuario) {
    const nivel = contextoUsuario.nivel || 'intermedio';
    const audiencia = contextoUsuario.audiencia || 'Ingenieros de Software / DevOps';
    const objetivo = contextoUsuario.objetivo || `Comprender ${tema} a nivel práctico`;

    return `
ROL: Eres un arquitecto de software senior y profesor universitario experto en crear contenido didáctico de alto rigor técnico.

TAREA: Escribe una lección técnica completa sobre:
TEMA: "${tema}"

PARAMETROS DIDACTICOS:
- Nivel: ${nivel}
- Audiencia: ${audiencia}
- Objetivo de aprendizaje: ${objetivo}
- Contexto extra: ${JSON.stringify(contextoUsuario)}

CONSTITUCION PEDAGOGICA (OBLIGATORIA - Si la violas, la lección será rechazada):
---
${this.constitucion}
---

FORMATO DE SALIDA OBLIGATORIO (Markdown):
Lección Técnica: [Título]
**Nivel:** [nivel] | **Audiencia:** [audiencia]
**Objetivo:** [objetivo]

1. Introducción (contexto y por qué importa)
2. Conceptos Clave (con fórmulas si aplica, usa LaTeX)
3. Ventajas y Desafíos (tabla comparativa)
4. Ejemplo Práctico (código ejecutable, con comentarios)
5. Conclusión y siguiente paso

RESTRICCIONES ANTI-ALUCINACION:
- No inventes versiones, librerías o comandos que no existan.
- Si no estás seguro de un dato, dilo explícitamente.
- Cita solo ejemplos que puedas codificar.
- Genera ÚNICAMENTE el markdown de la lección, sin frases tipo "Aquí tienes la lección" o "Espero que te guste".
`.trim();
  }

  async generarBorrador(tema, contextoUsuario = {}) {
    if (!tema || tema.trim().length < 3) {
      throw new Error("[AgenteGenerador] Tema inválido o muy corto.");
    }

    console.log(`[AgenteGenerador] ✍️ Redactando: "${tema}" | Nivel: ${contextoUsuario.nivel || 'intermedio'}`);

    const prompt = this._construirPrompt(tema, contextoUsuario);
    const inicio = Date.now();

    try {
      const textoCrudo = await this.llm.generarTexto(prompt);
      const texto = typeof textoCrudo === 'string' ? textoCrudo : (textoCrudo.texto || textoCrudo.content || '');

      if (!texto || texto.length < 200) {
        throw new Error("Respuesta del LLM vacía o demasiado corta (<200 chars)");
      }

      const duracion = ((Date.now() - inicio) / 1000).toFixed(1);
      console.log(`[AgenteGenerador] ✅ Borrador OK (${texto.length} chars, ${duracion}s, modelo: ${this.llm.modeloUsado || 'gemini-2.0-flash'})`);

      return {
        texto,
        modeloUsado: this.llm.modeloUsado || 'gemini-2.0-flash',
        tokensAprox: Math.ceil(texto.length / 4),
        tema,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error(`[AgenteGenerador] ❌ Falla generando "${tema}":`, error.message);
      throw error;
    }
  }
}
