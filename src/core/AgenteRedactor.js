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

      console.log(`[AgenteRedactor] ☁️ Ejecutando push automático a GitHub...`);
      
      // Auto-commit y push a la rama principal
      await execAsync(`git add "${rutaRelativa}"`);
      await execAsync(`git commit -m "docs(lecciones): generacion automatica de '${tema}' [ia-auto]"`);
      await execAsync(`git push origin main`);

      console.log(`[AgenteRedactor] ✅ Lección consolidada en la nube de forma segura.`);
      return true;
    } catch (error) {
      if (error.stdout?.includes("nothing to commit") || error.stderr?.includes("nothing to commit")) {
         console.log(`[AgenteRedactor] ⚠️ El archivo ya estaba sincronizado o sin cambios.`);
         return true;
      }
      console.error(`[AgenteRedactor] ❌ Error en sincronización con GitHub:`, error.message);
      return false;
    }
  }
}
