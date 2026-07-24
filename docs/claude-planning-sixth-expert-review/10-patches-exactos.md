# Patches exactos requeridos

## P01 — Hook y `.planning` inexistente

Cambiar la resolución de `.planning`:

```text
NO usar nearestExisting(planningRoot)
SÍ usar path.resolve(workspaceRoot, ".planning")
```

Solo resolver realpath para targets existentes y symlinks.

## P02 — Launcher standalone

Crear una función equivalente a:

```js
function isStandaloneApprovedLauncher(command, approvedLauncher) {
  if (/[;&|><`
]|\$\(/.test(command)) return false;

  const tokens = tokenizeSafely(command);
  return tokens.length > 0 && tokens[0] === approvedLauncher;
}
```

No utilizar `command.includes()` ni búsqueda de tokens en cualquier posición.

## P03 — Fail-closed

Agregar wrapper ejecutable para el hook que:

```text
comprueba Node >=20
ejecuta el script
convierte cualquier error en exit 2
```

## P04 — Criteria status

Actualizar los seis manifests:

```json
{
  "id": "...",
  "severity": "critical",
  "waivable": false,
  "status": "PENDING",
  "evidence_refs": []
}
```

## P05 — Eliminar `decision_record`

Eliminar la propiedad de:

```text
spikes/*/spike.json
spikes/verify-corte-1.2.mjs
docs activos
```

## P06 — PASSED estricto

Agregar:

```js
if (manifest.status === "PASSED") {
  requireNonEmpty(manifest.evidence);
  requireNonEmpty(manifest.fixtures);
  requireNonEmpty(manifest.tests);
  requireValue(manifest.adr);
  requireValue(manifest.decision);
  requireValue(manifest.result);
  requireAllPassCriteriaPassed(manifest);
  requireNoFailCriterionFailed(manifest);
}
```

## P07 — State drift

Eliminar `PARTIALLY_APPLIED`.

## P08 — UUIDv7 drift

Reemplazar todos los ejemplos `01J...`.

## P09 — Path híbrido

Eliminar paths que incluyan display ID o slug.

## P10 — Move

Eliminar `item move`.

## P11 — Verificador nuevo

Crear:

```text
scripts/verify-next-generation.sh
```

## P12 — Referencias documentales

Todos los documentos next-generation deben usar el nuevo verificador.
