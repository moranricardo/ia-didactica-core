import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ [Error] GEMINI_API_KEY no está configurada en las variables de entorno.");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function verificarModelosDisponibles() {
  console.log("🔍 Consultando modelos disponibles en la API de Gemini...\n");

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const modelos = data.models || [];

    console.log(`✅ Conexión exitosa. Se encontraron ${modelos.length} modelos:\n`);

    const modelosGenerativos = modelos.filter((m) =>
      m.supportedGenerationMethods?.includes("generateContent")
    );

    modelosGenerativos.forEach((m) => {
      const nombreLimpio = m.name.replace("models/", "");
      console.log(`• [${nombreLimpio}] - ${m.displayName || "Sin nombre de muestra"}`);
    });

  } catch (err) {
    console.error("❌ Error al listar modelos:", err.message);
  }
}

verificarModelosDisponibles();
