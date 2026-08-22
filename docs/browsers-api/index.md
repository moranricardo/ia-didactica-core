# 🌐 API de Gestión de Navegadores (docs/browsers-api)

Esta sección documenta la API interna para la descarga, verificación y orquestación de binarios de navegadores headless (Chromium, Firefox) en el entorno de automatización del proyecto.

---

## 📌 Métodos y Referencias Principales

* **installedBrowsers**: Recupera la lista de navegadores instalados en la caché local.
* **canDownload**: Verifica si una versión/build específica de un navegador está disponible para descarga.
* **resolveBuildId**: Resuelve etiquetas de versión (como `latest` o `canary`) a un ID de compilación específico.
* **uninstall**: Elimina versiones obsoletas del directorio de caché para liberar almacenamiento.

---

## 🛠️ Configuración de Caché en Entornos Restringidos (ej. Termux / CI)

Al ejecutar procesos de navegador en entornos con recursos limitados o rutas personalizadas, asegúrate de definir la variable de entorno PUPPETEER_CACHE_DIR:

export PUPPETEER_CACHE_DIR="$HOME/.cache/puppeteer"

---
*Documentación mantenida para la arquitectura de automatización de IA-Didactica-Core.*
