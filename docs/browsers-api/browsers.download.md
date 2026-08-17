---
sidebar_label: download
---

# Función download()

Descarga un navegador según las opciones provistas.

### Firma

```typescript
export declare function download(
  options: DownloadOptions
): Promise<BrowserFetcher | undefined>;
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
Opciones para descargar el navegador
</td></tr>
</tbody></table>

**Retorna:**

Promise&lt;BrowserFetcher \| undefined&gt;

Instancia de BrowserFetcher si la descarga es exitosa, o undefined
