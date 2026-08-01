#!/bin/bash

# Configuración de variables
TARGET_DIR="dump"
DATE=$(date +'%Y-%m-%d_%H-%M-%S')
ARCHIVE_NAME="backup_${DATE}.tar.gz"
TAG_NAME="respaldo-${DATE}"

echo "🔄 Iniciando empaquetado..."

# Verificar si la carpeta existe y tiene contenido (con comillas dobles de seguridad)
if [ ! -d "$TARGET_DIR" ] || [ -z "$(ls -A "$TARGET_DIR")" ]; then
    echo "⚠️ La carpeta '$TARGET_DIR' está vacía o no existe. No hay nada que subir."
    exit 1
fi

# Comprimir el contenido
echo "📦 Comprimiendo '$TARGET_DIR' en $ARCHIVE_NAME..."
tar -czf "$ARCHIVE_NAME" "$TARGET_DIR"

# Subir a GitHub usando la CLI (gh) y evaluar directamente el resultado
echo "☁️ Subiendo a la nube de GitHub..."
if gh release create "$TAG_NAME" "$ARCHIVE_NAME" --title "Respaldo $DATE" --notes "Carga pesada enviada desde entorno local."; then
    echo "✅ Subida exitosa. Limpiando almacenamiento..."
    
    # Borrar la carpeta completa y volver a crearla (garantiza eliminar archivos ocultos)
    rm -rf "$TARGET_DIR"
    mkdir "$TARGET_DIR"
    
    # Borrar el archivo comprimido
    rm "$ARCHIVE_NAME"
    
    echo "🚀 ¡Espacio liberado! Tu entorno vuelve a estar ligero."
else
    echo "❌ Ocurrió un error al subir. Los archivos locales NO se han borrado por seguridad."
    exit 1
fi
