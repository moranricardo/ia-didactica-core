// src/services/api.js

const BASE_URL = process.env.API_URL || 'http://127.0.0.1:3000/api';
const DEFAULT_TIMEOUT_MS = 15000;

const fetchConTimeout = async (endpoint, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(id);

    if (!response.ok) {
      let mensajeError = `Error HTTP: ${response.status}`;
      try {
        const errorJson = await response.json();
        if (errorJson.error || errorJson.message) {
          mensajeError = errorJson.error || errorJson.message;
        }
      } catch (_) {}
      throw new Error(mensajeError);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new Error('La solicitud excedió el tiempo límite de espera.');
    }
    throw error;
  }
};

export const consultarChat = async (prompt) => {
  try {
    return await fetchConTimeout('/chat', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
  } catch (error) {
    console.error('❌ [API Chat Error]:', error.message);
    throw error;
  }
};

export const solicitarLeccion = async (tema, nivel = 'intermedio') => {
  try {
    return await fetchConTimeout('/leccion', {
      method: 'POST',
      body: JSON.stringify({ tema, nivel }),
    });
  } catch (error) {
    console.error('❌ [API Lección Error]:', error.message);
    throw error;
  }
};

export default {
  consultarChat,
  solicitarLeccion
};
