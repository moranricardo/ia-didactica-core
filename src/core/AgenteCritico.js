/**
 * AgenteCritico.js
 * Módulo de evaluación de inferencia en bucle cerrado.
 */
export class AgenteCritico {
  constructor(modeloLlm, reglasConstitucion) {
    this.llm = modeloLlm;
    this.constitucion = reglasConstitucion;
  }

  async evaluar(datosEntrada, contextoUsuario) {
    const promptEvaluador = `
Actúa como validador estricto. Revisa la siguiente entrada basándote en la Constitución del Sistema.
Constitución: ${this.constitucion}
Contexto del Usuario: ${JSON.stringify(contextoUsuario)}
Entrada a evaluar: ${JSON.stringify(datosEntrada)}

Devuelve ÚNICAMENTE un JSON con esta estructura:
{
  "aprobado": boolean,
  "razon": "explicación breve",
  "datos_refinados": "entrada corregida si es necesario, o null"
}
`;
    try {
      const respuesta = await this.llm.generarTexto(promptEvaluador);
      return JSON.parse(respuesta);
    } catch (error) {
      return {
        aprobado: false,
        razon: "Fallo en el bucle de razonamiento",
        datos_refinados: null
      };
    }
  }

  async procesar(datosEntrada, contextoUsuario, funcionEjecucion) {
    const evaluacion = await this.evaluar(datosEntrada, contextoUsuario);

    if (evaluacion.aprobado) {
      const datosFinales = evaluacion.datos_refinados || datosEntrada;
      return funcionEjecucion(datosFinales);
    } else {
      console.warn(`[AgenteCrítico] Ejecución bloqueada/ajustada: ${evaluacion.razon}`);
      return { error: true, mensaje: evaluacion.razon };
    }
  }
}
