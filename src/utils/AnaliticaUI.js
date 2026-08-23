export class AnaliticaUI {
  constructor(agenteCritico) {
    if (!agenteCritico) {
      throw new Error("[AnaliticaUI Error]: Se requiere una instancia válida de AgenteCritico.");
    }
    this.agente = agenteCritico;
  }

  async renderizar(herramienta) {
    const toolData = herramienta || { name: 'herramienta_desconocida', uso: 0 };

    return await this.agente.procesar(
      { tool: toolData, accion: "renderizar_grafico" },
      { contexto: "productividad_ui" },
      (datos) => {
        const nombreHerramienta = datos.tool?.name || datos.tool?.nombre || "Métrica General";
        
        console.log(`[UI] Renderizando gráfico de productividad para: ${nombreHerramienta}`);

        return {
          success: true,
          componente: "ChartProductividad",
          payload: {
            titulo: `Uso y Rendimiento: ${nombreHerramienta}`,
            labels: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"],
            datasets: [
              {
                label: "Nivel de Actividad",
                data: datos.tool?.metricas || [15, 30, 45, 60]
              }
            ]
          },
          timestamp: new Date().toISOString()
        };
      }
    );
  }
}
