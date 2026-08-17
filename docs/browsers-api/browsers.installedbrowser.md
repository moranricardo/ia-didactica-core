---
sidebar_label: InstalledBrowser
---

# Interfaz InstalledBrowser

Representa un navegador ya instalado en la caché.

### Firma

```typescript
interface InstalledBrowser {
  browser: Browser;
  buildId: string;
  platform: BrowserPlatform;
  path: string;
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
platform
</td><td>
[BrowserPlatform](./browsers.browserplatform.md)
</td><td>
Plataforma
</td></tr>
<tr><td>
path
</td><td>
string
</td><td>
Ruta absoluta al ejecutable instalado
</td></tr>
</tbody></table>
