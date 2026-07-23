# Mapa de comandos y skills

## Superficie publica objetivo

Propuesta inicial de comandos publicos:

| Comando | Responsabilidad unica | Script principal |
|---------|------------------------|------------------|
| `/plan-init` | Crear la configuracion minima `.planning/` del workspace actual y registrar la referencia al template pack del plugin. | `planning-init.mjs` |
| `/release` | Configurar contexto del proyecto; crear, planificar, modificar, consultar, liberar y finalizar releases. | `release.mjs` |
| `/plan-story` | Orquestar una story dentro de una release. | `planning-story.mjs` |
| `/plan-task` | Ejecutar una task atomica. | `planning-task.mjs` |
| `/plan-check` | Validar health, estructura, guias por scope, evidencia, links, docs y readiness. | `planning-check.mjs` |
| `/plan-report` | Generar reportes, standup, history, export y release notes. | `planning-report.mjs`, `doc-generate.mjs` |
| `/plan-decision` | Registrar decisiones transversales reales. | Script nuevo o etapa en `planning-mutate.mjs` |
| `/plan-update-version` | Actualizar plantillas v4 dentro del mismo major o ejecutar migraciones futuras. No carga compatibilidad v3. | `update-version.mjs` |

Comandos opcionales o avanzados:

| Comando | Uso |
|---------|-----|
| `/plan-run` | Orquestador end-to-end encima de release/story/task/check. |
| `/plan-recover` | Retry, rollback, clone, merge y skip con etapas explicitas. |
| `/plan-backlog` | Importar o mantener backlog externo cuando no hay release directa. |

## Comandos removidos y reemplazos conceptuales

Estos comandos no se preservan como aliases en v4. La tabla sirve para decidir que capacidades sobreviven y donde quedan.

| Comandos v3 | Destino v4 | Accion v4 | Razon |
|-------------|------------|-----------|-------|
| `release-init`, `release-new`, `release-add`, `release-remove`, `release-status` | `/release <init|new|add|remove|status|mark|finalize>` | Borrar skills v3. | Son etapas de la misma entidad. |
| `plan-status`, `plan-health`, `plan-validate`, `plan-task-validate`, `plan-audit-docs`, `plan-doctor` | `/plan-check <status|health|validate|task|docs|doctor>` | Borrar skills v3 o reimplementar solo `/plan-check`. | Todos son chequeos o vistas de consistencia. |
| `plan-report`, `plan-standup`, `plan-history`, `plan-export`, `doc-generate`, `doc-story`, `doc-task` | `/plan-report <summary|standup|history|export|docs>` | Borrar wrappers separados. | Mismo modelo, distinta salida. |
| `us-new`, `us-enrich`, `us-split`, `us-status`, `epic-enrich` | `/plan-backlog <new|enrich|split|status|import>` | Borrar por defecto; crear `/plan-backlog` solo si se conserva backlog externo. | Backlog externo no debe competir con release activa. |
| `plan-enrich-epic`, `plan-enrich-story`, `plan-split-story`, `plan-merge`, `plan-story-skip` | `/release story <add|enrich|split|link|move|skip>` o `/plan-recover` | Borrar skills v3. | Son mutaciones de stories dentro de release; `link` registra relaciones multi-scope en el padre. |
| `plan-from-epic`, `plan-from-release`, `plan-template`, `plan-new`, `plan-expand` | `/release import|plan` | Borrar flujo INITIAL/EXPANSION como API publica. | El flujo INITIAL/EXPANSION pasa a ser una etapa de planificacion de release. |
| `plan-agent-plan`, `plan-agent-execute`, `plan-agent-validate`, `plan-run` | `/plan-run` | Borrar agentes por fase; mantener solo orquestador si aporta. | Un solo orquestador de alto nivel. |
| `plan-retry`, `plan-rollback`, `plan-clone` | `/plan-recover <retry|rollback|clone>` | Borrar skills sueltas. | Recuperacion debe ser avanzada, no flujo principal. |
| `plan-smoke-config`, `plan-git-config` | `/release init` o `/release config <git|smoke|scope|docs|guides>` | Borrar config commands sueltos. | Configuracion pertenece al contexto de release y proyecto. |
| `plan-test-suite` | `/plan-check tests --generate` y `/release scope guide --tests` | Borrar como comando principal. | Es generacion/validacion de gates desde la guia del scope, no una intencion principal separada. |
| `plan-edge-case`, `plan-retrospective` | `/release note unexpected` y `/release retrospective` o `/plan-report retro` | Borrar como comandos de planning. | Retrospectiva debe cerrar release, no solo planning. |

## Corte limpio v4

La version v4 debe instalar una superficie nueva, sin wrappers de compatibilidad. Los comandos v3 pueden quedar documentados en una tabla de ruptura durante el release, pero no deben existir como skills activas si duplican una responsabilidad v4.

Reglas:

- no crear aliases legacy;
- no mantener `.releases/` como storage paralelo;
- no aceptar `NNN-slug` como identificador raiz si el nuevo contrato exige `release-NNN-slug`;
- no duplicar skills por etapa cuando una etapa puede ser argumento de un comando gestor;
- si una capacidad v3 no entra en release/scope/story/task/check/report, se elimina o queda como comando avanzado solo con una razon fuerte.

## Contrato de skills

Cada `SKILL.md` deberia tener como maximo:

- proposito del comando;
- argumentos;
- precondiciones;
- llamada al script determinista;
- punto exacto donde entra juicio del agente;
- criterios de stop y aprobacion humana.

La skill no deberia contener:

- parseo manual de Markdown;
- reglas de asignacion de IDs;
- tablas largas duplicadas;
- pasos git detallados repetidos;
- logica de transicion de estados;
- instrucciones extensas que ya existan en el template pack o scripts del plugin.

## Contrato de scripts

Los scripts deben tener interfaz stage-first:

```text
node .planning/scripts/release.mjs <stage> [args] [--write|--execute] [--format markdown|json]
node .planning/scripts/planning-story.mjs <stage> <release-id> <scope-id> [story-id] [--write|--format markdown|json]
node .planning/scripts/planning-task.mjs <stage> <release-id> <scope-id> <story-id> <task-id> [--write|--execute|--format markdown|json]
node .planning/scripts/planning-check.mjs <stage> [args] [--format markdown|json]
node .planning/scripts/planning-report.mjs <stage> [args] [--output markdown|json]
```

Mutaciones deben ser dry-run por defecto excepto cuando el usuario entrega `--write` o `--execute`.

## Librerias internas recomendadas

Para reducir duplicacion entre scripts:

```text
planning-template/scripts/lib/
  markdown.mjs       # secciones, tablas, status lines, links
  workspace.mjs      # raiz .planning, paths, current cwd boundary, plugin template pack
  project-config.mjs # git, scopes, docs, story sources, guides
  release-store.mjs  # CRUD y estado de release
  story-store.mjs    # scoped story rows/files/tasks
  story-links.mjs    # story groups, story parts, cross-scope orchestration refs
  task-store.mjs     # task metadata, dependencias, evidencia
  scope-guides.mjs   # task/test guide extraction, index, signatures, generators
  git-flow.mjs       # ramas, comandos planificados, ref checks
  render.mjs         # markdown/json rendering helpers
```

Esto permite que las skills sean SOLID en serio: una skill coordina una intencion; los scripts comparten librerias con una responsabilidad tecnica unica.
