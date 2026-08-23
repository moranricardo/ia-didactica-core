/**
 * GitHubStorage.js
 * Interfaz exclusiva de persistencia en la nube (SSoT) mediante GitHub Contents API.
 */
export class GitHubStorage {
  /**
   * @param {string} repoOwner - Propietario del repositorio.
   * @param {string} repoName - Nombre del repositorio.
   */
  constructor(repoOwner, repoName) {
    this.token = process.env.GITHUB_TOKEN;
    this.baseUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents`;

    if (!this.token) {
      throw new Error("[Seguridad] GITHUB_TOKEN no está configurado en las variables de entorno.");
    }
  }

  /**
   * Cabeceras genéricas para las peticiones a la API de GitHub.
   */
  #getHeaders() {
    return {
      "Authorization": `Bearer ${this.token}`,
      "Accept": "application/vnd.github.v3+json",
      "Content-Type": "application/json",
      "User-Agent": "GitHubStorage-App"
    };
  }

  /**
   * Obtiene el SHA de un archivo si ya existe en el repositorio.
   * @param {string} url - URL completa del recurso.
   * @returns {Promise<string|null>} Retorna el SHA si existe, o null si es nuevo.
   */
  async #obtenerShaArchivo(url) {
    try {
      const res = await fetch(url, { headers: this.#getHeaders() });
      if (res.ok) {
        const data = await res.json();
        return data.sha || null;
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Guarda o actualiza un archivo en el repositorio (SSoT).
   * @param {string} path - Ruta del archivo en el repo (ej: 'data/config.json').
   * @param {string|object} contenido - String o JSON a almacenar.
   * @param {string} [mensajeCommit] - Mensaje opcional para el commit.
   * @returns {Promise<object>} Respuesta de la API de GitHub.
   */
  async guardarDato(path, contenido, mensajeCommit = `Update: ${path}`) {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const url = `${this.baseUrl}/${cleanPath}`;

    // Convertir objeto JSON a string formateado si es necesario
    const rawString = typeof contenido === 'object' 
      ? JSON.stringify(contenido, null, 2) 
      : String(contenido);

    // Codificación en Base64 compatible con UTF-8
    const contentBase64 = Buffer.from(rawString, 'utf-8').toString('base64');

    // Obtener SHA si el archivo ya existe (necesario para updates)
    const sha = await this.#obtenerShaArchivo(url);

    const payload = {
      message: mensajeCommit,
      content: contentBase64,
      ...(sha && { sha }) // Añade el campo sha solo si existe
    };

    console.log(`[GitHubStorage] Sincronizando con SSoT en: ${url}`);

    const res = await fetch(url, {
      method: "PUT",
      headers: this.#getHeaders(),
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(`[GitHubStorage Error ${res.status}]: ${errorData.message || res.statusText}`);
    }

    return await res.json();
  }

  /**
   * Obtiene y decodifica un archivo alojado en SSoT.
   * @param {string} path - Ruta del archivo en el repo.
   * @returns {Promise<{ content: string, rawData: object }>}
   */
  async obtenerDato(path) {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const url = `${this.baseUrl}/${cleanPath}`;

    const res = await fetch(url, { headers: this.#getHeaders() });

    if (!res.ok) {
      throw new Error(`[GitHubStorage Error ${res.status}]: No se pudo obtener ${cleanPath}`);
    }

    const data = await res.json();
    const decodedContent = Buffer.from(data.content, 'base64').toString('utf-8');

    return {
      content: decodedContent,
      rawData: data
    };
  }
}
