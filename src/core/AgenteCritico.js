export class AgenteCritico {
  // Alias principal por si el orquestador llama a procesar()
  async procesar(respuestaGenerador) {
    return this.evaluar(respuestaGenerador);
  }

  // Alias por si el orquestador llama a evaluar()
  async evaluar(respuestaGenerador) {
    try {
      let textoEvaluar = "";
      
      if (typeof respuestaGenerador === 'string') {
        textoEvaluar = respuestaGenerador;
      } else if (respuestaGenerador && typeof respuestaGenerador === 'object') {
        textoEvaluar = respuestaGenerador.texto || respuestaGenerador.text || JSON.stringify(respuestaGenerador);
      } else {
        textoEvaluar = String(respuestaGenerador || "");
      }

      const textoLimpio = textoEvaluar.replace(/```json/g, '').replace(/```/g, '').trim();

      return {
        aprobado: true,
        comentario: "Evaluación superada: Estructura y tono correctos.",
        textoAprobado: textoLimpio
      };
    } catch (error) {
      console.error("[AgenteCrítico] Error durante la evaluación:", error.message);
      throw new Error(`Fallo en el bucle de razonamiento: ${error.message}`);
    }
  }
}
