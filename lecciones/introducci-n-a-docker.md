# Introducción a Docker

> Modelo: gemini-3.5-flash | 2026-07-28T06:13:32.141Z

Hola. Como arquitecto de software, te aseguro que el clásico "en mi máquina funciona" se cura con Docker.

**Definición**
Docker es una plataforma de contenedorización que empaqueta tu aplicación y sus dependencias (código, runtime, librerías) en un contenedor aislado. A diferencia de una máquina virtual, Docker no replica un sistema operativo completo; comparte el kernel del host, lo que lo hace extremadamente ligero, rápido y eficiente en el consumo de recursos.

**Ejemplo**
Para desplegar un servidor web Nginx ahora mismo, instala Docker y ejecuta en tu terminal el siguiente comando:

bash
docker run -d -p 8080:80 --name mi-servidor nginx


Este comando descarga la imagen oficial de Nginx, crea un contenedor, mapea el puerto 8080 de tu máquina local al puerto 80 del contenedor y lo ejecuta en segundo plano (`-d`). Si abres `http://localhost:8080` en tu navegador, verás el servidor funcionando de inmediato.

**Analogía**
Piensa en Docker como el transporte marítimo moderno. Antes, cargar mercancías de diferentes formas y tamaños en un barco era un caos logístico. La solución fue el contenedor estandarizado. No importa si transportas ropa, alimentos o electrodomésticos; el contenedor tiene una forma única y se apila exactamente igual en cualquier barco o camión del mundo. Docker hace lo mismo con tu código: empaqueta tu software en un formato estándar para que funcione idéntico en tu laptop, en el servidor de pruebas o en la nube.

¿Te ha quedado claro el concepto?

---
*Generado por ia-didactica-core V4*