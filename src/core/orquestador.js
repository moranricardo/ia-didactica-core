import { TelemetryHeart } from "./TelemetryHeart.js";
import { GeminiClient } from "./GeminiClient.js";
import { AgenteRedactor } from "./AgenteRedactor.js";

const heart = new TelemetryHeart();
const gemini = new GeminiClient();
const redactor = new AgenteRedactor();

async function ejecutarOrquestador() {
  const temaActual = "Microservicios vs Monolitos";
  console.log(`\n🚀 [Orquestador] Iniciando flujo multi-agente de escritura...\n`);

  try {
    // --- 1. INVESTIGADOR ---
    await heart.pulse("AgenteInvestigador", "running", { tema: temaActual });
    console.log(`[AgenteInvestigador] Investigando: "${temaActual}"...`);
    
    const resultado = await gemini.generarLeccion(temaActual);
    
    await heart.pulse("AgenteInvestigador", "idle", { tokensUsados: resultado.tokens });
    console.log(`✅ [AgenteInvestigador] Investigación completada.\n`);

    // --- 2. REDACTOR ---
    await heart.pulse("AgenteRedactor", "running", { tarea: "Escribiendo .md" });
    console.log(`[AgenteRedactor] Empaquetando y enviando a GitHub...`);
    
    const contenidoMarkdown = `# Lección: ${temaActual}\n\n${resultado.texto}\n\n---\n*Generado automáticamente por la flota de IA Didáctica.*`;
    const rutaArchivo = "lecciones/microservicios-vs-monolitos.md";
    
    await redactor.redactarYGuardar(temaActual, contenidoMarkdown, rutaArchivo);
    
    await heart.pulse("AgenteRedactor", "idle", { ultimaAccion: rutaArchivo });
    console.log(`✅ [AgenteRedactor] Redacción finalizada.\n`);

    console.log(`🎉 [Orquestador] Ciclo completado. Todo sincronizado en GitHub.`);

  } catch (error) {
    console.error(`🔴 [Orquestador] Falla crítica:`, error);
  }
}

ejecutarOrquestador();
