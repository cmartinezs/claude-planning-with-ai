# Plan incremental

## Regla de trabajo

Esto es v4 y parte en limpio. No hay compatibilidad hacia atras, aliases legacy ni storage paralelo por defecto. La ruta sigue siendo incremental para controlar riesgo de implementacion, pero cada corte debe construir el modelo v4 final, no una transicion desde v3.

La recomendacion del review cambia el orden: no comenzar por `skills/release/SKILL.md`. Primero debe cerrarse el contrato del dominio y del runtime.

## Corte -1: contrato del dominio y del runtime

Objetivo: definir el nucleo que hara segura la implementacion v4 antes de exponer comandos publicos.

Entregables:

- Modelo formal de `Release`, `Story/Capability`, `Scope Work Package`, `Task`, `Scope`, `Decision`, `Gate`, `Blocker`, `Waiver`, `Deployment Event` y `Finalization`.
- JSON Schema o equivalente para `config`, `plugin.lock`, `scope`, `release`, `story`, `work-package`, `task`, `change-set`, `event` y `guide metadata`.
- Contrato de identidad estable: `R0001`, `S0001`, `WP0001`, `T0001`, slugs decorativos y referencias por ID.
- Contrato de storage: YAML/JSON canonico, Markdown como proyeccion, `events.ndjson` append-only.
- Protocolo de mutacion: `inspect -> propose -> validate -> approve -> apply -> verify -> record`.
- Modelo de concurrencia: `baseRevision`, optimistic locking, operation locks, idempotency keys y comportamiento en worktrees.
- Politicas configurables: release sequence, lanes, autonomy, approvals, gates, skip, cancelacion, deployment y finalizacion.
- Contrato seguro de comandos y custom generators: estructura de comando, cwd, timeouts, allowlist, path boundaries y permisos.
- Launcher estable `claude-planning <domain> <stage>` para ocultar rutas internas del plugin.
- Fixtures de arquitectura:
  - monorepo software;
  - repositorio simple;
  - proyecto con scopes no-code.
- Pruebas de arquitectura para transiciones, dependencias, ciclos, IDs, concurrencia, idempotencia, atomicidad, staleness, reproducibilidad, path boundaries, cross-platform y ausencia legacy.

Validacion:

```text
claude-planning check architecture --fixtures all --format json
bash scripts/verify-plugin.sh
```

## Corte 0: bootstrap y configuracion del proyecto

Objetivo: hacer que `/plan-init` configure lo necesario para que el plugin pueda trabajar agnosticamente en cualquier estructura.

Cambios:

- Crear `.planning/config.yml`, `.planning/plugin.lock.yml`, `.planning/events.ndjson`, `.planning/scopes/`, `.planning/decisions/` y `.planning/releases/`.
- Detectar y confirmar si el proyecto usa git.
- Si usa git, configurar branch base, estrategia de ramas, lanes y si se permitira automatizacion `git`/`gh`.
- Detectar carpetas, paquetes, workspaces o repositorios candidatos a scope.
- Pedir confirmacion humana del catalogo de scopes: id, nombre, kind, paths, owner opcional, reglas de validacion y `non_code` cuando aplique.
- Registrar donde viven historias fuente, backlog, master plan o documentos de producto, si existen.
- Registrar guias funcionales, tecnicas, arquitectura, estilo/coding, testing, logging, seguridad y producto.
- Registrar comandos de build/test/smoke como comandos estructurados, no strings de shell.
- Registrar autonomia: que puede inspeccionarse, proponerse, aplicarse o ejecutarse sin aprobacion.
- Generar o marcar pendientes las guias iniciales por scope.
- Registrar plugin version, schema version y template pack fingerprint en `plugin.lock.yml`.

Validacion:

```text
claude-planning workspace init --dry-run --format json
claude-planning workspace init --write --format json
claude-planning check schema --format json
bash scripts/verify-plugin.sh
```

## Corte 1: scope catalog y guias aprobables

Objetivo: convertir documentacion del proyecto en guias operativas versionadas para work packages, tasks y tests.

Cambios:

- Crear `.planning/scopes/<scope-id>/scope.yml`, `task-guide.md` y `test-guide.md`.
- Definir estados de guia: `generated`, `reviewed`, `approved`, `stale`, `rejected`.
- Guardar provenance: fuentes, fingerprints, generator version, model/prompt version cuando aplique, aprobador y fecha.
- Hacer que una guia no aprobada bloquee atomizacion automatica en modo estricto.
- Soportar generadores custom por scope con input/output estructurado y validacion de salida.
- Detectar staleness cuando cambian las fuentes configuradas.
- Agregar gates distintos por `kind` de scope.

Validacion:

```text
claude-planning config guide refresh --scope <scope-id> --dry-run --format json
claude-planning config guide approve --scope <scope-id> --write --format json
claude-planning check guides --format json
```

## Corte 2: release aggregate

Objetivo: establecer release como entidad principal sin sobrecargarla conceptualmente.

Cambios:

- Crear `release.yml` canonico y `README.md` generado.
- Definir lifecycle: `DRAFT`, `PLANNED`, `ACTIVE`, `VERIFYING`, `RELEASED`, `CANCELLED`.
- Modelar `finalization` como metadata y no como estado bloqueante del flujo principal.
- Modelar deployment events por separado dentro del agregado de release.
- Agregar policies configurables:
  - `strict_sequence`;
  - `dependency_graph`;
  - `release_train`;
  - `parallel`;
  - lanes como `main`, `hotfix` o `mobile`.
- Registrar `scope_refs` con `guide_revision` para reproducibilidad.
- Regenerar `TRACEABILITY.md`, `RELEASE-NOTES.md` y reportes desde YAML canonico.
- Impedir saltos de ID de release y validar dependencias/lane segun policy.

Validacion:

```text
claude-planning release new --dry-run --title <title> --format json
claude-planning release status R0001 --format json
claude-planning check release R0001 --format json
```

## Corte 3: stories/capabilities y work packages

Objetivo: corregir el modelo multi-scope y reemplazar `story-01-a/story-01-b` por story funcional con work packages por scope.

Cambios:

- Crear `story.yml` con actor, necesidad, valor, reglas funcionales, criterios de aceptacion, outcome y DoD funcional.
- Crear `work-package.yml` por scope con diseno tecnico, contratos, dependencias, riesgos, gates y tasks.
- Rechazar stories multi-owner: una story puede tener varios work packages, pero cada work package tiene un scope propietario.
- Agregar `commitment: required | optional`.
- Reemplazar `SKIPPED` por resolucion con razon, aprobacion, riesgo aceptado y reemplazo cuando aplique.
- Validar que una story `DONE` requiere sus work packages requeridos `DONE` o una waiver/resolucion aceptada.
- Registrar dependencias entre stories y work packages por ID estable, no por slug/ruta.

Validacion:

```text
claude-planning story create R0001 --dry-run --format json
claude-planning story package add R0001 S0001 --scope <scope-id> --dry-run --format json
claude-planning check story R0001 S0001 --format json
```

## Corte 4: tasks y ejecucion atomica

Objetivo: adaptar `/plan-task` al nuevo contexto `release -> story -> work package -> task`.

Cambios:

- Permitir argumentos `R0001 S0001 WP0001 T0001`.
- Rechazar `NNN-slug story-01 task-01` como forma v4.
- Hacer que `task.yml` herede scope y gates desde `work-package.yml`.
- Mantener `Test Execution Evidence`, smoke, logging y diseno frontend/backend cuando aplique al kind del scope.
- Ejecutar todo cambio via ChangeSet con `baseRevision` e idempotency key.
- Guardar comandos ejecutados como estructura y eventos observables.
- Agregar rollback tecnico o compensacion cuando una operacion falla despues de escribir.

Validacion:

```text
claude-planning task inspect R0001 S0001 WP0001 T0001 --format json
claude-planning task start R0001 S0001 WP0001 T0001 --dry-run --format json
claude-planning task closeout R0001 S0001 WP0001 T0001 --format json
```

## Corte 5: check/report/docs

Objetivo: reducir comandos duplicados sin perder capacidades.

Cambios:

- Crear `/plan-check` como wrapper unico de invariantes, schemas, guide freshness, gates, readiness, links, dependencies y evidence.
- Crear `/plan-report` para status, standup, history, export, release notes, traceability y docs generadas.
- Regenerar Markdown desde estado canonico y detectar drift manual.
- Centralizar salida markdown/json.

Reemplazos v4:

```text
/plan-health         -> /plan-check health
/plan-validate       -> /plan-check schema
/plan-task-validate  -> /plan-check task
/plan-audit-docs     -> /plan-check docs
/plan-doctor         -> /plan-check doctor
/plan-status         -> /plan-report status
/plan-standup        -> /plan-report standup
/plan-history        -> /plan-report history
/plan-export         -> /plan-report export
/doc-task            -> /plan-report docs --level task
/doc-story           -> /plan-report docs --level story
/doc-generate        -> /plan-report docs
```

## Corte 6: skills publicas

Objetivo: exponer la superficie v4 cuando el runtime ya tenga contrato, storage y pruebas.

Cambios:

- Crear o rehacer `skills/plan-init/SKILL.md`.
- Crear `skills/plan-config/SKILL.md`.
- Crear `skills/release/SKILL.md` como router del lifecycle de release.
- Rehacer `skills/plan-story/SKILL.md`.
- Rehacer `skills/plan-task/SKILL.md`.
- Crear o rehacer `skills/plan-check/SKILL.md`.
- Crear o rehacer `skills/plan-report/SKILL.md`.
- Conservar `skills/plan-decision/SKILL.md` solo como wrapper del contrato nuevo.
- No crear comandos avanzados hasta tener una necesidad real.

Cada skill debe ser un wrapper pequeno: argumentos, precondiciones, llamada al launcher, punto de juicio del agente y criterios de aprobacion.

## Corte 7: consolidar backlog/import/recovery si corresponde

Objetivo: mover comandos secundarios fuera del flujo principal.

Cambios:

- Crear `/plan-backlog` solo si se decide mantener backlog externo como capacidad explicita.
- Crear `/plan-recover` solo si el event journal y ChangeSets ya soportan retry, rollback y compensacion.
- Reubicar `plan-from-release` como etapa de `/release plan` o `/plan-story import` si todavia aporta.
- Mantener `plan-decision` separado porque registra decisiones transversales reales.

## Corte 8: cierre de ruptura v4

Objetivo: dejar una superficie limpia y publicar el cambio como major.

Cambios:

- Confirmar contra `CHANGELOG.md` que el siguiente major es v4.0.0.
- Ejecutar la eliminacion legacy definida en [Eliminacion legacy](06-eliminacion-legacy.md).
- Actualizar manifests y metadata: `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, README badge y `.page/package*.json`.
- Rehacer documentacion publica: README, `docs/commands.yml`, reference, user guide, developer guide, tutoriales, workflows y glossary.
- Rehacer site/landing desde `.page` para mostrar solo el flujo v4 y validar con `npm run build`.
- Rehacer `runtime/`, `runtime/schemas/` y `template-pack/`. `/plan-init` no copia templates completos al repo de trabajo.
- Actualizar `scripts/verify-plugin.sh` para validar ausencia legacy en skills, docs, template, site, manifests y version markers.
- Actualizar `CHANGELOG.md`.
- Actualizar `template-pack/update-version/<N>-<N+1>.md`.
- Documentar tabla de comandos removidos y reemplazos.
- Definir si existe una herramienta separada de export/migracion desde v3. Esa herramienta no condiciona el diseno v4.

## Primer corte recomendado

El primer cambio implementable debe ser pequeno, pero previo a comandos publicos:

1. Crear schemas minimos para `config`, `plugin.lock`, `scope`, `release`, `story`, `work-package`, `task`, `change-set` y `event`.
2. Crear librerias base de identidad, revision, paths, ChangeSet, atomic write y event journal.
3. Agregar fixtures para monorepo, repo simple y scope no-code.
4. Agregar checks de arquitectura en `scripts/verify-plugin.sh`.
5. Documentar el launcher estable y los contratos en developer guide.

Despues de ese corte, implementar el vertical slice:

```text
plan-init
  -> config estructurada
  -> scope catalog
  -> release create
  -> story create
  -> work package create
  -> task create
  -> check
  -> report
```

Sin ejecucion autonoma, Git/gh mutante, recovery, backlog externo ni deployment en el primer vertical slice.

## Preguntas abiertas

1. Launcher: binario local `claude-planning`, script npm empaquetado o wrapper instalado por plugin.
2. Persistencia de counters: archivo dedicado por agregado o derivacion segura desde YAML/journal con lock.
3. Version semantica: una release puede o no coincidir con version del plugin/producto; `release_id` y `version` deben mantenerse separados.
4. Politica inicial por defecto: `strict_sequence` para simplicidad, con soporte posterior para lanes/hotfix.
5. Compatibilidad cross-platform: nivel minimo de soporte para Windows nativo vs WSL2.

## Criterio de exito

La documentacion principal deberia poder explicar el plugin con este mapa:

```text
1. Inicializa el proyecto.
2. Configura scopes y politicas.
3. Crea una release.
4. Define stories o capabilities.
5. Divide cada story en work packages por scope.
6. Atomiza cada work package en tasks.
7. Ejecuta operaciones mediante ChangeSets.
8. Verifica gates y evidencia.
9. Libera y registra deployment.
10. Finaliza y genera retrospectiva.
```

Si hace falta una tabla de "comandos similares" para entender que usar, todavia no esta suficientemente simple.
