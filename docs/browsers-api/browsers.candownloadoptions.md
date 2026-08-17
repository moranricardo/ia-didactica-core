---
sidebar_label: CanDownloadOptions
---

# Interfaz CanDownloadOptions

Opciones para verificar si se puede descargar un navegador.

### Firma

```typescript
interface CanDownloadOptions {
  browser: Browser;
  buildId: string;
  cacheDir: string;
  platform: BrowserPlatform;
}
```

## Propiedades

<table><thead><tr><th>
Propiedad
</th><th>
Tipo
</th><th>
Descripción
</th></tr></thead>
<tbody><tr><td>
browser
</td><td>
[Browser](./browsers.browser.md)
</td><td>
Navegador
</td></tr>
<tr><td>
buildId
</td><td>
string
</td><td>
ID de compilación
</td></tr>
<tr><td>
cacheDir
</td><td>
string
</td><td>
Directorio de caché
</td></tr>
<tr><td>
platform
</td><td>
[BrowserPlatform](./browsers.browserplatform.md)
</td><td>
Plataforma
</td></tr>
</tbody></table>
