---
sidebar_label: BrowserFetcher
---

# Clase BrowserFetcher

Clase que gestiona la descarga y extracción de navegadores.

### Firma

```typescript
export declare class BrowserFetcher {
  browser: Browser;
  buildId: string;
  platform: BrowserPlatform;
  cacheDir: string;
  download(): Promise<void>;
  getExecutablePath(): string;
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
cacheDir
</td><td>
string
</td><td>
Directorio de caché
</td></tr>
</tbody></table>

## Métodos

<table><thead><tr><th>
Método
</th><th>
Descripción
</th></tr></thead>
<tbody><tr><td>
download()
</td><td>
Inicia la descarga del navegador
</td></tr>
<tr><td>
getExecutablePath()
</td><td>
Devuelve la ruta al ejecutable instalado
</td></tr>
</tbody></table>
