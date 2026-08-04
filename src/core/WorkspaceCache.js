import fs from 'fs';
import path from 'path';

export class WorkspaceCache {
  constructor(cacheDir = "./cache") {
    this.cacheDir = cacheDir;
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  _getFilePath(key) {
    const safeName = key.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    return path.join(this.cacheDir, `${safeName}.json`);
  }

  obtener(key) {
    const filePath = this._getFilePath(key);
    if (fs.existsSync(filePath)) {
      try {
        const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
        console.log(`⚡ [WorkspaceCache] Recuperado desde caché local (Ahorro de cuota): ${key}`);
        return data;
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  guardar(key, resultado) {
    const filePath = this._getFilePath(key);
    fs.writeFileSync(filePath, JSON.stringify(resultado, null, 2), "utf8");
  }
}
