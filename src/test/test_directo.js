import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ [Error] GEMINI_API_KEY no está configurada en las variables de entorno.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

const modelosInferenciaRapida = [
  "gemini-2.0-flash",
  "gemini-1.5-flash-8b",
  "gemini-1.5-flash"
];

async function probarInferenciaDirecta() {
  console.log("⚡ [Test Directo] Verificando generación de texto de baja latencia...\n");

  const promptPrueba = "Responde en una sola frase corta: ¿El sistema de inferencia rápida está operativo?";

  for (const nombreModelo of modelosInferenciaRapida) {
    try {
      console.log(`📡 Probando inferencia con modelo: [${nombreModelo}]...`);
      const model = genAI.getGenerativeModel({ model: nombreModelo });

      const startTime = Date.now();
      const result = await model.generateContent(promptPrueba);
      const duration = Date.now() - startTime;
      const responseText = result.response.text();

      console.log(`\n✅ ÉXITO [${nombreModelo}] (${duration} ms):`);
      console.log(`💬 "${responseText.trim()}"\n`);
      return;
    } catch (err) {
      console.warn(`⚠️ Falló inferencia en [${nombreModelo}]: ${err.message}`);
    }
  }

  console.error("\n❌ ERROR CRÍTICO: Ningún modelo de baja latencia respondió a la consulta.");
  process.exit(1);
}

probarInferenciaDirecta();
