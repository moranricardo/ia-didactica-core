import express from 'express';
import cors from 'cors';
import { ejecutarOrquestador } from './core/orquestador.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/generar', async (req, res) => {
  try {
    const { tema } = req.body;
    if (!tema) {
      return res.status(400).json({ error: 'El parámetro "tema" es requerido.' });
    }
    const resultado = await ejecutarOrquestador(tema);
    res.json({ success: true, data: resultado });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🌐 Servidor corriendo en http://localhost:${PORT}`);
});
