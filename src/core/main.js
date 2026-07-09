import { AgenteCritico } from './src/core/AgenteCritico.js';
import { GitHubStorage } from './GitHubStorage.js';

const token = process.env.GITHUB_TOKEN;
const geminiKey = process.env.GEMINI_API_KEY;
const storage = new GitHubStorage(token, 'moranricardo', 'ia-didactica-core');
const constitucionApp = "El sistema solo debe proporcionar información sobre herramientas de productividad.";

const tuClienteIA = {
  generarTexto: async (prompt) => {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }
};

const agente = new AgenteCritico(tuClienteIA, constitucionApp);

async function sincronizar() {
  try {
    const res = await storage.save('Constitucion.txt', constitucionApp, 'Sync: Actualización vía POD v1.0');
    console.log('Sincronización SSoT exitosa.');
  } catch (err) {
    console.error('Error de persistencia:', err);
  }
}

sincronizar();
console.log("Sistema IA Didáctica v1.0 operativo.");

