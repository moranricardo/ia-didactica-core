/**
 * Telemetry.js
 * Registra eventos de redirección para refinamiento constitucional.
 */
import { GitHubStorage } from '../storage/GitHubStorage.js';

export const Telemetry = {
  registrarBloqueo: async (inputUsuario, razonBloqueo) => {
    const timestamp = new Date().toISOString();
    const logData = { timestamp, inputUsuario, razonBloqueo };
    // Usamos GitHubStorage para persistir el log en la SSoT
    await GitHubStorage.persistir(`logs/${timestamp}.json`, JSON.stringify(logData), "log: telemetría de redirección");
    console.log("[Telemetry] Registro de redirección guardado en SSoT.");
  }
};
