---
sidebar_label: resolveBuildId
---

# Función resolveBuildId()

Resuelve una etiqueta (ej. "latest", "stable") a un ID de compilación (buildId) exacto.

### Firma

```typescript
export declare function resolveBuildId(
  browser: Browser,
  platform: BrowserPlatform,
  tag: BrowserTag
): Promise<string>;
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
browser
</td><td>
[Browser](./browsers.browser.md)
</td><td>
Navegador
</td></tr>
<tr><td>
platform
</td><td>
[BrowserPlatform](./browsers.browserplatform.md)
</td><td>
Plataforma
</td></tr>
<tr><td>
tag
</td><td>
[BrowserTag](./browsers.browsertag.md)
</td><td>
Etiqueta o alias (ej. latest, stable)
</td></tr>
</tbody></table>

**Retorna:**

Promise&lt;string&gt;

ID de compilación exacto resuelto
