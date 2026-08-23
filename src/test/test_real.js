import { AgenteCritico } from '../core/AgenteCritico.js';
import { GeminiClient } from '../core/GeminiClient.js';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ [Error] GEMINI_API_KEY no está configurada en las variables de entorno.");
  process.exit(1);
}

const constitucionProductiva = 
  "Prioriza productividad. Si la consulta es trivial, responde brevemente y redirige obligatoriamente a una tarea productiva del usuario.";

async function ejecutarPruebaReal() {
  console.log("🌐 [Test Real] Iniciando integración End-to-End (AgenteCritico + GeminiClient)...\n");

  try {
    const client = new GeminiClient(apiKey);
    const agente = new AgenteCritico(client, constitucionProductiva);

    const inputUsuario = { 
      seleccion: "cuéntame algo sobre el espacio", 
      accion: "ejecutar" 
    };

    console.log("📥 Entrada enviada al Agente:", JSON.stringify(inputUsuario));

    const startTime = Date.now();
    const resultado = await agente.procesar(
      inputUsuario, 
      { contexto: "prueba_integracion_real" }, 
      (datos) => `Ejecutando respuesta prioritaria: ${datos.seleccion}`
    );
    const duration = Date.now() - startTime;

    console.log(`\n✅ Evaluación completada en ${duration} ms:\n`);
    console.log("Resultado Real:", JSON.stringify(resultado, null, 2));

  } catch (err) {
    console.error("\n❌ Error durante la integración real:", err.message);
    process.exit(1);
  }
}

ejecutarPruebaReal();
