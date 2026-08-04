import { WorkspaceCache } from './WorkspaceCache.js';

const cache = new WorkspaceCache();

export async function consultarLocal(prompt) {
  try {
    const response = await fetch('http://localhost:8080/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    });

    if (response.ok) {
      const data = await response.json();
      const resultado = data.choices?.[0]?.message?.content?.trim();
      if (resultado) return resultado;
    }
  } catch (error) {
    // Servidor local no disponible, pasando al respaldo en disco
  }

  try {
    const cached = cache.obtener(prompt);
    if (cached) {
      return cached;
    }
  } catch (e) {
    // Si falla la lectura de caché
  }

  // Si todo falla, retornar null para que el orquestador active el fallback a la nube
  return null;
}

export default consultarLocal;
