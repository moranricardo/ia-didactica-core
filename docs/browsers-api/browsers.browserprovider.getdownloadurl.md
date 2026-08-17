---
sidebar_label: BrowserProvider.getDownloadUrl
---

# Método BrowserProvider.getDownloadUrl()

Obtiene la URL de descarga para el navegador solicitado.

El buildId puede ser una versión exacta (ej., "131.0.6778.109") o un alias (ej., "latest", "stable"). Los proveedores personalizados deben manejar la resolución de versiones internamente si admiten alias.

Devuelve null si el buildId no se puede resolver a una versión válida. La URL no está validada; la descarga fallará más adelante si la URL no existe.

Puede ser síncrono para la construcción simple de URLs o asíncrono si se necesitan resolución de versiones o solicitudes de red.

### Firma

```typescript
interface BrowserProvider {
  getDownloadUrl(options: DownloadOptions): Promise<URL | null> | URL | null;
}
```

## Parámetros

<table><thead><tr><th>
Parámetro
</th><th>
Tipo
</th><th>
Descripción
</th></tr></thead>
<tbody><tr><td>
options
</td><td>
[DownloadOptions](./browsers.downloadoptions.md)
</td><td>
Opciones de descarga (buildId puede ser un alias o una versión exacta)
</td></tr>
</tbody></table>

**Retorna:**

Promise&lt;URL \| null&gt; \| URL \| null

URL de descarga, o null si la versión no se puede resolver
