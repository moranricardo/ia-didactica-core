#!/bin/bash

set -e

if [ -z "$1" ]; then
  echo "⚠️ Error: Falta la palabra objetivo."
  echo "Uso: ./scripts/generador_lecciones.sh <palabra_a_buscar>"
  exit 1
fi

PALABRA="$1"
SLUG=$(echo "$PALABRA" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g; s/--*/-/g; s/^-//; s/-$//')
FECHA_ISO=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
ARCHIVO="lecciones/dem-${SLUG}.md"
URL_DEM="https://dem.colmex.mx/app/Busqueda/BuscarEnDiccionario?q=${PALABRA}"

echo "=== [PEDAGOGÍA] Estructurando nueva lección lexicográfica: $PALABRA ==="

mkdir -p lecciones

cat << TEXTO > "$ARCHIVO"
---
name: "leccion_lexicografica_${SLUG}"
descripcion: "Análisis lexicográfico de '${PALABRA}' basado en el DEM Colmex."
propietario: "Ricardo Moran"
custodio: "@ricardomoranbot"
huella: "chrome-mobile-es-419"
referencia: "https://dem.colmex.mx/"
fecha: "${FECHA_ISO}"
url_consulta: "${URL_DEM}"
---

# Módulo Didáctico: Análisis Lexicográfico de "${PALABRA}"

## 📚 Definición Base (DEM Colmex)
> *Espacio reservado para la extracción automatizada de la definición de '${PALABRA}'.*
> **Consulta directa:** [Ver entrada en el DEM](${URL_DEM})

## ⚙️ Parámetros de Integración
* **Motor Generador:** \`scripts/generador_lecciones.sh\`
* **Estándar Léxico:** Diccionario del Español de México (Colmex)

## 📝 Evaluación CI/CD
El sistema de orquestación en la nube verificará que esta estructura cumpla con el estándar de metadatos definido en \`modelo_maestro.json\`.
TEXTO

chmod +x "$ARCHIVO" 2>/dev/null || true
echo "[ÉXITO] Lección generada en: $ARCHIVO"
