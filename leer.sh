#!/bin/bash

# 1. Validar dependencias
if ! command -v curl &> /dev/null; then
  echo "❌ Error: Se requiere 'curl' para ejecutar este script."
  exit 1
fi

if [ -z "$1" ]; then
  echo "⚠️ Uso: ./leer.sh <nombre_del_archivo.md>"
  echo "Ejemplo: ./leer.sh async-await.md"
  exit 1
fi

ARCHIVO="$1"
REPO="moranricardo/ia-didactica-core"
URL="https://api.github.com/repos/$REPO/contents/lecciones/$ARCHIVO"

# Cargar Token de GitHub si existe
HEADERS=(-H "Accept: application/vnd.github.v3.raw")
if [ -n "$GITHUB_TOKEN" ]; then
  HEADERS+=(-H "Authorization: Bearer $GITHUB_TOKEN")
elif [ -f "$HOME/.token_github" ]; then
  TOKEN=$(cat "$HOME/.token_github" | tr -d '\r\n')
  HEADERS+=(-H "Authorization: Bearer $TOKEN")
fi

echo "📖 Cargando lección: '$ARCHIVO' desde GitHub SSoT..."

# Petición HTTP comprobando código de estado
HTTP_CODE=$(curl -s -o /tmp/leccion_tmp.md -w "%{http_code}" "${HEADERS[@]}" "$URL")

if [ "$HTTP_CODE" -eq 200 ]; then
  cat /tmp/leccion_tmp.md
  rm -f /tmp/leccion_tmp.md
else
  echo "❌ Error ($HTTP_CODE): No se pudo leer el archivo '$ARCHIVO'. Verifica que exista en 'lecciones/'."
  rm -f /tmp/leccion_tmp.md
  exit 1
fi

echo ""
