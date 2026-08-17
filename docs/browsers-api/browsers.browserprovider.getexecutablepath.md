---
sidebar_label: BrowserProvider.getExecutablePath
---

# Método BrowserProvider.getExecutablePath()

Obtiene la ruta relativa al ejecutable dentro del archivo extraído.

### Firma

```typescript
interface BrowserProvider {
  getExecutablePath(options: {
    browser: Browser;
    buildId: string;
    platform: BrowserPlatform;
  }): Promise<string> | string;
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
&#123; browser: [Browser](./browsers.browser.md); buildId: string; platform: [BrowserPlatform](./browsers.browserplatform.md); &#125;
</td><td>
Navegador, buildId y plataforma
</td></tr>
</tbody></table>

**Retorna:**

Promise&lt;string&gt; \| string

Ruta relativa al ejecutable
