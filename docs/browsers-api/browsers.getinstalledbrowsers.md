---
sidebar_label: getInstalledBrowsers
---

# Función getInstalledBrowsers()

Obtiene una lista de los navegadores instalados en la caché.

### Firma

```typescript
export declare function getInstalledBrowsers(
  options: { cacheDir?: string }
): Promise<InstalledBrowser[] | undefined>;
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
&#123; cacheDir?: string &#125;
</td><td>
Opciones con la ruta del directorio de caché
</td></tr>
</tbody></table>

**Retorna:**

Promise&lt;InstalledBrowser[] \| undefined&gt;

Lista de navegadores instalados o undefined
