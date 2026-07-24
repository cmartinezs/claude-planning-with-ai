# Separación obligatoria de verificadores

## Problema

```text
scripts/verify-plugin.sh
```

continúa validando principalmente el producto v3:

- `planning-template/`;
- scripts `planning-*`;
- workflows legacy;
- skills v3;
- metadata v3.

No debe ser el gate principal del producto next-generation.

## Decisión

Mantener:

```text
scripts/verify-plugin.sh
```

exclusivamente para v3 maintenance.

Crear:

```text
scripts/verify-next-generation.sh
```

## Contenido mínimo obligatorio

```bash
#!/usr/bin/env bash
set -euo pipefail

node hooks/tests/protect-planning-state.test.mjs
node spikes/verify-corte-1.2.mjs --structure-only

test "$(node -p 'Number(process.versions.node.split(`.`)[0]) >= 20')" = "true"

! rg 'PARTIALLY_APPLIED|OP-01J|01J-|RI0004|/<acronym>-init|/arc-init'   docs/plugin-redesign-release-flow

! rg 'item[[:space:]]+move|change parent_id'   docs/plugin-redesign-release-flow
```

## Validaciones adicionales recomendadas

```text
hooks/hooks.json existe
package.json exige Node >=20
seis manifests existen
ningún manifest usa decision_record
todos los criterios tienen status
ningún allowed-tools amplio
```

## Documentación

Reemplazar en documentos next-generation:

```text
bash scripts/verify-plugin.sh
```

por:

```text
bash scripts/verify-next-generation.sh
```

## Criterio de aceptación

Los verificadores deben tener responsabilidades no solapadas:

```text
verify-plugin.sh             -> v3
verify-next-generation.sh    -> producto nuevo
```
