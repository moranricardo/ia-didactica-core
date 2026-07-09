import { AgenteCritico } from './src/core/AgenteCritico.js';
import { GitHubStorage } from './GitHubStorage.js';

const tuClienteIA = {
  generarTexto: async (prompt) => {
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }
};

const agente = new AgenteCritico(tuClienteIA, "Solo herramientas de productividad.");
const storage = new GitHubStorage(process.env.GITHUB_TOKEN, 'moranricardo', 'ia-didactica-core');

const nuevaHerramienta = { "tag": "obsidian", "name": "Obsidian", "desc": "Gestión de conocimiento.", "stats": [9, 7, 8, 9, 10] };

async function procesarIngesta() {
  console.log("Iniciando auditoría constitucional...");
  const evaluacion = await agente.evaluar(JSON.stringify(nuevaHerramienta), "validacion");
  if (evaluacion.aprobado) {
    console.log("Agente Crítico: APROBADO.");
    await storage.save('herramientas.json', JSON.stringify(nuevaHerramienta), 'Add: Obsidian');
    console.log("Persistencia en GitHub completada.");
  } else {
    console.warn("Bloqueo Pedagógico:", evaluacion.razon);
  }
}

procesarIngesta().catch(err => console.error("Error fatal:", err));
