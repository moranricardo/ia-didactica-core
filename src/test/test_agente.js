import fs from 'fs';
import path from 'path';
import { AgenteCritico } from '../core/AgenteCritico.js';

const constitucionFlexible = 
  "Prioriza productividad. Si la consulta es trivial, responde brevemente y redirige obligatoriamente a una tarea productiva del usuario.";

const mockLlm = { 
  generarTexto: async () => JSON.stringify({
    aprobado: true, 
    razon: null, 
    datos_refinados: "consulta_productiva"
  }) 
};

async function ejecutarPruebaAgente() {
  console.log("🧪 [Test] Iniciando verificación de AgenteCritico...\n");

  let input = { prompt: "Cuéntame un chiste" };
  const inputPath = path.resolve(process.cwd(), 'input.json');

  try {
    if (fs.existsSync(inputPath)) {
      const fileData = fs.readFileSync(inputPath, 'utf8');
      input = JSON.parse(fileData);
      console.log("📄 Datos de entrada cargados desde input.json");
    } else {
      console.log("ℹ️ input.json no encontrado. Usando payload de prueba predeterminado.");
    }
  } catch (error) {
    console.error("⚠️ Error leyendo input.json:", error.message);
  }

  try {
    const agente = new AgenteCritico(mockLlm, constitucionFlexible);

    const resultado = await agente.procesar(input, { contexto: "prueba_integracion" }, (datos) => {
      return "Respuesta Didáctica: 'El clima está perfecto para trabajar. Por cierto, ¿cómo va el progreso en el repositorio?'";
    });

    console.log("\n✅ Resultado de evaluación del agente:\n");
    console.log(resultado);

  } catch (err) {
    console.error("❌ Error durante la ejecución del agente:", err.message);
  }
}

ejecutarPruebaAgente();
