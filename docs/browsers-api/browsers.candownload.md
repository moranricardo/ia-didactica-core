---
sidebar_label: canDownload
---

# Función canDownload()

Verifica si se puede descargar un navegador específico según las opciones provistas.

### Firma

```typescript
export declare function canDownload(
  options: CanDownloadOptions
): Promise<boolean>;
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
[CanDownloadOptions](./browsers.candownloadoptions.md)
</td><td>
Opciones para verificar la descarga
</td></tr>
</tbody></table>

**Retorna:**

Promise&lt;boolean&gt;

True si se puede descargar, false en caso contrario
