/**
 * Telemetry.js
 * Registra eventos de redirección para refinamiento constitucional.
 */
import fs from 'fs/promises';
import path from 'path';
import { GitHubStorage } from '../storage/GitHubStorage.js';

export const Telemetry = {
  /**
   * Registra un bloqueo o redirección en la SSoT (GitHub) con respaldo local.
   * @param {string} inputUsuario Entrada del usuario que provocó el bloqueo.
   * @param {string} razonBloqueo Explicación o regla constitucional activada.
   */
  registrarBloqueo: async (inputUsuario, razonBloqueo) => {
    const ahora = new Date();
    const timestampISO = ahora.toISOString();

    // Sanitizar timestamp para rutas seguras
    const safeFileName = timestampISO.replace(/:/g, '-');

    // Recortar input para proteger la memoria (límite 5KB)
    const sanitizedInput = typeof inputUsuario === 'string'
      ? inputUsuario.slice(0, 5000)
      : JSON.stringify(inputUsuario || '').slice(0, 5000);

    const logData = {
      timestamp: timestampISO,
      inputUsuario: sanitizedInput,
      razonBloqueo
    };

    const filePath = `logs/block-${safeFileName}.json`;
    const content = JSON.stringify(logData, null, 2);

    try {
      if (process.env.MOCK_TELEMETRY === 'true' || !process.env.GITHUB_TOKEN) {
        throw new Error("Modo local o GITHUB_TOKEN no configurado.");
      }

      await GitHubStorage.persistir(filePath, content, `log: telemetría de redirección (${safeFileName})`);
      console.log(`[Telemetry] Registro guardado en SSoT: ${filePath}`);
    } catch (error) {
      console.warn(`⚠️ [Telemetry] No se pudo guardar en SSoT (${error.message}). Guardando en almacenamiento local efímero...`);
      try {
        const cacheDir = path.resolve('.cache', 'telemetry-logs');
        await fs.mkdir(cacheDir, { recursive: true });
        await fs.writeFile(path.join(cacheDir, `block-${safeFileName}.json`), content, 'utf-8');
      } catch (_) {}
    }

    return logData;
  }
};

export default Telemetry;
