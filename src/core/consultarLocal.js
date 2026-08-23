import { WorkspaceCache } from './WorkspaceCache.js';

const cache = new WorkspaceCache();

const LOCAL_URL = process.env.LOCAL_LLM_URL || 'http://localhost:8080/v1/chat/completions';
const TIMEOUT_MS = parseInt(process.env.LOCAL_LLM_TIMEOUT || '3000', 10);

export async function consultarLocal(prompt) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(LOCAL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const resultado = data.choices?.[0]?.message?.content?.trim();
      if (resultado) return resultado;
    }
  } catch (error) {
    clearTimeout(timeoutId);
  }

  try {
    const cached = cache.obtener(prompt);
    if (cached) return cached;
  } catch (e) {
    // Falla de lectura en caché
  }

  return null;
}

export default consultarLocal;
