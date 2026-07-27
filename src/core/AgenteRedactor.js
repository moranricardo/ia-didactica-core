import { Octokit } from "@octokit/rest";

export class AgenteRedactor {
  constructor() {
    this.token = process.env.GITHUB_TOKEN;
    this.octokit = this.token ? new Octokit({ auth: this.token }) : null;
    this.owner = "moranricardo";
    this.repo = "ia-didactica-core";
  }

  async redactarYGuardar(tema, contenido, rutaArchivo) {
    if (!this.octokit) {
      console.log(`⚠️ [AgenteRedactor] MOCK LOCAL - Se guardaría en ${rutaArchivo}:\n${contenido}`);
      return;
    }

    const contentEncoded = Buffer.from(contenido).toString('base64');
    let sha = null;

    try {
      // Intentamos leer el archivo para obtener su SHA (por si ya existe y vamos a sobrescribir)
      const { data } = await this.octokit.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path: rutaArchivo,
      });
      sha = data.sha;
    } catch (error) {
      // El error 404 es esperado si el archivo es completamente nuevo
      if (error.status !== 404) throw error;
    }

    await this.octokit.repos.createOrUpdateFileContents({
      owner: this.owner,
      repo: this.repo,
      path: rutaArchivo,
      message: `docs(lecciones): generar leccion sobre ${tema} [ia-auto]`,
      content: contentEncoded,
      sha: sha
    });

    console.log(`✅ [AgenteRedactor] Archivo escrito en GitHub: ${rutaArchivo}`);
  }
}
