import unittest
import sys
from pathlib import Path

# Garantizar resolución de módulos
sys.path.append(str(Path(__file__).parent))

from mutator_emulator import AlgoritmoMutadorEmulador

class TestMutadorEmulador(unittest.TestCase):
    def setUp(self):
        self.motor = AlgoritmoMutadorEmulador()

    def test_mutation_success(self):
        res = self.motor.mutate_state("test_key", "test_payload", "EMULATE")
        self.assertIn("[✓] Transacción registrada con éxito", res)

    def test_destructive_mutation_blocked(self):
        with self.assertRaises(PermissionError):
            self.motor.mutate_state("test_key", "test_payload", "DESTRUCTIVO")

    def test_contextual_evaluation_advanced(self):
        payload = {"topic": "Algoritmos", "level": "ADVANCED", "score": 90.0}
        self.motor.mutate_state("ctx_1", payload, "EMULATE")
        result = self.motor.evaluate_contextual_payload("ctx_1")

        self.assertEqual(result["pedagogical_action"], "AVANZAR_SIGUIENTE_MODULO")
        self.assertEqual(result["status"], "EVALUATED_OK")

    def test_contextual_evaluation_remedial(self):
        payload = '{"topic": "Estructuras de Datos", "score": 45.0}'
        self.motor.mutate_state("ctx_2", payload, "EMULATE")
        result = self.motor.evaluate_contextual_payload("ctx_2")

        self.assertEqual(result["pedagogical_action"], "REPASO_GUIADO")

if __name__ == "__main__":
    unittest.main()
