import { consultarLocal } from './consultarLocal.js';

export async function obtenerRespuestaResiliente(prompt, llamarGeminiAPI, cache) {
  if (cache) {
    try {
      const fnBuscar = cache.consultarCache || cache.buscar || cache.obtener;
      if (typeof fnBuscar === 'function') {
        const cached = await fnBuscar.call(cache, prompt);
        if (cached) return cached;
      }
    } catch (e) {
      // Continuar si falla la caché
    }
  }

  try {
    const respuesta = await llamarGeminiAPI(prompt);
    if (respuesta) return respuesta;
    console.log("\n🔴 [Red/Cuota] La API en la nube no devolvió respuesta. Evaluando servidor local...");
  } catch (err) {
    console.log("\n🔴 [Red/Cuota] Petición a la nube fallida. Evaluando servidor local...");
  }

  try {
    const respLocal = await consultarLocal(prompt);
    if (respLocal) {
      console.log("\n🟢 [IA Local] Respuesta generada mediante servidor local.");
      return respLocal;
    }
  } catch (e) {
    // Continuar a contingencia
  }

  return "⚠️ [Modo Offline] Sin conexión a internet y el servidor local no está activo. Revisa tu red o inicia tu modelo local.";
}

export default obtenerRespuestaResiliente;
