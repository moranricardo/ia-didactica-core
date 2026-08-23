import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ [Error] GEMINI_API_KEY no está configurada en el entorno.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModelFinal() {
  console.log("🔍 [Diagnóstico Final] Verificando acceso a modelos mediante SDK...\n");

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const { models } = await response.json();

    if (!models || models.length === 0) {
      console.warn("⚠️ No se encontraron modelos asociados a esta API Key.");
      return;
    }

    console.log(`✅ Diagnóstico exitoso. Total de modelos encontrados: ${models.length}\n`);

    models.forEach((m) => {
      const id = m.name.replace("models/", "");
      const metodos = m.supportedGenerationMethods ? m.supportedGenerationMethods.join(", ") : "N/A";
      console.log(`• ID: ${id}`);
      console.log(`  - Nombre: ${m.displayName || "N/A"}`);
      console.log(`  - Métodos: ${metodos}`);
      console.log(`  - Límite Tokens Entrada/Salida: ${m.inputTokenLimit || "N/A"} / ${m.outputTokenLimit || "N/A"}\n`);
    });

  } catch (err) {
    console.error("❌ ERROR DETECTADO EN DIAGNÓSTICO:", err.message);
  }
}

listModelFinal();
