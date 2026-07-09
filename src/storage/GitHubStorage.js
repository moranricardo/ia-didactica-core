/**
 * GitHubStorage.js
 * Interfaz exclusiva de persistencia en la nube (SSoT)
 */
export class GitHubStorage {
  constructor(repoOwner, repoName) {
    // Inyección segura por variable de entorno en Termux
    this.token = process.env.GITHUB_TOKEN; 
    this.baseUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents`;

    if (!this.token) {
      throw new Error("[Seguridad] GITHUB_TOKEN no configurado en el entorno de Termux.");
    }
  }

  async guardarDato(path, contenido, mensajeCommit) {
    // Implementación de fetch hacia la API de GitHub usando el Bearer Token
    // Evita escribir cualquier archivo temporal en el almacenamiento local
    const url = `${this.baseUrl}/${path}`;
    
    // Aquí iría la lógica del fetch para actualizar/crear el archivo en la SSoT
    console.log(`[GitHubStorage] Sincronizando con SSoT en: ${url}`);
  }
}
