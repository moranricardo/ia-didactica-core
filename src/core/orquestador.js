import { TelemetryHeart } from "./TelemetryHeart.js";

const heart = new TelemetryHeart();

async function ejecutarOrquestador() {
  const nombreAgente = "AgenteCritico";
  const temaActual = "Arquitectura de Software";

  try {
    // 1. Avisar que el agente inició
    await heart.pulse(nombreAgente, "running", { 
      tarea: "Generando lección",
      tema: temaActual 
    });

    console.log(`\n[Orquestador] Iniciando trabajo de ${nombreAgente}...`);
    
    // Simulación del trabajo del agente (ej. llamada a Gemini)
    await new Promise(resolve => setTimeout(resolve, 2500)); 

    // 2. Avisar que terminó con éxito
    await heart.pulse(nombreAgente, "idle", { 
      aprobado: true,
      ultimaAccion: "Lección completada"
    });
    console.log(`[Orquestador] Trabajo de ${nombreAgente} finalizado exitosamente.\n`);

  } catch (error) {
    // 3. Registrar fallas
    await heart.pulse(nombreAgente, "error", { 
      error: error.message 
    });
    console.error(`[Orquestador] Falla crítica en ${nombreAgente}:`, error);
  }
}

ejecutarOrquestador();
