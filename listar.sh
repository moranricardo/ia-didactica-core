#!/bin/bash

echo "📚 Consultando lecciones en GitHub..."
curl -s -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/moranricardo/ia-didactica-core/contents/lecciones \
  | jq -r '.[] | "📄 " + .name + " (" + (.size|tostring) + " bytes)"' || echo "❌ No se pudieron listar las lecciones"
echo ""
