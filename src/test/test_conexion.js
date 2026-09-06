import { GitHubStorage } from '../storage/GitHubStorage.js';

export async function testConexion() {
  try {
    const storage = new GitHubStorage('moranricardo', 'ia-didactica-core');
    console.log('[Test] Probando conexión con SSoT...');
  } catch (error) {
    console.error(`Detalle: ${error.message}`);
  }
}

testConexion();
