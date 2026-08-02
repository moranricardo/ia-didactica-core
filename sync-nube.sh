#!/bin/bash

DESTINO="$HOME/storage/shared/Boveda_Git"
FECHA=$(date +"%Y-%m-%d_%H-%M")
NOMBRE_ARCHIVO="respaldo_workspace_$FECHA.tar.gz"

echo "🚀 Iniciando compresión optimizada de tu espacio de trabajo..."

tar --exclude="node_modules" \
    --exclude=".git" \
    -czf "$DESTINO/$NOMBRE_ARCHIVO" \
    -C "$HOME" git/

echo "✅ Empaquetado optimizado completado."
echo "📦 Archivo guardado en: $DESTINO/$NOMBRE_ARCHIVO"
