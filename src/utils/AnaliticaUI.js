export class AnaliticaUI {
  constructor(agenteCritico) {
    this.agente = agenteCritico;
  }
  async renderizar(herramienta) {
    return await this.agente.procesar(
      { tool: herramienta, accion: "renderizar_grafico" },
      { contexto: "productividad" },
      (datos) => {
        console.log("[UI] Renderizando gráfico de productividad para:", datos.tool.name);
        // Aquí se integraría el Chart.js o librería visual
        return { success: true, visual: "render_activo" };
      }
    );
  }
}
