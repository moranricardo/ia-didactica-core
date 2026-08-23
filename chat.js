import readline from "node:readline";
import { buscarEnCache, guardarEnCache } from "./src/core/cache.js";
import { consultarIALocal } from "./src/core/consultarLocal.js";
import { consultarAPICloud } from "./src/core/consultarCloud.js";

export async function procesarPrompt(prompt) {
  try {
    // 1. Caché Local
    const cached = buscarEnCache(prompt);
    if (cached) {
      console.log("\n💾 [Caché Local]");
      return cached;
    }

    // 2. Motor Local Qwen (llama-server)
    const respLocal = await consultarIALocal(prompt);
    if (respLocal) {
      console.log("\n⚡ [Inferencia Local - Qwen]");
      guardarEnCache(prompt, respLocal);
      return respLocal;
    }

    // 3. Fallback a la Nube (Gemini API)
    console.log("\n☁️  [Servidor local no disponible - Consultando Nube]");
    const respCloud = await consultarAPICloud(prompt);
    if (respCloud) {
      guardarEnCache(prompt, respCloud);
      return respCloud;
    }

    return "⚠️ Ningún motor está disponible (Servidor local apagado y API Key no configurada).";
  } catch (error) {
    return `❌ Error en el procesamiento del prompt: ${error.message}`;
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("🤖 [IA-Didáctica Core Interactivo]");
console.log("Escribe tu consulta o 'salir' para terminar.\n");

function preguntar() {
  rl.question("Tú ➜ ", async (entrada) => {
    const prompt = entrada.trim();

    if (prompt.toLowerCase() === "salir") {
      console.log("👋 ¡Hasta luego!");
      rl.close();
      process.exit(0);
    }

    if (prompt.length > 0) {
      const respuesta = await procesarPrompt(prompt);
      console.log(`IA ➜ ${respuesta}\n`);
    }

    preguntar();
  });
}

rl.on("SIGINT", () => {
  console.log("\n👋 Proceso cancelado. ¡Hasta luego!");
  process.exit(0);
});

preguntar();
