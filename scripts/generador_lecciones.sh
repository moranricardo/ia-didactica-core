#!/bin/bash

# Validación de parámetros
if [ -z "$1" ]; then
  echo "⚠️ Error: Falta la palabra objetivo."
  echo "Uso: ./scripts/generador_lecciones.sh <palabra_a_buscar>"
  exit 1
fi

PALABRA=$1
# Convertimos la palabra a minúsculas para estandarizar el nombre del archivo
PALABRA_NORMALIZADA=$(echo "$PALABRA" | tr '[:upper:]' '[:lower:]')
FECHA_ISO=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
TIMESTAMP=$(date -u +"%Y%m%d_%H%M%S")
ARCHIVO="lecciones/leccion_dem_${PALABRA_NORMALIZADA}_${TIMESTAMP}.md"

# URL de búsqueda del DEM Colmex
URL_DEM="https://dem.colmex.mx/app/Busqueda/BuscarEnDiccionario?q=${PALABRA}"

echo "=== [PEDAGOGÍA] Estructurando nueva lección para: $PALABRA ==="

# Generación del archivo con inyección de metadatos
cat << TEXTO > "$ARCHIVO"
---
name: "leccion_lexicografica_${PALABRA_NORMALIZADA}"
descripcion: "Análisis lexicográfico de la palabra '${PALABRA}' basado en el DEM Colmex."
huella: "chrome-mobile-es-419"
custodio: "@ricardomoranbot"
referencia: "https://dem.colmex.mx/"
fecha: "${FECHA_ISO}"
url_consulta: "${URL_DEM}"
---

# Módulo Didáctico: Análisis Lexicográfico de "${PALABRA}"

## 📚 Definición Base (DEM Colmex)
> *Espacio reservado para la extracción automatizada de la definición de '${PALABRA}'.*
> **Consulta directa:** [Ver entrada en el DEM](${URL_DEM})

## ⚙️ Parámetros de Integración
* **Motor Generador:** \`ia-didactica-core/scripts/generador_lecciones.sh\`
* **Estándar Léxico:** Diccionario del Español de México (Colmex)

## 📝 Evaluación CI/CD
El sistema de orquestación en la nube verificará que esta estructura cumpla con el estándar de metadatos definido en \`modelo_maestro.json\`.
TEXTO

echo "[ÉXITO] Lección base generada en: $ARCHIVO"
