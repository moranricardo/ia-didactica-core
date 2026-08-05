import express from 'express';
import { ejecutarLeccion } from './src/core/orquestador.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Endpoint 1: Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'ia-didactica-core' });
});

// Endpoint 2: Generar Lección
app.post('/api/leccion', async (req, res) => {
  const { tema, nivel } = req.body;      
  if (!tema) {
    return res.status(400).json({ error: 'El campo "tema" es obligatorio en el JSON.' });
  }

  try {
    console.log(`\n[API] 📥 Recibiendo petición (POST /api/leccion) -> Tema: "${tema}"`);
    
    // Invocamos la función correcta del orquestador
    const resultado = await ejecutarLeccion(tema, nivel || "intermedio");

    if (resultado.fuente && resultado.fuente !== "error" && resultado.fuente !== "rechazado") {
      res.status(200).json({
        success: true,
        mensaje: `Lección procesada con éxito.`,
        fuente: resultado.fuente,
        data: resultado.respuesta,
        auditoria: resultado.auditoria
      });
    } else {
      res.status(422).json({
        success: false,
        mensaje: `Lección rechazada o con error.`,
        detalle: resultado
      });
    }                                       
  } catch (error) {
    console.error(`[API] ❌ Error crítico:`, error.message);
    res.status(500).json({ error: 'Error interno del servidor.', detalle: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 [Servidor] IA-Didáctica Core activo y escuchando en http://localhost:${PORT}`);
  console.log(`💡 Prueba rápida: curl http://localhost:${PORT}/api/health\n`);
});
