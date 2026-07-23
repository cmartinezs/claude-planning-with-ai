# Configuracion inicial del proyecto

## Objetivo

`/plan-init` debe preparar el contexto que permite planificar sin asumir una estructura de proyecto especifica. Es el unico bootstrap de v4. No debe existir un segundo `/release init`.

Para cambios posteriores, `/plan-config` administra scopes, fuentes, politicas, Git, comandos, autonomia, guias y generadores custom.

## Resultado esperado

Archivos base:

```text
.planning/
  config.yml
  plugin.lock.yml
  events.ndjson
  scopes/
  decisions/
  releases/
```

`config.yml` y `plugin.lock.yml` son legibles por scripts. Los README/reportes son proyecciones humanas generadas. Los templates canonicos se resuelven desde la instalacion del plugin, no desde una copia completa dentro del repo de trabajo.

## Configuracion minima

```yaml
project:
  name: example-project
  type: software

plugin:
  schema_version: 4
  launcher: claude-planning

policies:
  release:
    mode: strict_sequence
    default_lane: main
  autonomy:
    apply_changes: approval_required
    execute_commands: approval_required
    waive_gates: approval_required
  paths:
    workspace_boundary: current_directory

git:
  enabled: true
  base_branch: main
  provider: github
  automation: assisted

commands:
  - id: web-build
    executable: npm
    args:
      - run
      - build
    working_directory: web
    timeout_seconds: 120
    approval: not_required

scopes:
  - id: web
    label: Web application
    kind: application
    paths:
      - web/
    functional_docs:
      - docs/product/
    technical_docs:
      - docs/frontend/
    guides:
      - docs/frontend-guidelines.md
    story_sources:
      - docs/backlog/
    guide_outputs:
      task_guide: .planning/scopes/web/task-guide.md
      test_guide: .planning/scopes/web/test-guide.md
    custom_generators:
      task_guide: scripts/planning/web-task-guide.mjs
      test_suite: scripts/planning/web-test-suite.mjs
    validation:
      build:
        - web-build
  - id: legal
    label: Legal review
    kind: compliance
    paths: []
    non_code: true
    non_code_reason: Manual compliance review scope.
    functional_docs:
      - docs/product/
    technical_docs:
      - docs/compliance/
    guides: []
    guide_outputs:
      task_guide: .planning/scopes/legal/task-guide.md
      test_guide: .planning/scopes/legal/test-guide.md
    custom_generators:
      task_guide: null
      test_suite: null
    validation:
      review: []
```

`plugin.lock.yml` debe registrar reproducibilidad:

```yaml
plugin:
  version: 4.0.0
  schema_version: 4
  template_pack:
    id: default
    version: 4.0.0
    fingerprint: sha256:...
```

Los ids anteriores son ejemplos. El plugin no debe tener una lista fija de scopes.

## Preguntas de `/plan-init`

El script debe inferir primero y preguntar despues. Preguntas esperadas:

1. Git: existe repositorio git, cual es la branch base, se usara `gh`, y que acciones requieren aprobacion.
2. Scopes: que frentes existen, que paths cubre cada uno, cual sera su id estable y que `kind` corresponde.
3. Historias: donde estan las historias fuente, backlog, master plan o documentos de producto.
4. Documentacion funcional: donde vive la definicion de comportamiento, reglas de negocio y criterios de aceptacion.
5. Documentacion tecnica: donde viven arquitectura, contratos, guias de estilo, guias de codigo, convenciones de testing y logging.
6. Validacion: que comandos build/test/smoke se conocen por scope y cuales quedan pendientes.
7. Guias operativas: si ya existe una guia rapida para crear work packages, tasks o tests por scope, o si debe generarse desde las fuentes.
8. Generadores custom: si el proyecto tiene scripts propios para resumir guias, crear templates de task o generar test suites.
9. Politicas: modo de release, lanes, gates globales, skip, cancelacion, deployment y finalizacion.
10. Autonomia: que puede ejecutar el agente sin aprobacion y que debe quedar como propuesta o ChangeSet pendiente.

## Preguntas de `/plan-config`

`/plan-config` modifica configuracion existente. Debe operar con ChangeSets y aprobacion cuando cambie una politica que afecte ejecucion o alcance.

Stages esperados:

```text
/plan-config scopes
/plan-config sources
/plan-config policies
/plan-config git
/plan-config commands
/plan-config autonomy
/plan-config guide refresh --scope <scope-id>
/plan-config guide approve --scope <scope-id>
/plan-config generator add --scope <scope-id>
```

## Deteccion determinista

El script puede detectar:

- carpetas top-level y workspaces;
- `.git/`, branch actual y remotos;
- `package.json`, `pom.xml`, `build.gradle`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `docker-compose.yml`;
- `README.md`, `AGENTS.md`, `CONTRIBUTING.md`, `docs/`;
- carpetas con nombres comunes de backlog o producto, sin tratarlas como obligatorias;
- archivos de guias por patrones como `*guideline*`, `*guide*`, `architecture`, `style`, `coding`, `testing`, `logging`;
- scripts candidatos bajo rutas como `scripts/`, `tools/` o `bin/` que generen docs, tests o matrices.

La deteccion no decide sola el contrato final. Propone un ChangeSet y escribe solo despues de validacion, revision base vigente y aprobacion cuando corresponda.

## Reglas

- La raiz de workspace es siempre el directorio actual y su `./.planning/`; no se buscan `.planning/` en padres.
- Todo scope debe tener `id`, `label`, `kind` y al menos un `path` o una justificacion `non_code: true`.
- Una story nueva no declara `scope_id`; declara valor funcional. Los work packages declaran `scope_id`.
- Si una capacidad cruza scopes, se crea una story/capability unica con varios work packages.
- Cada work package vive bajo la story y tiene sus propias tasks atomizadas.
- Si no hay guia tecnica para un scope de codigo, el release plan debe crear una story/work package/task previa para definirla antes de tareas de implementacion.
- Si hay documentacion suficiente, `/plan-config guide refresh` debe generar o refrescar `task-guide.md` y `test-guide.md` del scope antes de atomizar work packages.
- Si no hay documentacion suficiente, la guia debe marcar gaps explicitos y bloquear la automatizacion deterministica de tasks/tests hasta que se creen fuentes faltantes o una decision humana acepte el riesgo.
- Si existe un generador custom del proyecto, el plugin debe invocarlo por contrato estable y validar su salida, no duplicar su logica en la skill.
- Si no hay fuente de historias, `/release plan` o `/plan-story add` puede crear stories desde una descripcion humana, pero debe registrar que no hubo backlog fuente.
- Si git esta deshabilitado, los scripts no deben generar pasos `git`/`gh`; deben generar evidencia local y checklist manual.
- Los comandos se guardan como `executable + args + working_directory + timeout + approval`; nunca como string de shell libre.
- Todas las mutaciones se registran en `events.ndjson` con operation ID, actor/agente, timestamps, hashes de entrada/salida, archivos modificados y resultado.
