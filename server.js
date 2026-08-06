import express from 'express';
import consultarCloud from './src/core/consultarCloud.js';
import despacharAGitHub from './src/core/despachoCloud.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/leccion', async (req, res) => {
  const { tema, nivel } = req.body;

  if (!tema) {
    return res.status(400).json({ success: false, mensaje: 'El campo "tema" es obligatorio.' });
  }

  console.log(`\n[API] 📥 Recibiendo petición -> Tema: "${tema}" | Nivel: "${nivel || 'general'}"`);

  const prompt = `Actúa como un tutor pedagógico experto. Genera una lección didáctica y completa sobre el tema: "${tema}". Nivel: ${nivel || 'principiante'}. Incluye ejemplos y una breve autoevaluación al final.`;

  const respuestaIA = await consultarCloud(prompt);

  if (!respuestaIA) {
    return res.status(500).json({
      success: false,
      mensaje: 'Lección rechazada o con error.',
      detalle: { fuente: 'error', respuesta: 'No se pudo generar una respuesta con las API Keys disponibles.' }
    });
  }

  // Generar nombre de archivo único para GitHub
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const nombreArchivo = `lecciones/${tema.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${timestamp}.md`;

  // Despacho a GitHub (Zero-Disk)
  const resultadoGitHub = await despacharAGitHub(
    nombreArchivo,
    respuestaIA,
    `feat: nueva lección generada - ${tema}`
  );

  return res.json({
    success: true,
    mensaje: 'Lección procesada con éxito.',
    fuente: 'nube',
    github: resultadoGitHub,
    data: respuestaIA
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 [Servidor] IA-Didáctica Core activo y escuchando en http://localhost:${PORT}`);
  console.log(`💡 Prueba rápida: curl http://localhost:${PORT}/api/health\n`);
});
