import express from "express";
import cors from "cors";
import { ejecutarConsulta, ejecutarLeccion } from "./core/orquestador.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    sistema: "IA-Didactica Core REST API",
    timestamp: new Date().toISOString()
  });
});

app.post("/api/chat", async (req, res, next) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      return res.status(400).json({ error: "El campo 'prompt' es requerido y debe ser una cadena válida." });
    }
    const resultado = await ejecutarConsulta(prompt.trim());
    return res.json(resultado);
  } catch (error) {
    next(error);
  }
});

app.post("/api/leccion", async (req, res, next) => {
  try {
    const { tema, nivel = "intermedio" } = req.body;
    if (!tema || typeof tema !== "string" || tema.trim() === "") {
      return res.status(400).json({ error: "El campo 'tema' es requerido." });
    }
    const resultado = await ejecutarLeccion(tema.trim(), nivel);
    return res.json(resultado);
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, next) => {
  console.error("❌ [Server Error Unhandled]:", err.stack || err.message || err);
  res.status(500).json({
    error: "Error interno en el servidor.",
    mensaje: err.message || "Ocurrió un fallo no esperado."
  });
});

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`\n🚀 [IA-Didactica Core Server] corriendo en: http://localhost:${PORT}\n`);
});

process.on("SIGINT", () => {
  console.log("\n🛑 Cerrando servidor HTTP...");
  server.close(() => {
    process.exit(0);
  });
});
