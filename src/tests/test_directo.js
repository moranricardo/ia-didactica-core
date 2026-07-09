import { GoogleGenerativeAI } from "@google/generative-ai";

// Inicialización con el modelo de baja latencia
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash-8b" 
});

model.generateContent("Hola, prueba de conexión.")
  .then(result => console.log("ÉXITO:", result.response.text()))
  .catch(err => console.error("ERROR CRÍTICO:", err.message));
