import express from "express";
import cors from "cors";
import { ejecutarConsulta, ejecutarLeccion } from "./core/orquestador.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    sistema: "IA-Didactica Core REST API",
    timestamp: new Date().toISOString()
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({ error: "El campo prompt es requerido." });
    }
    const resultado = await ejecutarConsulta(prompt);
    return res.json(resultado);
  } catch (error) {
    console.error("❌ [Server Error]:", error);
    return res.status(500).json({ error: "Error interno en el servidor." });
  }
});

app.post("/api/leccion", async (req, res) => {
  try {
    const { tema, nivel = "intermedio" } = req.body;
    if (!tema) {
      return res.status(400).json({ error: "El campo tema es requerido." });
    }
    const resultado = await ejecutarLeccion(tema, nivel);
    return res.json(resultado);
  } catch (error) {
    console.error("❌ [Server Error]:", error);
    return res.status(500).json({ error: "Error procesando la leccion." });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`\n🚀 [IA-Didactica Core Server] corriendo en: http://localhost:${PORT}\n`);
});
