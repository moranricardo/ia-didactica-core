import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import { createHash } from 'crypto';

export class ManifestSigner {
  constructor(customPath = null) {
    this.defaultPaths = [
      path.resolve('knowledge_graph/system_manifest.json'),
      path.resolve('config/manifest.json'),
      path.resolve('manifest.json')
    ];
    this.manifestPath = this._locateManifest(customPath);
  }

  _locateManifest(customPath) {
    if (customPath) {
      const resolved = path.resolve(customPath);
      if (fs.existsSync(resolved)) return resolved;
      throw new Error(`No se encontró el manifiesto en la ruta especificada: ${resolved}`);
    }

    for (const p of this.defaultPaths) {
      if (fs.existsSync(p)) return p;
    }

    throw new Error('No se pudo localizar ningún archivo de manifiesto en las rutas predeterminadas.');
  }

  _calculateSHA256(filePath) {
    return new Promise((resolve, reject) => {
      const hash = createHash('sha256');
      const stream = fs.createReadStream(filePath);

      stream.on('data', (data) => hash.update(data));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', (err) => reject(err));
    });
  }

  async updateManifest() {
    console.log(`[INFO] Leyendo manifiesto en: ${this.manifestPath}`);

    const rawData = await fsp.readFile(this.manifestPath, 'utf-8');
    const data = JSON.parse(rawData);

    const keys = ['archivos', 'nodos', 'verified_files'];
    const fileKey = keys.find((k) => Array.isArray(data[k]));

    if (!fileKey) {
      throw new Error("No se encontró una clave válida de archivos ('archivos', 'nodos', 'verified_files') en el manifiesto.");
    }

    const baseDir = path.dirname(this.manifestPath);
    let updatedCount = 0;

    for (const item of data[fileKey]) {
      const pathStr = typeof item === 'object' && item !== null ? (item.path || item.ruta) : item;

      if (!pathStr) continue;

      const targetPath = path.isAbsolute(pathStr) ? pathStr : path.join(baseDir, pathStr);

      if (fs.existsSync(targetPath) && fs.statSync(targetPath).isFile()) {
        const fileHash = await this._calculateSHA256(targetPath);

        if (typeof item === 'object' && item !== null) {
          item.hash = fileHash;
        }

        console.log(`  [OK] Actualizado hash para: ${pathStr}`);
        updatedCount++;
      } else {
        console.warn(`  [WARN] Archivo no encontrado en disco: ${targetPath}`);
      }
    }

    await fsp.writeFile(this.manifestPath, JSON.stringify(data, null, 4), 'utf-8');
    console.log(`\n[ÉXITO] Manifiesto actualizado correctamente. ${updatedCount} archivos procesados.`);
    return data;
  }
}

if (process.argv[1]?.toLowerCase().endsWith('signer.js')) {
  try {
    const signer = new ManifestSigner();
    signer.updateManifest().catch((e) => console.error(`[ERROR] Fallo al firmar manifiesto: ${e.message}`));
  } catch (e) {
    console.error(`[ERROR] Inicialización fallida: ${e.message}`);
  }
}

export default ManifestSigner;
