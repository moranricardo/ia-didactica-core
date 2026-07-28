# Variables de Entorno y Configuración Segura

> **Modelo:** gemini-3.5-flash | **Fecha:** 2026-07-28  
> **Proyecto:** `ia-didactica-core` V4  

## Definición Técnica
Las **Variables de Entorno** son valores dinámicos que configuran el comportamiento de un software sin modificar su código fuente. Su separación mediante archivos `.env` protegidos por `.gitignore` evita la exposición involuntaria de secretos en repositorios públicos o privados.

## Ejemplo Práctico
```bash
# Crear estructura de ejemplo para la lección
mkdir -p demo-env && cd demo-env

# 1. Definir variables en un archivo .env local
cat << 'EOF' > .env
PORT=3000
API_KEY=secret_token_12345
EOF

# 2. Ignorar el archivo de secretos en Git
echo ".env" > .gitignore

# 3. Leer las variables en un script
cat << 'EOF' > index.js
require('dotenv').config();
console.log(`Servidor en puerto: ${process.env.PORT}`);
EOF
