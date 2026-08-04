// src/services/api.js
// Reemplaza 'localhost' por la IP de tu red local (ej. 192.168.1.XX) si tu app en Expo corre en otro dispositivo.
const API_URL = 'http://localhost:3000/api';

export const consultarChat = async (prompt) => {
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('❌ [API Chat Error]:', error);
    throw error;
  }
};

export const solicitarLeccion = async (tema, nivel = 'intermedio') => {
  try {
    const response = await fetch(`${API_URL}/leccion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tema, nivel }),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('❌ [API Lección Error]:', error);
    throw error;
  }
};
