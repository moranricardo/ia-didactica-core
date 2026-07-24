import { Octokit } from "@octokit/rest";
import { AgenteCritico } from "./AgenteCritico.js";
import { GeminiClient } from "./GeminiClient.js";
import 'dotenv/config'; // Carga .env automáticamente
import { fileURLToPath } from 'url';

// 1. Validación temprana de ENV
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
    // GitHub devuelve content en base64
    return Buffer.from(data.content, 'base64').toString('utf-8');
  } catch (error) {
    console.error("[Orquestador] Error al cargar Constitución:", error.message);
    console.error("Verifica: 1) GITHUB_TOKEN con permiso 'repo', 2) Que exista constitucion.txt");
    throw error;
  }
}

export async function inicializar() {
  console.log("[Orquestador] Iniciando secuencia de arranque...");

  // 2. Cargamos reglas pedagógicas desde SSoT
  const constitucion = await cargarConstitucion();
  console.log("[Orquestador] Constitución cargada:", constitucion.slice(0, 50) + '...');

  // 3. Instanciamos LLM blindado
  const llm = new GeminiClient(GEMINI_API_KEY);

  // 4. Ensamblamos Agente Crítico
  const agente = new AgenteCritico(llm, constitucion);

  console.log("[Orquestador] Sistema de Inferencia Evaluativa ensamblado y listo.");
  return { agente, llm, constitucion };
}

// 5. Función para correr el pipeline completo
export async function ejecutarLeccion(tema, contextoUsuario = {}) {
  const { agente } = await inicializar();

  console.log(`\n=== PIPELINE: Generando lección "${tema}" ===`);

  // Esto simula datosEntrada. En real vendría de AgenteGenerador
  const leccionBruta = `Los autocodificadores son redes neuronales. ¿Qué es una red? ¿Entiendes?`;

  const resultado = await agente.procesar(
    leccionBruta,
    { ...contextoUsuario, tema },
    async (datosAprobados) => {
      console.log("[Orquestador] ✅ Lección aprobada. Guardando...");
      return { exito: true, leccion: datosAprobados };
    }
  );

  if (resultado.error) {
    console.log("[Orquestador] ❌ Bloqueado:", resultado.mensaje);
  }

  return resultado;
}

// 6. Ejecución directa robusta: funciona en Linux, Mac, Windows
const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);
if (isMainModule) {
  const tema = process.argv[2] || "Autocodificadores";
  ejecutarLeccion(tema).catch(e => {
    console.error("[Orquestador] Fallo fatal:", e.message);
    process.exit(1);
  });
}
