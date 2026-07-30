#!/usr/bin/env python3
import sys
import json
import argparse
from pathlib import Path

# Garantizar resolución del módulo core
sys.path.append(str(Path(__file__).parent / "core"))

from mutator_emulator import AlgoritmoMutadorEmulador

def main():
    parser = argparse.ArgumentParser(
        description="CLI para la Capa de Emulación Contextual - ia-didactica-core (SSoT)"
    )
    
    parser.add_argument("--key", type=str, required=True, help="Clave de transacción para la mutación")
    parser.add_argument("--type", type=str, default="EMULATE", help="Tipo de mutación (default: EMULATE)")
    
    # Grupo de entrada de payload (por argumento directo o por archivo JSON)
    input_group = parser.add_mutually_exclusive_group(required=True)
    input_group.add_argument("--payload", type=str, help="Cadena JSON o string raw con el payload")
    input_group.add_argument("--file", type=str, help="Ruta a un archivo JSON con el payload")

    args = parser.parse_args()

    # Procesar origen del payload
    if args.file:
        file_path = Path(args.file)
        if not file_path.exists():
            print(f"❌ Error: El archivo '{args.file}' no existe.", file=sys.stderr)
            sys.exit(1)
        with open(file_path, "r", encoding="utf-8") as f:
            raw_data = f.read()
    else:
        raw_data = args.payload

    # Instanciar el motor y procesar
    motor = AlgoritmoMutadorEmulador()

    try:
        # 1. Mutar estado
        mut_res = motor.mutate_state(args.key, raw_data, args.type)
        
        # 2. Evaluar contexto
        eval_res = motor.evaluate_contextual_payload(args.key)
        
        # Formatear salida JSON limpia
        output = {
            "transaction": mut_res,
            "evaluation": eval_res
        }
        print(json.dumps(output, indent=2, ensure_ascii=False))

    except Exception as e:
        print(json.dumps({"error": str(e)}, indent=2), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
