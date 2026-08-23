import test from 'node:test';
import assert from 'node:assert/strict';
import { MutatorEmulator } from './MutatorEmulator.js';

test('MutatorEmulator - Evaluación exitosa por defecto', async () => {
  const emulator = new MutatorEmulator();
  const res = await emulator.evaluatePayload({ test: true });

  assert.equal(res.status, 'SUCCESS');
  assert.equal(res.decision, 'PASS');
  assert.equal(res.deviceProfile.model, 'Moto E6');
});

test('MutatorEmulator - Rechazo por exceso de peso (Límite RAM Moto E6)', async () => {
  const emulator = new MutatorEmulator();
  const payloadGigante = { data: 'X'.repeat(2.5 * 1024 * 1024) };
  const res = await emulator.evaluatePayload(payloadGigante);

  assert.equal(res.status, 'REJECTED');
  assert.equal(res.decision, 'FAIL');
  assert.match(res.reason, /límite de memoria/i);
});

test('MutatorEmulator - Inmutabilidad del payload original', async () => {
  const emulator = new MutatorEmulator();
  const payloadOriginal = { contador: 1 };
  
  const res = await emulator.evaluatePayload(payloadOriginal, (efimero) => {
    efimero.contador = 999;
    return true;
  });

  assert.equal(payloadOriginal.contador, 1);
  assert.equal(res.payload.contador, 999);
});
