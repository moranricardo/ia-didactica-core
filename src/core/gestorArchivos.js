import fs from 'fs/promises';
import path from 'path';

export class GestorArchivos {
  constructor(directorioBase = './lecciones') {
    this.directorioBase = path.resolve(directorioBase);
  }

  async inicializar() {
    try {
      await fs.mkdir(this.directorioBase, { recursive: true });
    } catch (error) {
      console.error("[GestorArchivos] ❌ Error crítico al crear directorio base:", error.message);
      throw error;
    }
  }

  _crearSlug(texto) {
    if (!texto) return 'leccion-sin-titulo';
    return texto
      .toString()
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
    const esMarkdown = formato.toLowerCase() === 'md';
    const extension = esMarkdown ? 'md' : 'json';
    const nombreArchivo = `${nombreSeguro}-${timestamp}.${extension}`;
    const rutaAbsoluta = path.join(this.directorioBase, nombreArchivo);

    try {
      if (esMarkdown) {
        const textoMD = typeof contenido === 'string' ? contenido : JSON.stringify(contenido, null, 2);
        await fs.writeFile(rutaAbsoluta, textoMD, 'utf-8');
      } else {
        const datosAGuardar = {
          tema,
          aprobadoEn: new Date().toISOString(),
          contenidoFinal: typeof contenido === 'string' ? contenido : contenido
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

export default GestorArchivos;
