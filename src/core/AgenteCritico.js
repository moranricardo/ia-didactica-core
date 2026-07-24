/**
 * AgenteCritico.js
 * Módulo de evaluación en bucle cerrado con validación de esquema y timeouts.
 */
import { z } from 'zod';

// 1. Schema: Contrato estricto con el LLM
const EvaluacionSchema = z.object({
  aprobado: z.boolean(),
  razon: z.string().min(5).max(250),
  datos_refinados: z.union([z.string(), z.any(), z.null()]).default(null),
  confianza: z.number().min(0).max(1).optional().default(0.8)
});

export class AgenteCritico {
  constructor(modeloLlm, reglasConstitucion) {
    this.llm = modeloLlm;
    this.constitucion = reglasConstitucion;
  }

  async evaluar(datosEntrada, contextoUsuario = {}) {
    // 2. Prompt blindado: JSON mode + few-shot pedagógico
    const promptEvaluador = `
Actúa como un validador de seguridad y Agente Crítico. Tu única función es devolver JSON válido.

CONSTITUCIÓN DEL SISTEMA:
${this.constitucion}

CONTEXTO USUARIO: ${JSON.stringify(contextoUsuario)}
ENTRADA A EVALUAR: ${typeof datosEntrada === 'string' ? datosEntrada : JSON.stringify(datosEntrada)}

Responde SOLO con JSON. Sin markdown, sin explicaciones.
Schema esperado: { "aprobado": boolean, "razon": string, "datos_refinados": string|null, "confianza": number }

Ejemplo APROBADO: {"aprobado":true,"razon":"La consulta es sobre Notion y productividad.","datos_refinados":null,"confianza":0.95}
Ejemplo RECHAZADO CON REDIRECCIÓN: {"aprobado":false,"razon":"Consulta sobre videojuegos, fuera de contexto.","datos_refinados":"Parece que buscas distraerte. ¿Qué tal si exploramos la técnica Pomodoro para optimizar tu tiempo libre?","confianza":0.9}
`;

    try {
      // 3. Timeout para evitar bloqueos en la inferencia (10 segundos máximo)
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000); 

      // Nota: Pasamos la señal al LLM (GeminiClient debe estar preparado para recibirla)
      const respuesta = await this.llm.generarTexto(promptEvaluador, { 
        signal: controller.signal
      });
      clearTimeout(timeout);

      // 4. Limpieza robusta de Markdown
      const jsonLimpio = respuesta
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();

      // 5. Parseo y Validación con Zod
      const parsed = JSON.parse(jsonLimpio);
      const validado = EvaluacionSchema.parse(parsed);

      return validado;

    } catch (error) {
      // 6. Logs útiles para debug en terminal
      console.error('[AgenteCrítico] Fallo en evaluación:', {
        tipo: error.name,
        mensaje: error.message
      });

      return {
        aprobado: false,
        razon: error.name === 'ZodError' 
          ? "El modelo devolvió una estructura JSON inválida." 
          : "Fallo en el bucle de razonamiento (Timeout o Error de Red).",
        datos_refinados: null,
        confianza: 0
      };
    }
  }

  async procesar(datosEntrada, contextoUsuario, funcionEjecucion) {
    const evaluacion = await this.evaluar(datosEntrada, contextoUsuario);

    // 7. Lógica clara: Flujo normal (Aprobado)
    if (evaluacion.aprobado) {
      return funcionEjecucion(datosEntrada);
    }

    // Flujo de Refinamiento (Redirección Pedagógica)
    if (evaluacion.datos_refinados) {
      console.info(`[AgenteCrítico] Redirección pedagógica aplicada: ${evaluacion.razon}`);
      return funcionEjecucion(evaluacion.datos_refinados);
    }

    // Flujo de Bloqueo Total
    console.warn(`[AgenteCrítico] Bloqueo estricto: ${evaluacion.razon}`);
    return { 
      error: true, 
      mensaje: evaluacion.razon,
      confianza: evaluacion.confianza 
    };
  }
}
