import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CACHE_FILE = path.join(__dirname, "../../cache/respuestas.json");

function leerCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn("⚠️ [Cache]: Error leyendo el archivo de cache.");
  }
  return {};
}

export async function consultarCache(prompt) {
  const cache = leerCache();
  const clave = prompt.trim().toLowerCase();
  return cache[clave] || null;
}

export async function guardarEnCache(prompt, respuesta) {
  try {
    const cache = leerCache();
    const clave = prompt.trim().toLowerCase();
    cache[clave] = respuesta;
    
    const dir = path.dirname(CACHE_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), "utf-8");
  } catch (e) {
    console.warn("⚠️ [Cache]: No se pudo guardar la respuesta en cache.");
  }
}
