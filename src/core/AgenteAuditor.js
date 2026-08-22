import { TelemetryHeart } from "./TelemetryHeart.js";

const heart = new TelemetryHeart();

async function ejecutarAuditoria() {
  console.log("🔍 [AgenteAuditor] Inspeccionando estado global de la flota en SSoT...");

  try {
    const state = await heart.read();
    let hayErrores = false;

    console.log(`\n📅 Último pulso registrado: ${state.lastPulse || 'Desconocido'}`);
    console.log("🤖 Estado de la Flota:");

    if (!state.agents || Object.keys(state.agents).length === 0) {
      console.log("  ⚠️  Ningún agente registrado en el sistema.");
    } else {
      for (const [agent, data] of Object.entries(state.agents)) {
        const icon = data.status === "running" ? "🔵" : data.status === "error" ? "🔴" : "🟢";
        if (data.status === "error") hayErrores = true;

        console.log(`  ${icon} ${agent} [${data.status.toUpperCase()}]`);
        console.log(`      ├─ Último pulso : ${data.lastPulse || 'N/A'}`);
        if (data.tarea) console.log(`      ├─ Tarea actual : ${data.tarea}`);
        if (data.aprobado !== undefined) console.log(`      ├─ Aprobado     : ${data.aprobado ? '✅' : '❌'}`);
        if (data.error) console.log(`      └─ Error        : ${data.error}`);
      }
    }

    console.log("\n✅ Auditoría de telemetría finalizada.");
    if (hayErrores) process.exitCode = 1;
  } catch (error) {
    console.error("🔴 [AgenteAuditor] Fallo crítico al procesar SSoT:", error.message);
    process.exit(1);
  }
}

ejecutarAuditoria();
