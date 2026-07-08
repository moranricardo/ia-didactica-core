import { Telemetry } from '../logs/Telemetry.js';

export class AgenteCritico {
  constructor(llm, constitucion) {
    this.llm = llm;
    this.constitucion = constitucion;
  }

  async procesar(datosEntrada, contextoUsuario, funcionEjecucion) {
    const evaluacion = await this.evaluar(datosEntrada, contextoUsuario);

    if (evaluacion.aprobado) {
      return funcionEjecucion(evaluacion.datos_refinados || datosEntrada);
    } else {
      // TELEMETRÍA: Si no se aprueba, registramos para el futuro
      await Telemetry.registrarBloqueo(datosEntrada, evaluacion.razon);
      return { error: true, mensaje: evaluacion.razon };
    }
  }
  
  // ... (método evaluar se mantiene igual)
}
