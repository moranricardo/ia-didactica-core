import { Octokit } from "@octokit/rest";
import fs from 'fs/promises';
import path from 'path';

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
      if (error.status === 404) {
        console.warn("⚠️ [TelemetryHeart] Archivo de telemetría no encontrado en GitHub. Se creará en el próximo pulso.");
        this.lastSha = null;
      } else {
        console.warn(`⚠️ [TelemetryHeart] No se pudo leer el SSoT remoto (${error.message}). Usando estado base.`);
      }
      return { agents: {}, lastPulse: null };
    }
  }

  async pulse(agent, status, metrics = {}, retries = 3) {
    if (process.env.MOCK_TELEMETRY === 'true' || !this.octokit) {
      return this.mockPulse(agent, status, metrics);
    }
    try {
      const state = await this.read();
      
      if (!state.agents) state.agents = {};

      state.agents[agent] = {
        status,
        lastPulse: new Date().toISOString(),
        ...metrics
      };
      state.lastPulse = new Date().toISOString();

      if (Object.keys(state.agents).length > 50) {
        throw new Error("Exceso de agentes registrados en el estado de telemetría.");
      }

      const payload = {
        owner: this.owner,
        repo: this.repo,
        path: this.path,
        message: `pulse: 💓 ${agent} -> ${status}`,
        content: Buffer.from(JSON.stringify(state, null, 2)).toString('base64')
      };

      if (this.lastSha) {
        payload.sha = this.lastSha;
      }

      const { data } = await this.octokit.repos.createOrUpdateFileContents(payload);
      this.lastSha = data.content?.sha || null;

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

  async mockPulse(agent, status, metrics = {}) {
    console.log(`💓 [TelemetryHeart] MOCK LOCAL: ${agent} -> ${status}`);
    const mockState = {
      mock: true,
      agent,
      status,
      metrics,
      timestamp: new Date().toISOString()
    };

    try {
      const cacheDir = path.resolve('.cache');
      await fs.mkdir(cacheDir, { recursive: true });
      await fs.writeFile(
        path.join(cacheDir, 'telemetry-mock.json'), 
        JSON.stringify(mockState, null, 2), 
        'utf-8'
      );
    } catch (_) {}

    return mockState;
  }
}

export default TelemetryHeart;
