# ia-didactica-core
Ecosistema de IA Didáctica Autónoma v1.0.

## Arquitectura
Este repositorio funciona como la **Fuente Única de Verdad (SSoT)** para el núcleo lógico de la IA. La arquitectura se basa en un paradigma de **Seguridad Intrínseca** y **Ejecución Efímera**, donde toda la lógica reside en la nube y se ejecuta en memoria temporal (RAM), eliminando persistencia local en dispositivos.

## Protocolo de Operación (POD v1.0)
- **Persistencia Externa**: Prohibido el uso de almacenamiento local (`fs`). Toda persistencia se gestiona vía `GitHubStorage.js`.
- **Runtime Efímero**: La ejecución se realiza en entornos volátiles (Termux/Codespaces) cargando recursos directamente desde esta SSoT mediante `curl` o invocaciones de API.
- **Agente Crítico**: Núcleo de razonamiento en bucle cerrado encargado de auditar, refinar y redirigir interacciones bajo la Constitución del Sistema.

## Componentes
- `/src/core/AgenteCritico.js`: Motor de autocrítica y validación.
- `/src/storage/GitHubStorage.js`: Interfaz de persistencia para comunicación exclusiva con la API de GitHub.
- `main.js`: Orquestador de ejecución efímera.

---
*IA Didáctica Autónoma: Inferencia Adaptativa y Seguridad Intrínseca.*
