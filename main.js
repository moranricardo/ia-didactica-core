import { AgenteCritico } from './src/core/AgenteCritico.js';

const constitucionApp = "El sistema solo debe proporcionar información sobre herramientas de productividad.";
const tuClienteIA = { generarTexto: async (p) => '{"aprobado": true, "razon": "OK", "datos_refinados": null}' };

const agente = new AgenteCritico(tuClienteIA, constitucionApp);
console.log("Sistema IA Didáctica v1.0 operativo.");
