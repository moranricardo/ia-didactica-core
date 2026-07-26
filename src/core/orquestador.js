import { TelemetryHeart } from "./TelemetryHeart.js";
import { GeminiClient } from "./GeminiClient.js";

const heart = new TelemetryHeart();
const gemini = new GeminiClient();

async function ejecutarOrquestador() {
  const temaActual = "Microservicios vs Monolitos";

  console.log(`\n🚀 [Orquestador] Iniciando flujo de trabajo multi-agente...\n`);

  try {
    // --- AGENTE 1: INVESTIGADOR ---
    const agente1 = "AgenteInvestigador";
    await heart.pulse(agente1, "running", { tarea: "Recopilando datos", tema: temaActual });
    console.log(`[${agente1}] Investigando: "${temaActual}"...`);
    
    const resultadoInvestigacion = await gemini.generarLeccion(temaActual);
    
    await heart.pulse(agente1, "idle", { 
      aprobado: true, 
      tokensUsados: resultadoInvestigacion.tokens 
    });
    console.log(`✅ [${agente1}] Investigación completada.\n`);

    // --- AGENTE 2: REDACTOR ---
    const agente2 = "AgenteRedactor";
    await heart.pulse(agente2, "running", { tarea: "Formateando contenido" });
    console.log(`[${agente2}] Procesando la investigación para la lección final...`);
    
    // Simulamos un pequeño trabajo de formateo
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await heart.pulse(agente2, "idle", { 
      aprobado: true,
      ultimaAccion: "Lección empaquetada"
    });
    console.log(`✅ [${agente2}] Redacción finalizada.\n`);

    console.log(`🎉 [Orquestador] Flujo de trabajo completado exitosamente.`);

  } catch (error) {
    console.error(`🔴 [Orquestador] Falla crítica en la cadena de mando:`, error);
  }
}

ejecutarOrquestador();
