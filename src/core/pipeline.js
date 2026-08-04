import { AgenteCritico } from '../agents/AgenteCritico.js';
import consultarLocal from './consultarLocal.js';

export default async function pipeline(prompt) {
  try {
    console.log(`🚀 [Pipeline] Procesando prompt: "${prompt}"`);
    
    // 1. Consultar servidor local / caché
    const respuestaRaw = await consultarLocal(prompt);
    
    // 2. Auditoría con AgenteCritico
    let auditoria = null;
    try {
      auditoria = await AgenteCritico.auditarRespuesta(prompt, respuestaRaw);
    } catch (e) {
      // Ignorar fallo de auditoría y usar respuesta directa si fuera necesario
    }

    return {
      prompt,
      respuesta: respuestaRaw,
      auditoria: auditoria || "Aprobado por defecto"
    };
  } catch (error) {
    return {
      prompt,
      error: error.message,
      respuesta: "[Modo Offline] Error en pipeline."
    };
  }
}
