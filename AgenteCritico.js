export class AgenteCritico {
  constructor(llm, constitucion) {
    this.llm = llm;
    this.constitucion = constitucion;
  }
  async evaluar(entrada, contexto) {
    const prompt = `Actúa como validador estricto. Constitución: ${this.constitucion}. Entrada: ${JSON.stringify(entrada)}. Devuelve JSON: {"aprobado": boolean, "razon": "string", "datos_refinados": "object|null"}`;
    const resp = await this.llm.generar(prompt);
    return JSON.parse(resp);
  }
  async procesar(datos, contexto, callback) {
    const ev = await this.evaluar(datos, contexto);
    if (ev.aprobado) {
      return await callback(ev.datos_refinados || datos);
    } else {
      console.warn("[AgenteCrítico] Intervención:", ev.razon);
      return { error: true, mensaje: ev.razon };
    }
  }
}
