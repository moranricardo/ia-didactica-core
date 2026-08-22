import fs from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';

export class WorkspaceCache {
  constructor(cacheDir = "./cache", ttlHoras = 24) {
    this.cacheDir = cacheDir;
    this.ttlMs = ttlHoras * 60 * 60 * 1000;
    if (!existsSync(this.cacheDir)) {
      mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  _getFilePath(key) {
    const safeName = key.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    return path.join(this.cacheDir, `${safeName}.json`);
  }

  async obtener(key) {
    const filePath = this._getFilePath(key);
    if (!existsSync(filePath)) return null;

    try {
      const contenido = await fs.readFile(filePath, "utf8");
      const payload = JSON.parse(contenido);

      if (payload.timestamp && (Date.now() - payload.timestamp > this.ttlMs)) {
        console.log(`⌛ [WorkspaceCache] Entrada expirada para: ${key}`);
        await fs.unlink(filePath).catch(() => {});
        return null;
      }

      console.log(`⚡ [WorkspaceCache] Recuperado de caché local (Ahorro de cuota): ${key}`);
      return payload.data;
    } catch (e) {
      return null;
    }
  }

  async guardar(key, resultado) {
    const filePath = this._getFilePath(key);
    const payload = {
      timestamp: Date.now(),
      data: resultado
    };
    try {
      await fs.writeFile(filePath, JSON.stringify(payload, null, 2), "utf8");
    } catch (error) {
      console.error(`[WorkspaceCache] Error guardando en caché: ${error.message}`);
    }
  }
}
