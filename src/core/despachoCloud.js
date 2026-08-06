export async function despacharAGitHub(path, contenido, mensajeCommit) {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;

  if (!token || !owner || !repo) {
    console.warn('⚠️ Despacho GitHub omitido: Faltan credenciales en .env (GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO)');
    return { success: false, reason: 'Credenciales incompletas' };
  }

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const contentBase64 = Buffer.from(contenido).toString('base64');

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'IA-Didactica-Core'
      },
      body: JSON.stringify({
        message: mensajeCommit || `add: lección en ${path}`,
        content: contentBase64
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log(`🚀 [GitHub Cloud] Archivo subido con éxito a: ${data.content.html_url}`);
      return { success: true, url: data.content.html_url };
    } else {
      console.error(`❌ [GitHub Cloud] Error ${response.status}: ${data.message}`);
      return { success: false, reason: data.message };
    }
  } catch (error) {
    console.error(`❌ [GitHub Cloud] Falla en la conexión: ${error.message}`);
    return { success: false, reason: error.message };
  }
}

export default despacharAGitHub;
