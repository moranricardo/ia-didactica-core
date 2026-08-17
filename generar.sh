#!/bin/bash

if [ -z "$1" ]; then
  echo "⚠️ Uso: ./generar.sh \"Tema de la lección\" [nivel]"
  exit 1
fi

TEMA="$1"
NIVEL="${2:-principiante}"

echo "🤖 Generando lección para: '$TEMA' (Nivel: $NIVEL)..."
curl -s -X POST http://localhost:3000/api/leccion \
  -H "Content-Type: application/json" \
  -d "{\"tema\": \"$TEMA\", \"nivel\": \"$NIVEL\"}" | jq .
echo ""
