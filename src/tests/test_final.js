import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Usamos el modelo sin prefijos v1beta si es posible, o el nombre exacto
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

model.generateContent("Test de integración POD 1.0")
  .then(res => console.log("ÉXITO: Sistema Operativo. Respuesta:", res.response.text()))
  .catch(err => console.log("ERROR ESTRUCTURAL:", err.message));
