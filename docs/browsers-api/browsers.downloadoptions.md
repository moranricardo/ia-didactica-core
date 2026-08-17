---
sidebar_label: DownloadOptions
---

# Interfaz DownloadOptions

Opciones para descargar un navegador.

### Firma

```typescript
interface DownloadOptions {
  browser: Browser;
  buildId: string;
  cacheDir: string;
  platform: BrowserPlatform;
  baseUrl?: string;
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
ID de compilación o etiqueta (ej. latest, stable)
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
<tr><td>
baseUrl
</td><td>
string
</td><td>
(Opcional) URL base personalizada para la descarga
</td></tr>
</tbody></table>
