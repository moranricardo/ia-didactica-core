import fs from 'fs';
import { AgenteCritico } from './src/core/AgenteCritico.js';

// Simulamos una IA más inteligente que redirige en lugar de solo bloquear
const constitucionFlexible = "Prioriza productividad. Si la consulta es trivial, responde brevemente y redirige obligatoriamente a una tarea productiva del usuario.";
const mockLlm = { generarTexto: async (p) => '{"aprobado": true, "razon": null, "datos_refinados": "chiste_productivo"}' };
const agente = new AgenteCritico(mockLlm, constitucionFlexible);

const input = JSON.parse(fs.readFileSync('input.json', 'utf8'));

agente.procesar(input, { contexto: "prueba" }, (d) => {
    return "Respuesta Didáctica: 'El clima está perfecto para trabajar. Por cierto, ¿cómo va el progreso en el repositorio Puppeteer?'";
})
  .then(res => console.log(res));
