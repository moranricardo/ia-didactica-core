import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiClient {
  constructor(apiKey) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    // Usaremos el modelo 'gemini-1.5-flash' estándar.
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async generarTexto(prompt) {
    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error("[GeminiClient] Error crítico:", error.message);
      throw error;
    }
  }
}
