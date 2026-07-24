import express from 'express';
import { ejecutarLeccion } from './core/orquestador.js';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para entender JSON en las peticiones POST
app.use(express.json());

// Ruta de prueba para verificar que el servidor está vivo
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', mensaje: 'Servidor de IA Didáctica activo y funcionando 🚀' });
});

// Ruta principal para generar lecciones
app.post('/api/leccion', async (req, res) => {
  try {
    const { tema, contexto } = req.body;

    if (!tema) {
      return res.status(400).json({ error: 'El campo "tema" es obligatorio en el cuerpo de la petición.' });
    }

    console.log(`[Servidor] Recibida petición HTTP para generar lección sobre: "${tema}"`);
    
    // Ejecutamos tu orquestador existente
    const resultado = await ejecutarLeccion(tema, contexto || {});

    if (resultado.error) {
      return res.status(500).json({ exito: false, detalle: resultado.mensaje });
    }

    res.json({
      exito: true,
      mensaje: 'Lección generada y aprobada con éxito',
      datos: resultado
    });

  } catch (error) {
    console.error("[Servidor] Error crítico en /api/leccion:", error.message);
    res.status(500).json({ error: 'Error interno del servidor', detalle: error.message });
  }
});

// Arrancar el servidor
app.listen(PORT, () => {
  console.log(`[Servidor] API escuchando en http://localhost:${PORT}`);
});
