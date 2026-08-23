import { AgenteCritico } from './AgenteCritico.js';
import { GeminiClient } from './GeminiClient.js';
import { despacharAGitHub } from './despachoCloud.js';

const constitucionApp = "El sistema solo debe proporcionar información sobre herramientas de productividad y tecnología didáctica.";

const clienteIA = new GeminiClient();
const agente = new AgenteCritico(clienteIA, constitucionApp);

async function sincronizarConstitucion() {
  try {
    const res = await despacharAGitHub(
      'Constitucion.txt', 
      constitucionApp, 
      'Sync: Actualización de SSoT vía Main v1.0'
    );
    if (res.success) {
      console.log('✅ Sincronización SSoT exitosa en GitHub.');
    } else {
      console.warn(`⚠️ Sincronización SSoT omitida: ${res.reason}`);
    }
  } catch (err) {
    console.error('❌ Error de persistencia:', err.message);
  }
}

async function iniciarSistema() {
  console.log("🚀 Iniciando Sistema IA Didáctica v1.0...");
  
  await sincronizarConstitucion();

  console.log("🟢 Sistema IA Didáctica v1.0 operativo.");
}

iniciarSistema();
