import { Octokit } from "@octokit/rest";
import { AgenteCritico } from "./AgenteCritico.js";
import { AgenteGenerador } from "./AgenteGenerador.js"; // <-- NUEVO
import { GeminiClient } from "./GeminiClient.js";
import { GestorArchivos } from "./GestorArchivos.js";
import 'dotenv/config'; 
import { fileURLToPath } from 'url';

const { GITHUB_TOKEN, GEMINI_API_KEY, GITHUB_OWNER, GITHUB_REPO } = process.env;
if (!GITHUB_TOKEN) throw new Error("[Orquestador] Falta GITHUB_TOKEN en .env");
if (!GEMINI_API_KEY) throw new Error("[Orquestador] Falta GEMINI_API_KEY en .env");

const octokit = new Octokit({ auth: GITHUB_TOKEN });

async function cargarConstitucion() {
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner: GITHUB_OWNER || "moranricardo",
      repo: GITHUB_REPO || "ia-didactica-core",
      path: "constitucion.txt"
    });
    return Buffer.from(data.content, 'base64').toString('utf-8');
  } catch (error) {
    console.error("[Orquestador] Error al cargar Constitución:", error.message);
    throw error;
  }
}

export async function inicializar() {
  console.log("[Orquestador] Iniciando secuencia de arranque...");
  const constitucion = await cargarConstitucion();
  console.log("[Orquestador] Constitución cargada:", constitucion.slice(0, 50) + '...');
  
  const llm = new GeminiClient(GEMINI_API_KEY);
  const agenteGenerador = new AgenteGenerador(llm, constitucion); // <-- INSTANCIAMOS EL GENERADOR
  const agenteCritico = new AgenteCritico(llm, constitucion);
  const gestor = new GestorArchivos();
  
  console.log("[Orquestador] Sistema de Inferencia Evaluativa ensamblado y listo.");
  return { agenteGenerador, agenteCritico, gestor };
}

export async function ejecutarLeccion(tema, contextoUsuario = {}) {
  const { agenteGenerador, agenteCritico, gestor } = await inicializar();

  console.log(`\n=== PIPELINE: Generando lección "${tema}" ===`);
  
  // 1. El Generador crea el borrador inicial
  const leccionBruta = await agenteGenerador.generarBorrador(tema, contextoUsuario);

  // 2. El Crítico evalúa y corrige
  const resultado = await agenteCritico.procesar(
    leccionBruta,
    { ...contextoUsuario, tema },
    async (datosAprobados) => {
      console.log("[Orquestador] ✅ Lección aprobada por el Agente Crítico.");
      // 3. El Gestor guarda el archivo final
      const ruta = await gestor.guardarLeccion(tema, datosAprobados); 
      return { exito: true, ruta, leccion: datosAprobados };
    }
  );

  if (resultado.error) {
    console.log("[Orquestador] ❌ Bloqueado:", resultado.mensaje);
  }

  return resultado;
}

const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);
if (isMainModule) {
  const tema = process.argv[2] || "Bases de Datos";
  ejecutarLeccion(tema).catch(e => {
    console.error("[Orquestador] Fallo fatal:", e.message);
    process.exit(1);
  });
}
