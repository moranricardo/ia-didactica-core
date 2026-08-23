import { GeminiClient } from './GeminiClient.js';
import { WorkspaceCache } from './workspaceCache.js';
import { TelemetryHeart } from './telemetryHeart.js';
import { GestorArchivos } from './gestorArchivos.js';

export async function ejecutarOrquestador(tema = "Arquitectura de Microservicios") {
  console.log(`🚀 [Orquestador] Iniciando procesamiento para: ${tema}`);

  const cache = new WorkspaceCache();
  const telemetry = new TelemetryHeart();
  const gemini = new GeminiClient();
  const gestor = new GestorArchivos();

  await telemetry.pulse("orquestador", "running", { tema }).catch(() => {});

  try {
    const cachedData = await cache.obtener(tema);
    if (cachedData) {
      console.log(`⚡ [Orquestador] Contenido cargado desde caché.`);
      await gestor.guardarLeccion(tema, cachedData.texto || cachedData, 'md');
      await telemetry.pulse("orquestador", "success", { tema, origen: "cache" }).catch(() => {});
      return cachedData;
    }
  } catch (cacheError) {
    console.warn(`⚠️ [Orquestador] Error al leer caché, continuando con generación directa: ${cacheError.message}`);
  }

  try {
    const resultado = await gemini.generarLeccion(tema);
    
    await cache.guardar(tema, resultado).catch(() => {});
    await gestor.guardarLeccion(tema, resultado.texto, 'md');
    await gestor.guardarLeccion(tema, resultado, 'json');
    
    await telemetry.pulse("orquestador", "success", { tema, origen: "gemini", modelo: resultado.modeloUsado }).catch(() => {});
    return resultado;
  } catch (error) {
    console.error(`🔴 [Orquestador] Error durante la ejecución: ${error.message}`);
    await telemetry.pulse("orquestador", "failed", { tema, error: error.message }).catch(() => {});
    throw error;
  }
}

if (process.argv[1]?.toLowerCase().endsWith('orquestador.js')) {
  const temaInput = process.argv[2] || "Arquitectura de Microservicios";
  ejecutarOrquestador(temaInput).catch(err => {
    console.error("🔴 Error fatal en CLI:", err.message);
    process.exit(1);
  });
}

export default ejecutarOrquestador;
