export class AgenteGenerador {
  constructor(llm, constitucion) {
    this.llm = llm;
    this.constitucion = constitucion;
  }

  async generarBorrador(tema, contextoUsuario = {}) {
    console.log(`[AgenteGenerador] ✍️ Redactando borrador sobre: "${tema}"...`);
    
    const prompt = `
      Eres un experto pedagogo. Escribe una lección introductoria sobre el siguiente tema:
      TEMA: ${tema}
      
      CONTEXTO DEL USUARIO: ${JSON.stringify(contextoUsuario)}
      
      REGLAS OBLIGATORIAS (Constitución):
      ${this.constitucion}
      
      Genera ÚNICAMENTE el texto de la lección, sin introducciones ni confirmaciones.
    `;

    try {
      const leccionBruta = await this.llm.generarTexto(prompt);
      console.log(`[AgenteGenerador] ✅ Borrador finalizado.`);
      return leccionBruta;
    } catch (error) {
      console.error("[AgenteGenerador] ❌ Error al generar el borrador:", error.message);
      throw error;
    }
  }
}
