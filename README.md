# ia-didactica-core
Ecosistema de IA Didáctica Autónoma v1.0.

## Arquitectura
Este repositorio funciona como la Fuente Única de Verdad (SSoT) para el núcleo lógico de la IA. La arquitectura se basa en un paradigma de Seguridad Intrínseca y Ejecución Efímera, donde toda la lógica reside en la nube y se ejecuta en memoria temporal (RAM), eliminando persistencia local en dispositivos. El sistema implementa una arquitectura multi-agente orquestada a través de un servidor central.

## Protocolo de Operación (POD v1.0)
- Persistencia Externa: Prohibido el uso de almacenamiento persistente local (fs). Toda la persistencia de estado a largo plazo se gestiona vía API mediante GitHubStorage.js.
- Runtime Efímero: La ejecución se realiza en entornos volátiles (Termux/Codespaces) cargando recursos desde la SSoT de manera temporal.
- Agente Crítico: Núcleo de razonamiento en bucle cerrado encargado de auditar, refinar y redirigir interacciones garantizando el cumplimiento estricto de la Constitución del Sistema.

## Estructura y Componentes Principales
- /src/server.js: Punto de entrada HTTP (REST API), orquestador principal y manejo de webhooks.
- /src/cli.py: Herramienta de línea de comandos para emulación y pruebas de mutación (escáner SAST integrado).
- /src/core/: Lógica central que incluye los Agentes, el Orquestador y el cliente de modelos (GeminiClient).
- /src/storage/: Módulos de conexión (ej. GitHubStorage.js).
- /telemetry/: Módulo de persistencia temporal (state.json) para monitoreo del ciclo de vida de los agentes.
- /src/test/: Suite completa de pruebas (unitarias, integración y E2E).

## Inicio Rápido (Desarrollo)
1. Instalar dependencias: npm install
2. Iniciar el servidor centralizado: node src/server.js
3. Ejecutar auditoría SAST / CLI: python3 src/cli.py

---
IA Didáctica Autónoma: Inferencia Adaptativa, Modularidad y Seguridad Intrínseca.
