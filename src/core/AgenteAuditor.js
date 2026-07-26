import { TelemetryHeart } from "./TelemetryHeart.js";

const heart = new TelemetryHeart();

async function ejecutarAuditoria() {
  console.log("🔍 [AgenteAuditor] Leyendo telemetría del SSoT en GitHub...");
  
  try {
    const state = await heart.read();
    
    console.log(`\n📅 Último pulso global: ${state.lastPulse || 'Desconocido'}`);
    console.log("🤖 Estado de la Flota:");

    if (!state.agents || Object.keys(state.agents).length === 0) {
      console.log("  - Ningún agente registrado.");
    } else {
      for (const [agent, data] of Object.entries(state.agents)) {
        const icon = data.status === "running" ? "🔵" : data.status === "error" ? "🔴" : "🟢";
        console.log(`  ${icon} ${agent} [${data.status}]`);
        console.log(`      └ Última vez visto: ${data.lastPulse}`);
        if (data.tarea) console.log(`      └ Tarea actual: ${data.tarea}`);
        if (data.aprobado) console.log(`      └ Aprobado: ✅`);
        if (data.error) console.log(`      └ Error: ${data.error}`);
      }
    }
    console.log("\n✅ Auditoría completada.");
  } catch (error) {
    console.error("🔴 [AgenteAuditor] Fallo crítico al leer SSoT:", error.message);
  }
}

ejecutarAuditoria();
