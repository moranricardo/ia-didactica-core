import { AgenteCritico } from '../core/AgenteCritico.js';
import { GeminiClient } from '../core/GeminiClient.js';
import { GitHubStorage } from '../storage/GitHubStorage.js';

const geminiApiKey = process.env.GEMINI_API_KEY;
const githubToken = process.env.GITHUB_TOKEN;

if (!geminiApiKey || !githubToken) {
  console.error("❌ [Error] Se requieren las variables GEMINI_API_KEY y GITHUB_TOKEN.");
  process.exit(1);
}

const client = new GeminiClient(geminiApiKey);
const constitucionProductiva = "Solo permite herramientas orientadas a la productividad, aprendizaje y gestión del conocimiento.";

const agente = new AgenteCritico(client, constitucionProductiva);
const storage = new GitHubStorage(githubToken, 'moranricardo', 'ia-didactica-core');

const nuevaHerramienta = { 
  tag: "obsidian", 
  name: "Obsidian", 
  desc: "Gestión de conocimiento y notas vinculadas.", 
  stats: [9, 7, 8, 9, 10] 
};

async function procesarIngesta() {
  console.log("🔍 Iniciando auditoría constitucional de ingesta...");
  
  const evaluacion = await agente.evaluar(JSON.stringify(nuevaHerramienta), "validacion_herramienta");
  
  if (evaluacion.aprobado) {
    console.log("✅ Agente Crítico: APROBADO.");

    let listaActual = [];
    try {
      const contenidoExistente = await storage.load('data/herramientas.json');
      if (contenidoExistente) {
        listaActual = JSON.parse(contenidoExistente);
      }
    } catch (e) {
      console.log("ℹ️ Creando nuevo archivo data/herramientas.json...");
    }

    const existe = listaActual.some(h => h.tag === nuevaHerramienta.tag);
    if (!existe) {
      listaActual.push(nuevaHerramienta);
    }

    await storage.save('data/herramientas.json', JSON.stringify(listaActual, null, 2), `Add tool: ${nuevaHerramienta.name}`);
    console.log("💾 Persistencia en GitHub completada satisfactoriamente.");
  } else {
    console.warn("⛔ Bloqueo Pedagógico / Constitucional:", evaluacion.razon || evaluacion.explicacion);
  }
}

procesarIngesta().catch(err => {
  console.error("❌ Error fatal en proceso de ingesta:", err.message);
  process.exit(1);
});
