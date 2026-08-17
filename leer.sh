#!/bin/bash

if [ -z "$1" ]; then
  echo "⚠️ Uso: ./leer.sh <nombre_del_archivo.md>"
  exit 1
fi

ARCHIVO="$1"

echo "📖 Cargando lección: '$ARCHIVO'..."
curl -s -H "Accept: application/vnd.github.v3.raw" \
  https://api.github.com/repos/moranricardo/ia-didactica-core/contents/lecciones/$ARCHIVO || echo "❌ No se pudo leer el archivo"
echo ""
