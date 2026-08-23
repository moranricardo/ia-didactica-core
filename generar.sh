#!/bin/bash

# Validar dependencias necesarias
for cmd in curl jq; do
  if ! command -v $cmd &> /dev/null; then
    echo "❌ Error: Se requiere '$cmd' para ejecutar este script."
    exit 1
  fi
done

if [ -z "$1" ]; then
  echo "⚠️ Uso: ./generar.sh \"Tema de la lección\" [nivel]"
  echo "Ejemplo: ./generar.sh \"Async/Await en Node.js\" intermedio"
  exit 1
fi

TEMA="$1"
NIVEL="${2:-principiante}"
API_URL="http://localhost:3000/api/leccion"

# Construir payload JSON de forma segura
PAYLOAD=$(jq -n --arg tema "$TEMA" --arg nivel "$NIVEL" '{tema: $tema, nivel: $nivel}')

echo "🤖 Generando lección para: '$TEMA' (Nivel: $NIVEL)..."

# Ejecutar petición POST
RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD")

# Comprobar si hubo respuesta válida
if [ -z "$RESPONSE" ]; then
  echo "❌ Error: No se pudo conectar con el servidor en $API_URL. ¿Asegúrate de que 'node src/server.js' está corriendo."
  exit 1
fi

echo "$RESPONSE" | jq . 2>/dev/null || echo "$RESPONSE"
echo ""
