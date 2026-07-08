import { Telemetry } from '../logs/Telemetry.js';

export class AgenteCritico {
  constructor(llm, constitucion) {
    this.llm = llm;
    this.constitucion = constitucion;
  }

  async evaluar(datosEntrada, contextoUsuario) {
    const respuesta = await this.llm.generarTexto(JSON.stringify(datosEntrada));
    return JSON.parse(respuesta);
  }

  async procesar(datosEntrada, contextoUsuario, funcionEjecucion) {
    const evaluacion = await this.evaluar(datosEntrada, contextoUsuario);

    if (evaluacion.aprobado) {
      return funcionEjecucion(evaluacion.datos_refinados || datosEntrada);
    } else {
      await Telemetry.registrarBloqueo(datosEntrada, evaluacion.razon);
      return { error: true, mensaje: evaluacion.razon };
    }
  }
}
