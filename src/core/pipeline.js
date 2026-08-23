import { AgenteCritico } from './AgenteCritico.js';
import { GeminiClient } from './GeminiClient.js';
import consultarLocal from './consultarLocal.js';

const constitucionApp = "El sistema solo debe proporcionar información sobre herramientas de productividad y tecnología didáctica.";

export default async function pipeline(prompt) {
  try {
    console.log(`🚀 [Pipeline] Procesando prompt: "${prompt}"`);

    let respuestaRaw = null;
    let origen = "local";

    try {
      respuestaRaw = await consultarLocal(prompt);
    } catch (localError) {
      console.warn(`⚠️ [Pipeline] Error en servidor local (${localError.message}). Alternando a Nube (Gemini)...`);
      const clienteCloud = new GeminiClient();
      const resCloud = await clienteCloud.generarLeccion(prompt);
      respuestaRaw = resCloud.texto;
      origen = "cloud";
    }

    let auditoria = null;
    try {
      const clienteIA = new GeminiClient();
      const agente = new AgenteCritico(clienteIA, constitucionApp);
      auditoria = await agente.evaluarRespuesta(prompt, respuestaRaw);
    } catch (e) {
      console.warn(`⚠️ [Pipeline] Omitiendo auditoría crítica por fallo: ${e.message}`);
    }

    return {
      prompt,
      respuesta: respuestaRaw,
      origen,
      auditoria: auditoria || { aprobado: true, razon: "Aprobado por defecto / Auditoría omitida" }
    };
  } catch (error) {
    console.error(`🔴 [Pipeline] Fallo catastrófico: ${error.message}`);
    return {
      prompt,
      error: error.message,
      respuesta: "[Modo Offline] No fue posible procesar la solicitud en local ni en la nube."
    };
  }
}
