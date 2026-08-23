import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CACHE_FILE = path.join(__dirname, "../../cache/respuestas.json");

function normalizarClave(prompt) {
  const limpio = prompt.trim().toLowerCase().replace(/\s+/g, " ");
  return crypto.createHash("sha256").update(limpio).digest("hex");
}

async function leerCache() {
  try {
    if (existsSync(CACHE_FILE)) {
      const raw = await fs.readFile(CACHE_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn("⚠️ [Cache]: Error al leer o JSON corrompido.");
  }
  return {};
}

export async function consultarCache(prompt) {
  const cache = await leerCache();
  const clave = normalizarClave(prompt);
  const entrada = cache[clave];

  if (!entrada) return null;
  return typeof entrada === "object" ? entrada.respuesta : entrada;
}

export async function guardarEnCache(prompt, respuesta) {
  try {
    const cache = await leerCache();
    const clave = normalizarClave(prompt);
    
    cache[clave] = {
      respuesta,
      fecha: new Date().toISOString()
    };

    const dir = path.dirname(CACHE_FILE);
    if (!existsSync(dir)) {
      await fs.mkdir(dir, { recursive: true });
    }

    await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2), "utf-8");
  } catch (e) {
    console.warn("⚠️ [Cache]: No se pudo guardar la respuesta en disco.");
  }
}
