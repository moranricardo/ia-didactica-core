import fs from 'fs/promises';
import path from 'path';

export class GestorArchivos {
  constructor(directorioBase = './lecciones') {
    this.directorioBase = directorioBase;
  }

  async inicializar() {
    try {
      await fs.mkdir(this.directorioBase, { recursive: true });
    } catch (error) {
      console.error("[GestorArchivos] Error al verificar/crear directorio base:", error.message);
    }
  }

  _crearSlug(texto) {
    return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async guardarLeccion(tema, contenido, formato = 'json') {
    await this.inicializar();

    const nombreSeguro = this._crearSlug(tema);
    const timestamp = Date.now();
    const extension = formato === 'md' ? 'md' : 'json';
    const nombreArchivo = `${nombreSeguro}-${timestamp}.${extension}`;
    const rutaAbsoluta = path.join(this.directorioBase, nombreArchivo);

    try {
      if (formato === 'md') {
        await fs.writeFile(rutaAbsoluta, contenido, 'utf-8');
      } else {
        const datosAGuardar = {
          tema,
          aprobadoEn: new Date().toISOString(),
          contenidoFinal: contenido
        };
        await fs.writeFile(rutaAbsoluta, JSON.stringify(datosAGuardar, null, 2), 'utf-8');
      }

      console.log(`[GestorArchivos] 💾 Lección guardada con éxito: ${rutaAbsoluta}`);
      return rutaAbsoluta;
    } catch (error) {
      console.error("[GestorArchivos] ❌ Error al escribir el archivo:", error.message);
      throw error;
    }
  }
}
