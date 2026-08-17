---
sidebar_label: cacheDir
---

# Función cacheDir()

Obtiene la ruta del directorio de caché de navegadores.

### Firma

```typescript
export declare function cacheDir(
  options?: { cacheDir?: string }
): string;
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
(Opcional) Ruta personalizada del directorio de caché
</td></tr>
</tbody></table>

**Retorna:**

string

Ruta absoluta al directorio de caché
