export async function despacharAGitHub(path, contenido, mensajeCommit) {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;

  if (!token || !owner || !repo) {
    console.warn('⚠️ Despacho GitHub omitido: Faltan credenciales en .env (GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO)');
    return { success: false, reason: 'Credenciales incompletas' };
  }

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'User-Agent': 'IA-Didactica-Core-Android9',
    'X-GitHub-Api-Version': '2022-11-28'
  };

  try {
    let shaActual = null;
    const checkResponse = await fetch(url, { headers });
    if (checkResponse.ok) {
      const checkData = await checkResponse.json();
      shaActual = checkData.sha;
    }

    const contentBase64 = Buffer.from(contenido, 'utf-8').toString('base64');

    const bodyPayload = {
      message: mensajeCommit || `add: lección en ${path}`,
      content: contentBase64,
      ...(shaActual && { sha: shaActual })
    };

    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(bodyPayload)
    });

    const data = await response.json();

    if (response.ok) {
      console.log(`🚀 [GitHub Cloud] Archivo subido con éxito a: ${data.content?.html_url}`);
      return { success: true, url: data.content?.html_url };
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
