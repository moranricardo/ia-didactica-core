import os from 'os';

export class MutatorEmulator {
  constructor() {
    this.state = "INITIALIZED";
    this.deviceProfile = {
      model: "Moto E6",
      os: "Android 9 (Pie)",
      maxMemoryMB: Math.round(os.totalmem() / (1024 * 1024)),
      platform: process.platform,
      arch: process.arch
    };
  }

  async evaluatePayload(payload, reglaValidacion = null) {
    const estimacionPeso = JSON.stringify(payload).length;
    if (estimacionPeso > 2 * 1024 * 1024) {
      return {
        status: "REJECTED",
        decision: "FAIL",
        reason: "Payload excede el límite de memoria para Moto E6 (2MB max)",
        deviceProfile: this.deviceProfile
      };
    }

    const payloadEfimero = typeof payload === 'object' 
      ? JSON.parse(JSON.stringify(payload)) 
      : payload;

    try {
      if (typeof reglaValidacion === 'function') {
        const esValido = await reglaValidacion(payloadEfimero);
        return {
          status: "SUCCESS",
          decision: esValido ? "PASS" : "REJECT",
          payload: payloadEfimero,
          deviceProfile: this.deviceProfile
        };
      }

      return {
        status: "SUCCESS",
        decision: "PASS",
        payload: payloadEfimero,
        deviceProfile: this.deviceProfile
      };
    } catch (error) {
      return {
        status: "ERROR",
        decision: "FAIL",
        reason: error.message,
        payload: payloadEfimero,
        deviceProfile: this.deviceProfile
      };
    }
  }
}

export default MutatorEmulator;
