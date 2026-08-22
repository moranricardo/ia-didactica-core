import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

export class AgenteRedactor {
  async redactarYGuardar(tema, contenido, rutaRelativa) {
    try {
      console.log(`[AgenteRedactor] 📝 Escribiendo buffer local en: ${rutaRelativa}`);

      const rutaAbsoluta = path.resolve(process.cwd(), rutaRelativa);
      await fs.mkdir(path.dirname(rutaAbsoluta), { recursive: true });
      await fs.writeFile(rutaAbsoluta, contenido, 'utf-8');

      console.log(`[AgenteRedactor] ☁️ Sincronizando lección con GitHub...`);

      const rutaLimpia = rutaRelativa.replace(/"/g, '\\"');
      const mensajeCommit = `docs(lecciones): generación automática de '${tema}' [ia-auto]`.replace(/"/g, '\\"');

      await execAsync(`git add "${rutaLimpia}"`);
      await execAsync(`git commit -m "${mensajeCommit}"`);
      await execAsync(`git pull --rebase origin main`);
      await execAsync(`git push origin main`);

      console.log(`[AgenteRedactor] ✅ Lección consolidada y subida con éxito.`);
      return true;
    } catch (error) {
      if (error.stdout?.includes("nothing to commit") || error.stderr?.includes("nothing to commit")) {
         console.log(`[AgenteRedactor] ⚠️ El archivo ya estaba actualizado sin cambios pendientes.`);
         return true;
      }
      console.error(`[AgenteRedactor] ❌ Error durante la sincronización Git:`, error.message);
      return false;
    }
  }
}
