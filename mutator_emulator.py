# =====================================================================
# Módulo: mutator_emulator.py (ia-didactica-core / SSoT Compliant)
# Descripción: Motor de mutación de estados y emulación contextual.
# =====================================================================

import json
import os
import sys

class AlgoritmoMutadorEmulador:
    def __init__(self, context_path=None):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        self.context_path = context_path or base_dir
        self.state_buffer = {}

    def mutate_state(self, key: str, mutation_payload):
        """Aplica una mutación efímera controlada sobre el diccionario activo."""
        if not key or not isinstance(key, str):
            raise ValueError("La clave de mutación debe ser una cadena no vacía.")
            
        print(f"[Mutator] Aplicando mutación en clave: {key}")
        self.state_buffer[key] = {
            "payload": mutation_payload,
            "status": "MUTATED_ACTIVE"
        }
        return self.state_buffer[key]

    def emulate_behavior(self, key: str) -> str:
        """Emula el comportamiento contextual basado en la mutación inyectada."""
        if key in self.state_buffer:
            print(f"[Emulator] Emulando respuesta para el estado: {key}")
            payload = self.state_buffer[key]['payload']
            return f"Emulación exitosa bajo contexto seguro para: {payload}"
            
        return "[!] Error: No se encuentra estado mutado válido para emular."

if __name__ == "__main__":
    try:
        engine = AlgoritmoMutadorEmulador()
        engine.mutate_state("vector_didactico", "optimizacion_cognitiva_v1")
        result = engine.emulate_behavior("vector_didactico")
        print(f"[✓] Salida del Algoritmo: {result}")
    except Exception as e:
        print(f"[❌] Error en ejecución de emulador: {e}", file=sys.stderr)
        sys.exit(1)
