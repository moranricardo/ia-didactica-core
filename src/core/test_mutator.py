import unittest
from mutator_emulator import MutatorEmulator

class TestMutatorEmulator(unittest.TestCase):
    def test_evaluation(self):
        emulator = MutatorEmulator()
        res = emulator.evaluate_payload({"test": True})
        self.assertEqual(res["status"], "SUCCESS")

if __name__ == '__main__':
    unittest.main()
