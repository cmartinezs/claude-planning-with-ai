# Diagnostico

## Situacion observada

El inventario actual tiene 53 comandos documentados en `docs/commands.yml` y 53 carpetas bajo `skills/`. La distribucion de skills es:

| Familia | Cantidad | Observacion |
|---------|----------|-------------|
| `plan-*` | 40 | Mezcla setup, lifecycle, ejecucion, reportes, recuperacion, validacion, backlog y automatizacion. |
| `release-*` | 5 | CRUD de releases, pero la release agrupa plannings, no historias. |
| `us-*` | 4 | Backlog paralelo a `plan-enrich-*` y `epic-enrich`. |
| `doc-*` | 3 | Wrappers de un script comun, buenos candidatos a plegarse bajo un comando de reporte/documentacion. |
| `epic-*` | 1 | Otro punto de entrada de backlog. |

El README expone 10 grupos de comandos y una tabla adicional de "Similar commands". Esa tabla existe porque el modelo publico ya no es obvio: hay comandos distintos para enriquecer backlog vs planning, para split de backlog vs planning, para health vs validate, para status/report/standup/history/export, y para release CRUD separado.

## Problema de modelo

El modelo historico parece ser:

```text
planning -> stories -> tasks
release -> plannings
```

El modelo requerido ahora es:

```text
release -> scopes -> user stories -> technical tasks
```

Esto cambia el centro de gravedad. El usuario no deberia tener que crear una "planning" como entidad mental principal para despues agregarla a una release. La planning puede seguir existiendo como estructura interna de trabajo, pero la API publica debe hablar primero de releases y de los frentes configurados para cada proyecto.

## Problema de superficie publica

Hay demasiados comandos que representan variaciones mecanicas de una misma responsabilidad:

- `release-init`, `release-new`, `release-add`, `release-remove`, `release-status` son etapas de un unico dominio `release`.
- `plan-status`, `plan-report`, `plan-standup`, `plan-history`, `plan-export` son vistas sobre el mismo modelo.
- `plan-health`, `plan-validate`, `plan-task-validate`, `plan-audit-docs`, `plan-doctor` son validaciones con distinto alcance.
- `us-new`, `us-enrich`, `us-split`, `us-status`, `epic-enrich`, `plan-enrich-epic`, `plan-enrich-story`, `plan-split-story`, `plan-from-epic`, `plan-from-release` mezclan backlog, importacion y mutacion del arbol activo.
- `plan-agent-plan`, `plan-agent-execute`, `plan-agent-validate`, `plan-run` son orquestadores superpuestos.

Esto viola el criterio de responsabilidad unica a nivel de skill: muchas skills no son capacidades distintas, sino wrappers publicos para una etapa particular de un mismo script.

## Lo que ya esta bien encaminado

Ya existe una direccion correcta:

- `planning-template/scripts/planning-task.mjs` centraliza etapas de task como `inspect`, `readiness`, `git-setup`, `start`, `publish`, `correction`, `closeout`.
- `planning-template/scripts/planning-check.mjs` centraliza `health`, `validate` y `task-validate`.
- `planning-template/scripts/doc-generate.mjs` centraliza documentacion de task, story y planning.
- `planning-template/scripts/release.mjs` ya centraliza release CRUD, aunque con el modelo viejo de release -> plannings.
- `planning-template/scripts/planning-from-release.mjs` ya apunta al bridge desde documentos de release.

El siguiente paso no deberia ser crear mas skills. Deberia ser estabilizar una interfaz publica menor y mover la variabilidad a etapas deterministas.

## Riesgos si se sigue igual

- Cada nuevo flujo genera otro comando de primer nivel.
- Los usuarios aprenden comandos por memoria, no por modelo.
- Las skills crecen como procedimientos largos con juicio y mecanica mezclados.
- La documentacion se vuelve una lista de excepciones.
- La release queda como reporte agregado, no como contrato de entrega.
- El cierre secuencial de releases sera dificil de validar si no queda en un script unico.
