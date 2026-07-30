import json
from typing import Dict, Any, Union

class AlgoritmoMutadorEmulador:
    """
    Núcleo del Algoritmo Mutador-Emulador (Capa 3 Antiflow - SSoT).
    Gestión de mutaciones de estado efímeras y emulación de respuestas didácticas.
    """
    
    FORBIDDEN_MUTATIONS = {"DESTRUCTIVO", "DROP_DATABASE", "OVERWRITE_ROOT"}

    def __init__(self):
        self.emulated_states: Dict[str, Any] = {}

    def mutate_state(self, key: str, payload: Union[str, Dict[str, Any]], mutation_type: str) -> str:
        if mutation_type.upper() in self.FORBIDDEN_MUTATIONS:
            raise PermissionError(f"[SECURITY_BLOCK] Tipo de mutación no permitido: {mutation_type}")

        self.emulated_states[key] = {
            "payload": payload,
            "type": mutation_type
        }
        return f"[✓] Transacción registrada con éxito (Key: {key})"

    def evaluate_contextual_payload(self, key: str) -> Dict[str, Any]:
        """
        Capa de Emulación Contextual:
        Interpreta los payloads efímeros guardados y evalúa la respuesta didáctica.
        """
        if key not in self.emulated_states:
            raise KeyError(f"[CONTEXT_ERROR] La clave '{key}' no existe en el estado simulado.")

        state = self.emulated_states[key]
        raw_payload = state["payload"]

        # Parsear si viene como cadena JSON
        if isinstance(raw_payload, str):
            try:
                data = json.loads(raw_payload)
            except json.JSONDecodeError:
                data = {"raw_content": raw_payload}
        else:
            data = raw_payload

        # Normalización y evaluación del contexto didáctico
        level = data.get("level", "BEGINNER").upper()
        topic = data.get("topic", "General")
        score = float(data.get("score", 0.0))

        # Cálculo de recomendación pedagógica
        if score >= 85.0:
            action = "AVANZAR_SIGUIENTE_MODULO"
            feedback = "Excelente comprensión. Incrementar la dificultad de la mutación."
        elif score >= 60.0:
            action = "REFORZAR_CONCEPTO"
            feedback = "Comprensión adecuada. Generar ejercicio interactivo de apoyo."
        else:
            action = "REPASO_GUIADO"
            feedback = "Dificultad detectada. Retroceder a emulación de baja complejidad."

        return {
            "key": key,
            "evaluated_level": level,
            "topic": topic,
            "score": score,
            "pedagogical_action": action,
            "feedback": feedback,
            "status": "EVALUATED_OK"
        }
