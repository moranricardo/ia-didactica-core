import { GitHubStorage } from './GitHubStorage.js';

async function testSSoT() {
  const storage = new GitHubStorage(process.env.GITHUB_TOKEN, 'moranricardo', 'ia-didactica-core');
  
  try {
    console.log("Iniciando auditoría técnica de persistencia...");
    await storage.save('test_conexion.json', JSON.stringify({ status: "ok" }), 'Validación SSoT');
    console.log("--- RESULTADO: CANAL SSoT VALIDADO Y OPERATIVO ---");
  } catch (err) {
    console.error("--- RESULTADO: ERROR DE AUTENTICACIÓN ---");
    console.error("Detalle:", err.message);
    process.exit(1); 
  }
}

testSSoT();

