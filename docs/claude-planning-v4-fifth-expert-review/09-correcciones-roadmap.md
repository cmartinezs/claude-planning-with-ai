# Correcciones obligatorias del roadmap

## Corrección 1 — Corte 0 completo

El Corte 0 debe crear exactamente:

```text
.planning/config.yml
.planning/plugin.lock.yml
.planning/events/
.planning/operations/
.planning/.runtime/
.planning/scopes/
.planning/concerns/
.planning/gates/
.planning/gate-profiles/
.planning/execution-contexts/
.planning/environments/
.planning/decisions/
.planning/releases/
.planning/vendor/template-packs/
```

## Texto exacto esperado

```md
Crear:

- `.planning/config.yml`
- `.planning/plugin.lock.yml`
- `.planning/events/`
- `.planning/operations/`
- `.planning/.runtime/`
- `.planning/scopes/`
- `.planning/concerns/`
- `.planning/gates/`
- `.planning/gate-profiles/`
- `.planning/execution-contexts/`
- `.planning/environments/`
- `.planning/decisions/`
- `.planning/releases/`
- `.planning/vendor/template-packs/`
```

## Corrección 2 — Criterio del Corte -1.1

Reemplazar:

```text
El runtime puede comenzar cuando...
```

por:

```md
## Criterio de salida del Corte -1.1

El Corte -1.1 puede considerarse cerrado cuando se cumplan los
siguientes contratos.

El inicio del runtime productivo continúa bloqueado hasta cerrar
también el Corte -1.2.
```

## Corrección 3 — Terminología

Usar:

```text
next-generation
```

para el producto.

Usar `v4` solo como etiqueta histórica de la iniciativa.

## Corrección 4 — Scripts

Mantener:

```text
workspace-init.mjs
config.mjs
release.mjs
item.mjs
task.mjs
check.mjs
report.mjs
decision.mjs
changeset.mjs
```

No reintroducir `planning-*`.

## Criterio de aceptación

Los documentos:

```text
03-plan-incremental.md
08-corte-1-1-contratos-runtime.md
09-corte-1-2-spikes-producto-runtime.md
10-corte-1-2-contratos-ejecucion.md
```

deben estar alineados sin reglas contradictorias.
