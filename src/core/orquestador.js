import { consultarCache, guardarEnCache } from "./cache.js";
import { consultarLocal } from "./consultarLocal.js";
import { consultarCloud } from "./consultarCloud.js";
import { AgenteCritico } from "../agents/AgenteCritico.js";

export async function ejecutarConsulta(prompt) {
  // 1. Revisar Caché
  const cached = await consultarCache(prompt);
  if (cached) return { fuente: "cache", respuesta: cached };

  // 2. Intentar Modelo Local
  let respuestaRaw = await consultarLocal(prompt);
  let fuente = "local";

  // 3. Fallback a Nube
  if (!respuestaRaw) {
    respuestaRaw = await consultarCloud(prompt);
    fuente = "nube";
  }

  if (!respuestaRaw) {
    return { fuente: "error", respuesta: "No se pudo generar una respuesta." };
  }

  // 4. Auditoría Constitucional (AgenteCritico)
  const auditoria = await AgenteCritico.auditarRespuesta(prompt, respuestaRaw);

  if (auditoria.aprobado) {
    // Guardar en caché solo respuestas validadas por la constitución
    await guardarEnCache(prompt, auditoria.respuestaFinal);
    return { fuente, respuesta: auditoria.respuestaFinal, auditoria: auditoria.observaciones };
  } else {
    return { fuente: "rechazado", respuesta: "Respuesta no aprobada por la Evaluación Constitucional.", detalles: auditoria.observaciones };
  }
}

export async function ejecutarLeccion(tema, nivel = "intermedio") {
  const promptEspecializado = `Actúa como un tutor pedagógico experto. Genera una lección estructurada sobre: "${tema}" adaptada para nivel ${nivel}. Incluye ejemplos prácticos y una pequeña autoevaluación al final.`;
  return await ejecutarConsulta(promptEspecializado);
}
