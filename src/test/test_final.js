import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ [ERROR ESTRUCTURAL] GEMINI_API_KEY no se encuentra definida en el entorno.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

const modelosOrquestador = [
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash"
];

async function ejecutarTestPOD() {
  console.log("🚀 [Test Integración POD] Iniciando verificación de infraestructura de IA...\n");

  const promptVerificacion = "Test de integración POD. Confirma estado operativo en una frase.";

  for (const nombreModelo of modelosOrquestador) {
    try {
      console.log(`📡 Invocando modelo de orquestación: [${nombreModelo}]...`);
      const model = genAI.getGenerativeModel({ model: nombreModelo });

      const startTime = Date.now();
      const result = await model.generateContent(promptVerificacion);
      const duration = Date.now() - startTime;
      const responseText = result.response.text();

      console.log(`\n✅ ÉXITO: Sistema Operativo con [${nombreModelo}] (${duration} ms)`);
      console.log(`💬 Respuesta: "${responseText.trim()}"\n`);
      return;
    } catch (err) {
      console.warn(`⚠️ Error en modelo [${nombreModelo}]: ${err.message}`);
    }
  }

  console.error("\n❌ ERROR ESTRUCTURAL: Todos los modelos de la cadena de orquestación fallaron.");
  process.exit(1);
}

ejecutarTestPOD();
