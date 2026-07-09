import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function list() {
  try {
    // Usamos el cliente genAI para listar modelos disponibles
    const response = await genAI.listModels();
    console.log("Modelos detectados:");
    response.models.forEach(m => console.log(`- ${m.name}`));
  } catch (err) {
    console.error("ERROR DETECTADO:", err.message);
  }
}
list();
