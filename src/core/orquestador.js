import { TelemetryHeart } from "./TelemetryHeart.js";
import { GeminiClient } from "./GeminiClient.js";

const heart = new TelemetryHeart();
const gemini = new GeminiClient();

async function ejecutarOrquestador() {
  const nombreAgente = "AgenteCritico";
  const temaActual = "Inyección de dependencias en arquitecturas limpias";

  try {
    // 1. Reportar inicio
    await heart.pulse(nombreAgente, "running", { 
      tarea: "Inferencia IA",
      tema: temaActual 
    });
    console.log(`\n[Orquestador] ${nombreAgente} consultando a Gemini sobre: "${temaActual}"...`);

    // 2. Ejecutar inferencia midiendo el tiempo
    const inicio = Date.now();
    const resultado = await gemini.generarLeccion(temaActual);
    const tiempoInferencia = Date.now() - inicio;

    console.log(`\n📖 Respuesta de Gemini:\n${resultado.texto}\n`);

    // 3. Reportar éxito con métricas dinámicas
    await heart.pulse(nombreAgente, "idle", { 
      aprobado: true,
      ultimaAccion: "Lección generada",
      tokensUsados: resultado.tokens,
      tiempoMs: tiempoInferencia
    });
    console.log(`[Orquestador] Trabajo finalizado. Telemetría enviada a GitHub.\n`);

  } catch (error) {
    // 4. Reportar fallo
    await heart.pulse(nombreAgente, "error", { error: error.message });
    console.error(`🔴 [Orquestador] Falla crítica:`, error);
  }
}

ejecutarOrquestador();
