import fs from 'fs/promises';
import path from 'path';
import { TelemetryHeart } from "./TelemetryHeart.js";
import { GeminiClient } from "./GeminiClient.js";
import { AgenteGenerador } from "./AgenteGenerador.js";
import { AgenteCritico } from "./AgenteCritico.js";
import { AgenteRedactor } from "./AgenteRedactor.js";

async function cargarConstitucion() {
  try {
    const p = path.resolve(process.cwd(), 'constitucion.txt');
    const txt = await fs.readFile(p, 'utf-8');
    return txt.trim().length > 50 ? txt : null;
  } catch {
    return null;

const heart = new TelemetryHeart();
const gemini = new GeminiClient();
const redactor = new AgenteRedactor();

async function ejecutarOrquestador() {
  // Capturamos el argumento de la terminal
  const temaArg = process.argv[2];
  
  if (!temaArg) {
    console.error("🔴 [Error] Debes proporcionar un tema entre comillas.");
    console.log("👉 Ejemplo: node src/core/orquestador.js \"Docker vs Podman\"");
    process.exit(1);
  }

  const temaActual = temaArg;
  
  // Normalizamos el string para crear un nombre de archivo válido
  const nombreArchivo = temaActual
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Quita acentos
    .replace(/[^a-z0-9]+/g, '-') // Cambia espacios y símbolos por guiones
    .replace(/(^-|-$)/g, ''); // Limpia guiones al inicio o final

  const rutaArchivo = `lecciones/${nombreArchivo}.md`;

  console.log(`\n🚀 [Orquestador] Iniciando flujo multi-agente para: "${temaActual}"\n`);

  try {
    // --- 1. INVESTIGADOR ---
    await heart.pulse("AgenteInvestigador", "running", { tema: temaActual });
    console.log(`[AgenteInvestigador] Investigando...`);
    
    const resultado = await gemini.generarLeccion(temaActual);
    
    await heart.pulse("AgenteInvestigador", "idle", { tokensUsados: resultado.tokens });
    console.log(`✅ [AgenteInvestigador] Investigación completada.\n`);

    // --- 2. REDACTOR ---
    await heart.pulse("AgenteRedactor", "running", { tarea: `Escribiendo ${rutaArchivo}` });
    console.log(`[AgenteRedactor] Empaquetando y enviando a GitHub...`);
    
    const contenidoMarkdown = `# Lección: ${temaActual}\n\n${resultado.texto}\n\n---\n*Generado automáticamente por la flota de IA Didáctica.*`;
    
    await redactor.redactarYGuardar(temaActual, contenidoMarkdown, rutaArchivo);
    
    await heart.pulse("AgenteRedactor", "idle", { ultimaAccion: rutaArchivo });
    console.log(`✅ [AgenteRedactor] Redacción finalizada en ${rutaArchivo}.\n`);

    console.log(`🎉 [Orquestador] Ciclo completado. Todo sincronizado en GitHub.`);

  } catch (error) {
    console.error(`🔴 [Orquestador] Falla crítica:`, error);
  }
}


}


}

export async function ejecutarOrquestador(temaCLI) {
  const tema = (temaCLI || process.argv[2] || '').trim() || "Arquitecturas Orientadas a Eventos";
  const slug = tema.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const rutaArchivo = `lecciones/${slug}.md`;

  console.log(`\n🚀 [Orquestador V4] Pipeline: "${tema}" -> ${rutaArchivo}\n`);

  const heart = new TelemetryHeart();
  const constitucion = await cargarConstitucion();
  if (!constitucion) console.warn('⚠️ constitucion.txt no encontrada o vacía, usando fallback');

  const gemini = new GeminiClient();
  const generador = new AgenteGenerador(gemini, constitucion);
  
  // Manejo defensivo por si AgenteCritico aún no está 100% implementado
  let critico;
  try { critico = new AgenteCritico(); } catch (e) { console.warn("⚠️ AgenteCritico no disponible."); }
  
  const redactor = new AgenteRedactor();

  try {
    await fs.mkdir(path.resolve('lecciones'), { recursive: true });

    // 1. GENERAR
    await heart.pulse("AgenteGenerador", "running", { tema });
    const borrador = await generador.generarBorrador(tema, { nivel: 'avanzado' });
    await heart.pulse("AgenteGenerador", "idle", { tokens: borrador.tokensAprox, modelo: borrador.modeloUsado });

    // 2. CRITICAR (Si existe)
    let finalMd = borrador.texto;
    if (critico && typeof critico.evaluar === 'function') {
      await heart.pulse("AgenteCritico", "running");
      const audit = await critico.evaluar(borrador);
      await heart.pulse("AgenteCritico", "idle", { aprobado: audit.aprobado });

      if (!audit.aprobado) {
        console.log(`🟡 [Critico] Rechazado: ${audit.comentario}\n`);
        await fs.writeFile(`lecciones/${slug}.quarantine.md`, borrador.texto, 'utf-8').catch(()=>{});
        return audit;
      }
      finalMd = audit.textoAprobado || borrador.texto;
    }

    // 3. REDACTAR
    await heart.pulse("AgenteRedactor", "running", { ruta: rutaArchivo });
    const contenidoConHeader = `# ${tema}\n\n> Modelo: ${borrador.modeloUsado} | ${borrador.timestamp}\n\n${finalMd}\n\n---\n*Generado por ia-didactica-core V4*`;

    await redactor.redactarYGuardar(tema, contenidoConHeader, rutaArchivo);
    await heart.pulse("AgenteRedactor", "idle", { ruta: rutaArchivo });

    console.log(`\n🎉 [Orquestador] ✅ Lección lista: ${rutaArchivo} (${finalMd.length} chars)\n`);
    return { ok: true, ruta: rutaArchivo, borrador };

  } catch (err) {
    console.error(`🔴 [Orquestador] Falla crítica:`, err.message);
    await heart.pulse("Orquestador", "error", { error: err.message, tema });
    throw err;
  }
}

// Auto-run si es CLI
if (process.argv[1]?.endsWith('orquestador.js')) {
  ejecutarOrquestador();
}
