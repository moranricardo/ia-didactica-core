import unittest
import sys
from pathlib import Path

# Agregar el directorio actual al path para evitar problemas de importación
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

if __name__ == "__main__":
    unittest.main()
