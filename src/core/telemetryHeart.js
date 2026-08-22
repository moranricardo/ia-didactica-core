import { Octokit } from "@octokit/rest";

export class TelemetryHeart {
  constructor() {
    this.token = process.env.GITHUB_TOKEN;
    this.octokit = this.token ? new Octokit({ auth: this.token }) : null;
    this.owner = "moranricardo";
    this.repo = "ia-didactica-core";
    this.path = "telemetry/state.json";
    this.cache = null;
    this.lastSha = null;
  }

  async read() {
    if (!this.octokit) return { agents: {}, lastPulse: null };
    try {
      const { data } = await this.octokit.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path: this.path,
        headers: { 'If-None-Match': '' }
      });
      this.lastSha = data.sha;
      const contenido = Buffer.from(data.content, 'base64').toString('utf-8');
      this.cache = JSON.parse(contenido);
      return this.cache;
    } catch (error) {
      console.warn("⚠️ [TelemetryHeart] No se pudo leer el SSoT remoto, inicializando estado vacío.");
      return { agents: {}, lastPulse: null };
    }
  }

  async pulse(agent, status, metrics = {}, retries = 3) {
    if (process.env.MOCK_TELEMETRY === 'true' || !this.octokit) {
      return this.mockPulse(agent, status, metrics);
    }
    try {
      const state = await this.read();
      state.agents[agent] = {
        status,
        lastPulse: new Date().toISOString(),
        ...metrics
      };
      state.lastPulse = new Date().toISOString();

      if (Object.keys(state.agents).length > 50) throw new Error("Exceso de agentes registrados en estado.");

      await this.octokit.repos.createOrUpdateFileContents({
        owner: this.owner,
        repo: this.repo,
        path: this.path,
        message: `pulse: 💓 ${agent} -> ${status}`,
        content: Buffer.from(JSON.stringify(state, null, 2)).toString('base64'),
        sha: this.lastSha
      });
      console.log(`💓 [TelemetryHeart] Pulso registrado: ${agent} (${status})`);
      return state;
    } catch (error) {
      if (error.status === 409 && retries > 0) {
        console.log(`⚠️ [TelemetryHeart] Colisión SHA en GitHub. Reintentando (${retries})...`);
        await new Promise(r => setTimeout(r, 1000));
        return this.pulse(agent, status, metrics, retries - 1);
      }
      console.error(`🔴 [TelemetryHeart] Error en pulso: ${error.message}`);
      throw error;
    }
  }

  mockPulse(agent, status, metrics = {}) {
    console.log(`💓 [TelemetryHeart] MOCK LOCAL: ${agent} -> ${status}`);
    return { mock: true, agent, status, timestamp: new Date().toISOString() };
  }
}
