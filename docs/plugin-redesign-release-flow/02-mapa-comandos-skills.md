# Mapa de comandos y skills

## Superficie publica objetivo

Nombre publico propuesto:

```text
ARC Flow
```

`ARC` funciona como acronimo de Agentic Release Coordination. La regla de naming v4 es:

- skills publicas con prefijo corto `/arc-*`;
- launcher de runtime `arcflow`;
- dominios internos sin prefijo conversacional (`workspace`, `config`, `release`, `item`, `task`, `check`, `report`, `decision`, `changeset`);
- no usar `claude-*` ni `plan-*` como marca publica nueva;
- conservar menciones `plan-*` solo en tablas de reemplazo legacy.

Comandos publicos base:

| Comando | Responsabilidad publica | Use cases internos | Script/launcher |
|---------|--------------------------|--------------------|-----------------|
| `/arc-init` | Bootstrap completo del workspace actual: estructura, deteccion inicial, config base y plugin lock. | `workspace.bootstrap`, `config.detect`, `lock.create` | `arcflow workspace init` |
| `/arc-config` | Administrar scopes, fuentes, politicas, Git, comandos permitidos, autonomia, guias y generadores custom. | `scope.configure`, `policy.configure`, `guide.refresh`, `command.configure` | `arcflow config <stage>` |
| `/arc-release` | Router publico del lifecycle de release: crear, planificar, consultar readiness, liberar, registrar deployment y finalizar. | `release.create`, `release.plan`, `release.query`, `release.transition`, `deployment.record`, `release.finalize` | `arcflow release <stage>` |
| `/arc-item` | Crear/enriquecer Release Items tipados, validar criterios funcionales, crear work packages y atomizarlos por scope. | `release-item.create`, `release-item.enrich`, `work-package.create`, `work-package.atomize` | `arcflow item <stage>` |
| `/arc-task` | Inspeccionar, preparar, ejecutar, validar, corregir y cerrar tasks atomicas. | `task.inspect`, `task.start`, `task.verify`, `task.correction`, `task.closeout` | `arcflow task <stage>` |
| `/arc-check` | Validar invariantes, schemas, links, dependencias, guias, gates, readiness y evidencia sin mutar. | `check.health`, `check.schema`, `check.guides`, `check.gates`, `check.readiness` | `arcflow check <stage>` |
| `/arc-report` | Generar summary, status, standup, history, release notes, traceability, docs y exports. | `report.status`, `report.standup`, `report.history`, `report.release-notes`, `report.export` | `arcflow report <stage>` |
| `/arc-decision` | Registrar, actualizar, aceptar o rechazar decisiones y vincularlas con releases, release items, scopes o gates. | `decision.propose`, `decision.accept`, `decision.reject`, `decision.link` | `arcflow decision <stage>` |

Ocho comandos bien definidos son preferibles a un comando unico sobrecargado. `/arc-release` puede ser fachada publica, pero su `SKILL.md` no debe contener todo el lifecycle.

## Comando de mantenimiento

`/arc-update` se conserva como comando de mantenimiento del plugin/template pack. No forma parte del flujo diario release/release-item/task, pero sigue siendo publico porque permite actualizar workspaces v4 a revisiones compatibles futuras.

| Comando | Responsabilidad | Script/launcher |
|---------|-----------------|-----------------|
| `/arc-update` | Aplicar migraciones v4+ compatibles, actualizar lock/template pack y reportar cambios requeridos. | `arcflow update <stage>` |

## Comandos avanzados

Solo implementar cuando exista una necesidad real y evidencia de uso:

| Comando | Uso |
|---------|-----|
| `/arc-run` | Orquestador end-to-end encima de release/release-item/task/check. No pertenece al primer vertical slice. |
| `/arc-recover` | Retry, rollback, clone, merge, compensaciones y fallas de operacion con stages explicitos. |
| `/arc-backlog` | Importar o mantener backlog externo cuando no hay release directa. |

No se implementan por anticipacion para evitar reconstruir la explosion de comandos v3.

## Comandos removidos y reemplazos conceptuales

Estos comandos no se preservan como aliases en v4. La tabla sirve para decidir que capacidades sobreviven y donde quedan.

| Comandos v3 | Destino v4 | Accion v4 | Razon |
|-------------|------------|-----------|-------|
| `release-init`, `release-new`, `release-add`, `release-remove`, `release-status` | `/arc-init`, `/arc-config`, `/arc-release <new|status|mark|deployment|finalize>` | Borrar skills v3. | Init/config son de workspace; release queda como router de lifecycle, no CRUD aislado. |
| `plan-status`, `plan-standup`, `plan-history`, `plan-export` | `/arc-report <status|standup|history|export>` | Borrar wrappers separados. | Son vistas/proyecciones, no checks. |
| `plan-health`, `plan-validate`, `plan-task-validate`, `plan-audit-docs`, `plan-doctor` | `/arc-check <health|schema|task|docs|doctor|readiness>` | Borrar skills v3 o reimplementar solo `/arc-check`. | Todos validan invariantes, schemas, gates o evidencia. |
| `doc-generate`, `doc-story`, `doc-task` | `/arc-report docs --level <release|release-item|work-package|task>` | Borrar wrappers separados. | Markdown es proyeccion generada desde estado canonico. |
| `us-new`, `us-enrich`, `us-split`, `us-status`, `epic-enrich` | `/arc-backlog <new|enrich|split|status|import>` si se justifica | Borrar por defecto. | Backlog externo no debe competir con release activa. |
| `plan-enrich-epic`, `plan-enrich-story`, `plan-split-story` | `/arc-item <enrich|split|package add|atomize>` | Borrar skills v3. | El Release Item es unidad de alcance; los slices tecnicos son work packages. |
| `plan-merge`, `plan-story-skip` | `/arc-item <move|resolve>` o `/arc-recover` | Borrar skills v3. | Skip requiere resolucion/waiver, no estado principal. |
| `plan-from-epic`, `plan-from-release`, `plan-template`, `plan-new`, `plan-expand` | `/arc-release plan` o `/arc-item import` | Borrar flujo INITIAL/EXPANSION como API publica. | El flujo INITIAL/EXPANSION desaparece del contrato v4. |
| `plan-agent-plan`, `plan-agent-execute`, `plan-agent-validate`, `plan-run` | `/arc-run` solo si se justifica | Borrar agentes por fase. | Un orquestador avanzado no debe formar parte del primer corte. |
| `plan-retry`, `plan-rollback`, `plan-clone` | `/arc-recover <retry|rollback|clone>` si se justifica | Borrar skills sueltas. | Recuperacion debe operar sobre eventos y ChangeSets. |
| `plan-smoke-config`, `plan-git-config` | `/arc-config <commands|git|policies>` | Borrar config commands sueltos. | Configuracion pertenece al Project Context. |
| `plan-test-suite` | `/arc-task prepare`, `/arc-item atomize` o `/arc-config guide refresh` | Borrar como comando principal. | `arc-check` no muta; la generacion pertenece a prepare/atomize/config. |
| `plan-edge-case`, `plan-retrospective` | `/arc-release note unexpected`, `/arc-release finalize` o `/arc-report retro` | Borrar como comandos de planning. | Retrospectiva cierra release y se sintetiza desde eventos/hechos. |

## Corte limpio v4

La version v4 instala una superficie nueva, sin wrappers de compatibilidad.

Reglas:

- no crear aliases legacy;
- no mantener `.releases/`, `.planning/active/` ni `.planning/finished/` como storage;
- no aceptar `NNN-slug` como identificador raiz si el contrato exige ID primario distribuido o `display_id` `R0001`;
- no duplicar skills por etapa cuando una etapa puede ser stage interno;
- no usar IDs que mezclen slug, scope, titulo u orden de item;
- si una capacidad v3 no entra en project context, release, release item, work package, task, check, report o decision, se elimina o queda como comando avanzado solo con una razon fuerte.

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
arcflow workspace init [args] [--format json|markdown]
arcflow config <stage> [args] [--format json|markdown]
arcflow release <stage> [args] [--format json|markdown]
arcflow item <stage> [args] [--format json|markdown]
arcflow task <stage> [args] [--format json|markdown]
arcflow check <stage> [args] [--format json|markdown]
arcflow report <stage> [args] [--format json|markdown]
arcflow decision <stage> [args] [--format json|markdown]
arcflow changeset <propose|validate|approve|apply|verify> [args] [--format json|markdown]
```

Mutaciones no aplican directamente. Primero producen un `ChangeSet`:

```text
inspect -> propose -> validate -> approve -> stage -> apply -> verify -> record
```

`apply` requiere `baseRevisions` vigentes por agregado, `operationId`, `idempotencyKey` y aprobacion vinculada al hash del ChangeSet cuando cambie alcance, se omita un gate, se acepte un riesgo, se ejecute un comando sensible, se cancele trabajo comprometido, se libere o se despliegue.

## Librerias internas recomendadas

```text
runtime/src/lib/
  schema.mjs          # carga y valida schemas
  identity.mjs        # IDs primarios distribuidos, display IDs, idempotency keys
  revision.mjs        # workspace revision, optimistic locking, locks
  paths.mjs           # cwd boundary, path normalization, symlink checks
  command-policy.mjs  # comandos estructurados, allowlist, approvals
  event-journal.mjs   # eventos JSON inmutables bajo .planning/events/
  change-set.mjs      # inspect/propose/validate/apply/verify
  atomic-write.mjs    # temp files, rename, rollback tecnico
  project-store.mjs   # config, plugin lock, policies
  scope-store.mjs     # scope catalog y guide metadata
  release-store.mjs   # release aggregate y lifecycle
  release-item-store.mjs # release item tipado
  work-package-store.mjs # ownership tecnico, gates y tasks
  task-store.mjs      # task metadata, dependencias, evidencia
  guide-store.mjs     # guide status, fingerprints, provenance
  render.mjs          # proyecciones Markdown/json
```

Esto mantiene SOLID en serio: una skill coordina una intencion; el runtime aplica contratos mecanicos con librerias de responsabilidad tecnica unica.
