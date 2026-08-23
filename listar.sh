#!/bin/bash

# 1. Validar dependencias
for cmd in curl jq; do
  if ! command -v $cmd &> /dev/null; then
    echo "❌ Error: Se requiere '$cmd' para ejecutar este script."
    exit 1
  fi
done

REPO="moranricardo/ia-didactica-core"
URL="https://api.github.com/repos/$REPO/contents/lecciones"

# Cargar Token de GitHub si existe
HEADERS=(-H "Accept: application/vnd.github.v3+json")
if [ -n "$GITHUB_TOKEN" ]; then
  HEADERS+=(-H "Authorization: Bearer $GITHUB_TOKEN")
elif [ -f "$HOME/.token_github" ]; then
  TOKEN=$(cat "$HOME/.token_github" | tr -d '\r\n')
  HEADERS+=(-H "Authorization: Bearer $TOKEN")
fi

echo "📚 Consultando lecciones disponibles en GitHub SSoT..."

RESPONSE=$(curl -s "${HEADERS[@]}" "$URL")

# Comprobar si la respuesta contiene un arreglo válido
if echo "$RESPONSE" | jq -e 'if type=="array" then true else false end' > /dev/null 2>&1; then
  echo "$RESPONSE" | jq -r '.[] | "📄 " + .name + " (" + (.size|tostring) + " bytes)"'
else
  echo "❌ No se pudieron listar las lecciones (Verifica que la carpeta 'lecciones' exista o no esté vacía)."
fi

echo ""
