import { GitHubStorage } from '../storage/GitHubStorage.js';

async function testSSoT() {
  console.log("🧪 [Test] Iniciando auditoría técnica de persistencia SSoT...\n");

  const repoOwner = 'moranricardo';
  const repoName = 'ia-didactica-core';

  try {
    const storage = new GitHubStorage(repoOwner, repoName);
    const testPath = 'test_conexion.json';
    const payload = { status: "ok", timestamp: new Date().toISOString() };

    console.log(`📡 Intentando guardar archivo de prueba en: ${testPath}`);
    await storage.guardarDato(testPath, payload, 'chore: validación de canal SSoT');
    console.log("✅ Escritura exitosa.");

    console.log(`📡 Intentando recuperar datos desde: ${testPath}`);
    const res = await storage.obtenerDato(testPath);
    console.log("✅ Lectura exitosa. Contenido recibido:\n", res.content);

    console.log("\n--- RESULTADO: CANAL SSoT VALIDADO Y OPERATIVO ---");
  } catch (err) {
    console.error("\n--- RESULTADO: ERROR DE CONEXIÓN O AUTENTICACIÓN ---");
    console.error("Detalle:", err.message);
    process.exit(1); 
  }
}

testSSoT();
