import { consultarIALocal } from './consultarLocal.js';

export async function obtenerRespuestaResiliente(prompt, llamarGeminiAPI, cache) {
  // 1. Verificar en Caché Local
  if (cache && cache.buscar) {
    const cached = cache.buscar(prompt);
    if (cached) return cached;
  }

  // 2. Intentar API en la nube
  try {
    const respuesta = await llamarGeminiAPI(prompt);
    if (respuesta) return respuesta;
  } catch (err) {
    console.log("\n🔴 [Red/Cuota] Petición a la nube fallida. Evaluando servidor local...");
  }

  // 3. Intentar Servidor Local (Ollama / Local)
  const respLocal = await consultarIALocal(prompt);
  if (respLocal) {
    console.log("\n🟢 [IA Local] Respuesta generada mediante servidor local.");
    return respLocal;
  }

  // 4. Contingencia si no hay servidor local corriendo
  return "⚠️ [Modo Offline] Sin conexión a internet y el servidor local no está activo. Revisa tu red o inicia tu modelo local.";
}
