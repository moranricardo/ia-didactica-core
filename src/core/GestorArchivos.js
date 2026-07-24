import fs from 'fs/promises';
import path from 'path';

export class GestorArchivos {
  constructor(directorioBase = './lecciones') {
    this.directorioBase = directorioBase;
  }

  async inicializar() {
    try {
      // Crea la carpeta si no existe
      await fs.mkdir(this.directorioBase, { recursive: true });
    } catch (error) {
      console.error("[GestorArchivos] Error al crear el directorio base:", error.message);
    }
  }

  async guardarLeccion(tema, contenido) {
    await this.inicializar();
    
    // Formatear el nombre del archivo: "redes-neuronales-1721759250000.json"
    const nombreSeguro = tema.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    const timestamp = Date.now();
    const nombreArchivo = `${nombreSeguro}-${timestamp}.json`;
    const rutaAbsoluta = path.join(this.directorioBase, nombreArchivo);

    const datosAGuardar = {
      tema,
      aprobadoEn: new Date().toISOString(),
      contenidoFinal: contenido
    };

    try {
      await fs.writeFile(rutaAbsoluta, JSON.stringify(datosAGuardar, null, 2), 'utf-8');
      console.log(`[GestorArchivos] 💾 Archivo guardado con éxito: ${rutaAbsoluta}`);
      return rutaAbsoluta;
    } catch (error) {
      console.error("[GestorArchivos] ❌ Error al guardar el archivo:", error.message);
      throw error;
    }
  }
}
