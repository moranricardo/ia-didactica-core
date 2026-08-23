#!/usr/bin/env python3
import os
import sys
import json
import re
import argparse
from datetime import datetime, timezone
from pathlib import Path

CURRENT_DIR = Path(__file__).resolve().parent
CORE_DIR = CURRENT_DIR.parent / "core" if (CURRENT_DIR.parent / "core").exists() else CURRENT_DIR / "core"
sys.path.insert(0, str(CORE_DIR))

try:
    from mutator_emulator import MutatorEmulator
    MUTATOR_AVAILABLE = True
except ImportError as e:
    MUTATOR_AVAILABLE = False
    IMPORT_ERROR_DETAIL = str(e)

SECRET_PATTERNS = [
    (r"QA[0-9A-Za-z-_]{20,}", "Modern Google/API Key (QA Prefix)"),
    (r"sk_live_[0-9a-zA-Z]{24,}", "Stripe Live Secret Key"),
    (r"ghp_[0-9a-zA-Z]{36}", "GitHub Personal Access Token"),
    (r"xox[baprs]-[0-9a-zA-Z]{10,48}", "Slack Token"),
    (r"-----BEGIN PRIVATE KEY-----", "Private Key PEM"),
    (r"bearer\s+[a-zA-Z0-9_\-\.]{20,}", "Hardcoded Bearer Token")
]

def scan_file_for_secrets(filepath):
    if any(ignored in filepath for ignored in ["cli.py", "package-lock.json", ".env.example"]):
        return []
    findings = []
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            for line_no, line in enumerate(f, 1):
                for pattern, desc in SECRET_PATTERNS:
                    if re.search(pattern, line):
                        findings.append({
                            "type": "Secret Exposed",
                            "severity": "HIGH",
                            "description": f"Detected potential {desc}",
                            "file": filepath,
                            "line": line_no
                        })
    except Exception:
        pass
    return findings

def scan_package_json(filepath):
    findings = []
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
            deps = data.get("dependencies", {})
            dev_deps = data.get("devDependencies", {})
            all_deps = {**deps, **dev_deps}
            insecure_versions = {"lodash": "4.17.21", "axios": "1.6.0", "express": "4.19.0"}
            for pkg, ver in all_deps.items():
                if pkg in insecure_versions:
                    findings.append({
                        "type": "Vulnerable Dependency",
                        "severity": "MEDIUM",
                        "description": f"Package '{pkg}' (version declared: {ver}) requires review against known CVEs.",
                        "file": filepath,
                        "line": 0
                    })
    except Exception:
        pass
    return findings

def audit_project(target_path):
    report = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "target": target_path,
        "total_findings": 0,
        "vulnerabilities": []
    }
    for root, dirs, files in os.walk(target_path):
        if any(exclude in root for exclude in ['.git', 'node_modules', 'telemetry', 'cache']):
            continue
        for file in files:
            if file == "package-lock.json":
                continue
            filepath = os.path.join(root, file)
            if file.endswith(('.js', '.py', '.json', '.md', '.sh', '.env', '.txt')):
                report["vulnerabilities"].extend(scan_file_for_secrets(filepath))
            if file == "package.json":
                report["vulnerabilities"].extend(scan_package_json(filepath))
    report["total_findings"] = len(report["vulnerabilities"])
    return report

def handle_emulate(args):
    if not MUTATOR_AVAILABLE:
        print(f"❌ Error crítico: No se pudo importar 'MutatorEmulator'. Detalle: {globals().get('IMPORT_ERROR_DETAIL', 'Desconocido')}", file=sys.stderr)
        sys.exit(1)

    if args.file:
        file_path = Path(args.file)
        if not file_path.exists():
            print(f"❌ Error: El archivo {args.file} no existe.", file=sys.stderr)
            sys.exit(1)
        raw_data = file_path.read_text(encoding="utf-8")
    else:
        raw_data = args.payload

    try:
        payload_obj = json.loads(raw_data)
    except Exception:
        payload_obj = raw_data

    motor = MutatorEmulator()
    try:
        result = motor.evaluate_payload(payload_obj)
        output = {
            "key": args.key,
            "type": args.type,
            "evaluation": result
        }
        print(json.dumps(output, indent=2, ensure_ascii=False))
    except Exception as e:
        print(json.dumps({"error": str(e)}, indent=2), file=sys.stderr)
        sys.exit(1)

def handle_scan(args):
    print(f"[*] Iniciando escaneo de seguridad en: {args.path} ...")
    results = audit_project(args.path)
    if args.format == "json":
        print(json.dumps(results, indent=2))
    else:
        print("\n" + "="*40)
        print("       REPORTE DE AUDITORÍA DE SEGURIDAD")
        print("="*40)
        print(f"Fecha: {results['timestamp']}")
        print(f"Ruta analizada: {results['target']}")
        print(f"Total de hallazgos: {results['total_findings']}\n")
        if results["total_findings"] == 0:
            print("✅ ¡Excelente! No se detectaron vulnerabilidades ni credenciales expuestas.")
        else:
            for idx, vuln in enumerate(results["vulnerabilities"], 1):
                print(f"[{idx}] Tipo: {vuln['type']}")
                print(f"    Severidad: {vuln['severity']}")
                print(f"    Descripción: {vuln['description']}")
                print(f"    Ubicación: {vuln['file']} (Línea: {vuln['line']})")
                print("-" * 40)

def main():
    parser = argparse.ArgumentParser(description="CLI Unificada - ia-didactica-core")
    subparsers = parser.add_subparsers(dest="command", required=True)

    p_emulate = subparsers.add_parser("emulate", help="Ejecuta emulación de mutaciones")
    p_emulate.add_argument("--key", type=str, required=True)
    p_emulate.add_argument("--type", type=str, default="EMULATE")
    group = p_emulate.add_mutually_exclusive_group(required=True)
    group.add_argument("--payload", type=str)
    group.add_argument("--file", type=str)
    p_emulate.set_defaults(func=handle_emulate)

    p_scan = subparsers.add_parser("scan", help="Ejecuta escaneo de seguridad")
    p_scan.add_argument("--path", default=".")
    p_scan.add_argument("--format", choices=["json", "markdown"], default="markdown")
    p_scan.set_defaults(func=handle_scan)

    args = parser.parse_args()
    args.func(args)

if __name__ == "__main__":
    main()
