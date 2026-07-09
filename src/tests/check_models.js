import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
  try {
    const list = await genAI.listModels();
    console.log("Modelos disponibles:");
    list.models.forEach(m => console.log("- " + m.name));
  } catch (err) {
    console.error("Error al listar modelos:", err.message);
  }
}
run();
