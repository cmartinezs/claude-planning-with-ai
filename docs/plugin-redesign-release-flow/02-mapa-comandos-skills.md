# Mapa de comandos y skills

## Superficie publica objetivo

Comandos publicos base:

| Comando | Responsabilidad publica | Use cases internos | Script/launcher |
|---------|--------------------------|--------------------|-----------------|
| `/plan-init` | Bootstrap completo del workspace actual: estructura, deteccion inicial, config base y plugin lock. | `workspace.bootstrap`, `config.detect`, `lock.create` | `claude-planning workspace init` |
| `/plan-config` | Administrar scopes, fuentes, politicas, Git, comandos permitidos, autonomia, guias y generadores custom. | `scope.configure`, `policy.configure`, `guide.refresh`, `command.configure` | `claude-planning config <stage>` |
| `/release` | Router publico del lifecycle de release: crear, planificar, consultar readiness, liberar, registrar deployment y finalizar. | `release.create`, `release.plan`, `release.query`, `release.transition`, `deployment.record`, `release.finalize` | `claude-planning release <stage>` |
| `/plan-story` | Crear/enriquecer stories o capabilities, validar criterios funcionales, crear work packages y atomizarlos por scope. | `story.create`, `story.enrich`, `work-package.create`, `work-package.atomize` | `claude-planning story <stage>` |
| `/plan-task` | Inspeccionar, preparar, ejecutar, validar, corregir y cerrar tasks atomicas. | `task.inspect`, `task.start`, `task.verify`, `task.correction`, `task.closeout` | `claude-planning task <stage>` |
| `/plan-check` | Validar invariantes, schemas, links, dependencias, guias, gates, readiness y evidencia. | `check.health`, `check.schema`, `check.guides`, `check.gates`, `check.readiness` | `claude-planning check <stage>` |
| `/plan-report` | Generar summary, status, standup, history, release notes, traceability, docs y exports. | `report.status`, `report.standup`, `report.history`, `report.release-notes`, `report.export` | `claude-planning report <stage>` |
| `/plan-decision` | Registrar, actualizar, aceptar o rechazar decisiones y vincularlas con releases, stories, scopes o gates. | `decision.propose`, `decision.accept`, `decision.reject`, `decision.link` | `claude-planning decision <stage>` |

Ocho comandos bien definidos son preferibles a un comando unico sobrecargado. `/release` puede ser fachada publica, pero su `SKILL.md` no debe contener todo el lifecycle.

## Comando de mantenimiento

`/plan-update-version` se conserva como comando de mantenimiento del plugin/template pack. No forma parte del flujo diario release/story/task, pero sigue siendo publico porque permite actualizar workspaces v4 a revisiones compatibles futuras.

| Comando | Responsabilidad | Script/launcher |
|---------|-----------------|-----------------|
| `/plan-update-version` | Aplicar migraciones v4+ compatibles, actualizar lock/template pack y reportar cambios requeridos. | `claude-planning update-version <stage>` |

## Comandos avanzados

Solo implementar cuando exista una necesidad real y evidencia de uso:

| Comando | Uso |
|---------|-----|
| `/plan-run` | Orquestador end-to-end encima de release/story/task/check. No pertenece al primer vertical slice. |
| `/plan-recover` | Retry, rollback, clone, merge, compensaciones y fallas de operacion con stages explicitos. |
| `/plan-backlog` | Importar o mantener backlog externo cuando no hay release directa. |

No se implementan por anticipacion para evitar reconstruir la explosion de comandos v3.

## Comandos removidos y reemplazos conceptuales

Estos comandos no se preservan como aliases en v4. La tabla sirve para decidir que capacidades sobreviven y donde quedan.

| Comandos v3 | Destino v4 | Accion v4 | Razon |
|-------------|------------|-----------|-------|
| `release-init`, `release-new`, `release-add`, `release-remove`, `release-status` | `/plan-init`, `/plan-config`, `/release <new|status|mark|deployment|finalize>` | Borrar skills v3. | Init/config son de workspace; release queda como router de lifecycle, no CRUD aislado. |
| `plan-status`, `plan-standup`, `plan-history`, `plan-export` | `/plan-report <status|standup|history|export>` | Borrar wrappers separados. | Son vistas/proyecciones, no checks. |
| `plan-health`, `plan-validate`, `plan-task-validate`, `plan-audit-docs`, `plan-doctor` | `/plan-check <health|schema|task|docs|doctor|readiness>` | Borrar skills v3 o reimplementar solo `/plan-check`. | Todos validan invariantes, schemas, gates o evidencia. |
| `doc-generate`, `doc-story`, `doc-task` | `/plan-report docs --level <release|story|work-package|task>` | Borrar wrappers separados. | Markdown es proyeccion generada desde estado canonico. |
| `us-new`, `us-enrich`, `us-split`, `us-status`, `epic-enrich` | `/plan-backlog <new|enrich|split|status|import>` si se justifica | Borrar por defecto. | Backlog externo no debe competir con release activa. |
| `plan-enrich-epic`, `plan-enrich-story`, `plan-split-story` | `/plan-story <enrich|split|package add|atomize>` | Borrar skills v3. | La story/capability es unidad funcional; los slices tecnicos son work packages. |
| `plan-merge`, `plan-story-skip` | `/plan-story <move|resolve>` o `/plan-recover` | Borrar skills v3. | Skip requiere resolucion/waiver, no estado principal. |
| `plan-from-epic`, `plan-from-release`, `plan-template`, `plan-new`, `plan-expand` | `/release plan` o `/plan-story import` | Borrar flujo INITIAL/EXPANSION como API publica. | El flujo INITIAL/EXPANSION desaparece del contrato v4. |
| `plan-agent-plan`, `plan-agent-execute`, `plan-agent-validate`, `plan-run` | `/plan-run` solo si se justifica | Borrar agentes por fase. | Un orquestador avanzado no debe formar parte del primer corte. |
| `plan-retry`, `plan-rollback`, `plan-clone` | `/plan-recover <retry|rollback|clone>` si se justifica | Borrar skills sueltas. | Recuperacion debe operar sobre eventos y ChangeSets. |
| `plan-smoke-config`, `plan-git-config` | `/plan-config <commands|git|policies>` | Borrar config commands sueltos. | Configuracion pertenece al Project Context. |
| `plan-test-suite` | `/plan-check tests --generate` y `/plan-config guide --tests` | Borrar como comando principal. | Es generacion/validacion de gates desde la guia del scope. |
| `plan-edge-case`, `plan-retrospective` | `/release note unexpected`, `/release finalize` o `/plan-report retro` | Borrar como comandos de planning. | Retrospectiva cierra release y se sintetiza desde eventos/hechos. |

## Corte limpio v4

La version v4 instala una superficie nueva, sin wrappers de compatibilidad.

Reglas:

- no crear aliases legacy;
- no mantener `.releases/`, `.planning/active/` ni `.planning/finished/` como storage;
- no aceptar `NNN-slug` como identificador raiz si el contrato exige `R0001`;
- no duplicar skills por etapa cuando una etapa puede ser stage interno;
- no usar IDs que mezclen slug, scope, titulo u orden de story;
- si una capacidad v3 no entra en project context, release, story, work package, task, check, report o decision, se elimina o queda como comando avanzado solo con una razon fuerte.

## Contrato de skills

Cada `SKILL.md` debe tener como maximo:

- proposito del comando;
- argumentos publicos;
- precondiciones;
- llamada al launcher determinista;
- punto exacto donde entra juicio del agente;
- criterios de stop;
- reglas de aprobacion humana.

La skill no debe contener:

- parseo manual de Markdown;
- asignacion de IDs;
- logica de estados;
- pasos Git repetidos;
- tablas duplicadas;
- reglas que ya viven en schemas, runtime, templates o docs canonicos.

## Contrato del runtime

El contrato interno usa stage-first, pero mediante launcher estable:

```text
claude-planning workspace init [args] [--format json|markdown]
claude-planning config <stage> [args] [--format json|markdown]
claude-planning release <stage> [args] [--format json|markdown]
claude-planning story <stage> [args] [--format json|markdown]
claude-planning task <stage> [args] [--format json|markdown]
claude-planning check <stage> [args] [--format json|markdown]
claude-planning report <stage> [args] [--format json|markdown]
claude-planning decision <stage> [args] [--format json|markdown]
```

Mutaciones no aplican directamente. Primero producen un `ChangeSet`:

```text
inspect -> propose -> validate -> approve -> apply -> verify -> record
```

`apply` requiere `baseRevision` vigente, `operationId`, `idempotencyKey` y aprobacion cuando cambie alcance, se omita un gate, se acepte un riesgo, se ejecute un comando sensible, se cancele trabajo comprometido, se libere o se despliegue.

## Librerias internas recomendadas

```text
runtime/lib/
  schema.mjs          # carga y valida schemas
  identity.mjs        # IDs estables, counters, idempotency keys
  revision.mjs        # workspace revision, optimistic locking, locks
  paths.mjs           # cwd boundary, path normalization, symlink checks
  command-policy.mjs  # comandos estructurados, allowlist, approvals
  event-journal.mjs   # append-only events.ndjson
  change-set.mjs      # inspect/propose/validate/apply/verify
  atomic-write.mjs    # temp files, rename, rollback tecnico
  project-store.mjs   # config, plugin lock, policies
  scope-store.mjs     # scope catalog y guide metadata
  release-store.mjs   # release aggregate y lifecycle
  story-store.mjs     # story/capability aggregate
  work-package-store.mjs # ownership tecnico, gates y tasks
  task-store.mjs      # task metadata, dependencias, evidencia
  guide-store.mjs     # guide status, fingerprints, provenance
  render.mjs          # proyecciones Markdown/json
```

Esto mantiene SOLID en serio: una skill coordina una intencion; el runtime aplica contratos mecanicos con librerias de responsabilidad tecnica unica.
