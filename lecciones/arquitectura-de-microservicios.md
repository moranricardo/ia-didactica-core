# Arquitectura de Microservicios

> Modelo: gemini-3.5-flash | 2026-07-28T05:57:03.254Z

La arquitectura de microservicios divide una aplicación compleja en un conjunto de servicios pequeños, autónomos y desplegables de forma independiente. Para que tu arquitectura sea robusta, debes aplicar el patrón **Database-per-Service**: cada microservicio debe ser dueño de sus propios datos. Compartir una base de datos entre servicios destruye el desacoplamiento.

### Ejemplo de implementación

Imagina que estás construyendo un e-commerce. Tienes el `OrderService` (puerto 3001) y el `InventoryService` (puerto 3002). En lugar de hacer un `JOIN` directo a la base de datos de inventario desde el servicio de órdenes, debes comunicarte a través de API (HTTP/gRPC).

Aquí tienes cómo implementarlo hoy mismo en Node.js:

javascript
// OrderService - crearOrden.js
async function crearOrden(clienteId, productoId, cantidad) {
  // 1. Consultamos al servicio de Inventario mediante su API
  const respuesta = await fetch(`http://inventory-service:3002/productos/${productoId}/validar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cantidad })
  });
  
  const { disponible } = await respuesta.json();
  if (!disponible) throw new Error("Sin stock disponible");

  // 2. Si hay stock, registramos la orden en nuestra base de datos local
  return baseDatosOrdenes.save({ clienteId, productoId, cantidad, estado: 'CREADA' });
}


### Analogía

Piensa en un centro comercial con un patio de comidas. El puesto de hamburguesas y el de sushi no comparten la misma nevera ni los mismos cocineros. Si el puesto de hamburguesas necesita aguacate del puesto de sushi, no entra a su cocina a tomarlo; se lo pide formalmente al encargado. Cada negocio funciona de manera autónoma; si uno cierra por mantenimiento, el otro sigue vendiendo.

¿Te ha quedado claro el concepto?

---
*Generado por ia-didactica-core V4*
---
## 🛡️ Sello de Propiedad Intelectual

**Propietario:** Ricardo Moran
**Bot Custodio:** @ricardomoranbot
**Huella de Dispositivo:** `chrome-mobile-es-419`
**Origen:** IA-Didactica-Core Cloud Pipeline
**Generado:** 2026-07-28T05:57:03Z
**Workflow URL:** https://github.com/moranricardo/ia-didactica-core/actions/runs/30333171204
**Licencia:** MIT + Atribución Obligatoria a Ricardo Moran

> Este documento está firmado digitalmente en la nube. Cualquier clon o uso sin esta huella es una copia no autorizada.

```json
{
  "owner": "Ricardo Moran",
  "bot": "ricardomoranbot",
  "huella": "chrome-mobile-es-419",
  "archivo": "lecciones/arquitectura-de-microservicios.md",
  "timestamp": "2026-07-28T05:57:03Z",
  "runUrl": "https://github.com/moranricardo/ia-didactica-core/actions/runs/30333171204"
}
```
