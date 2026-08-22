import { GeminiClient } from './geminiClient.js';
import { WorkspaceCache } from './workspaceCache.js';
import { TelemetryHeart } from './telemetryHeart.js';
import { GestorArchivos } from './gestorArchivos.js';

export async function ejecutarOrquestador(tema = "Arquitectura de Microservicios") {
  console.log(`🚀 [Orquestador] Iniciando procesamiento para: ${tema}`);
  
  const cache = new WorkspaceCache();
  const telemetry = new TelemetryHeart();
  const gemini = new GeminiClient();
  const gestor = new GestorArchivos();

  await telemetry.pulse("orquestador", "running", { tema });

  // 1. Verificar caché
  const cachedData = await cache.obtener(tema);
  if (cachedData) {
    console.log(`⚡ [Orquestador] Contenido cargado desde caché.`);
    await gestor.guardarLeccion(tema, cachedData.texto || cachedData, 'md');
    await telemetry.pulse("orquestador", "success", { tema, origen: "cache" });
    return cachedData;
  }

  // 2. Generar con Gemini
  try {
    const resultado = await gemini.generarLeccion(tema);
    await cache.guardar(tema, resultado);
    await gestor.guardarLeccion(tema, resultado.texto, 'md');
    await telemetry.pulse("orquestador", "success", { tema, origen: "gemini" });
    return resultado;
  } catch (error) {
    console.error(`🔴 [Orquestador] Error durante la ejecución: ${error.message}`);
    await telemetry.pulse("orquestador", "failed", { tema, error: error.message });
    throw error;
  }
}

// Ejecución directa por CLI o GitHub Actions
if (process.argv[1]?.endsWith('orquestador.js')) {
  const temaInput = process.argv[2] || "Arquitectura de Microservicios";
  ejecutarOrquestador(temaInput).catch(err => {
    console.error("🔴 Error fatal en CLI:", err.message);
    process.exit(1);
  });
}
