import { AgenteCritico } from './src/core/AgenteCritico.js';
import { GeminiClient } from './src/core/GeminiClient.js';

const client = new GeminiClient(process.env.GEMINI_API_KEY);
const constitucion = "Prioriza productividad. Si la consulta es trivial, responde brevemente y redirige obligatoriamente a una tarea productiva del usuario.";
const agente = new AgenteCritico(client, constitucion);

const input = { seleccion: "cuéntame algo sobre el espacio", accion: "ejecutar" };

agente.procesar(input, { contexto: "prueba" }, (d) => "Ejecutando: " + d.seleccion)
  .then(res => console.log("Resultado Real:", res));
