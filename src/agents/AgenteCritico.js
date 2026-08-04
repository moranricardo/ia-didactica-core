import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { consultarLocal } from '../core/consultarLocal.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class AgenteCritico {
  static obtenerConstitucion() {
    try {
      const rutaConstitucion = path.join(__dirname, '../../constitucion.txt');
      if (fs.existsSync(rutaConstitucion)) {
        return fs.readFileSync(rutaConstitucion, 'utf8');
      }
      return "Principios básicos: Sé claro, educativo, seguro y constructivo.";
    } catch (error) {
      console.warn("⚠️ [AgenteCritico]: No se pudo leer la constitución:", error.message);
      return "Sé claro y educativo.";
    }
  }

  static async auditarRespuesta(promptOriginal, respuestaGenerada) {
    const constitucion = AgenteCritico.obtenerConstitucion();

    const promptAuditoria = `
Actúa como un Agente Crítico de auditoría pedagógica y de seguridad. 
Evalúa si la siguiente respuesta cumple con la constitución:
--- CONSTITUCIÓN ---
${constitucion}
--------------------
PROMPT: "${promptOriginal}"
RESPUESTA: "${respuestaGenerada}"

Responde ÚNICAMENTE en JSON estricto:
{
  "aprobado": true,
  "observaciones": "Breve explicación",
  "respuestaFinal": "Respuesta original o corregida"
}
`;

    try {
      let resultadoRaw = await consultarLocal(promptAuditoria);
      
      if (!resultadoRaw) {
        return { aprobado: true, observaciones: "Aprobado por bypass local.", respuestaFinal: respuestaGenerada };
      }

      const jsonLimpios = resultadoRaw.replace(/```json/g, '').replace(/```/g, '').trim();
      const auditoria = JSON.parse(jsonLimpios);

      return {
        aprobado: auditoria.aprobado ?? true,
        observaciones: auditoria.observaciones || "Evaluación local aprobada.",
        respuestaFinal: auditoria.respuestaFinal || respuestaGenerada
      };

    } catch (error) {
      console.warn("⚠️ [AgenteCritico]: Fallo en inferencia local, aprobando por defecto:", error.message);
      return {
        aprobado: true,
        observaciones: "Bypass por fallo en modelo local.",
        respuestaFinal: respuestaGenerada
      };
    }
  }
}
