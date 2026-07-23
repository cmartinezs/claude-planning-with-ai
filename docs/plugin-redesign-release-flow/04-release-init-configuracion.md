# Configuracion inicial de release

## Objetivo

`/release init` debe preparar el contexto que permite planificar sin asumir una estructura de proyecto especifica. Es el reemplazo v4 del concepto anterior `/release-init`, pero como etapa del comando gestor `/release`. El comando debe detectar senales de forma determinista, proponer una configuracion y pedir confirmacion humana solo donde haya ambiguedad real.

## Resultado esperado

Archivos base:

```text
.planning/
  config.yml
  project-context.md
  releases/
    README.md
```

`config.yml` debe ser legible por scripts. `project-context.md` debe ser legible por humanos y agentes.

Estos archivos son estado/configuracion del proyecto. Los templates canonicos se resuelven desde la instalacion del plugin, no desde una copia completa dentro del repo de trabajo.

## Configuracion minima

```yaml
project:
  name: example-project
  type: software

plugin:
  version: 4.0.0
  template_pack: installed
  template_pack_ref: claude-planning-with-ai@4.0.0

git:
  enabled: true
  base_branch: main
  provider: github
  automation: assisted

scopes:
  - id: web
    label: Web application
    paths:
      - web/
    kind: application
    functional_docs:
      - docs/product/
    technical_docs:
      - docs/frontend/
    guides:
      - docs/frontend-guidelines.md
    story_sources:
      - docs/backlog/
    guide_outputs:
      task_guide: .planning/releases/_scope-guides/web/task-guide.md
      test_guide: .planning/releases/_scope-guides/web/test-guide.md
    custom_generators:
      task_guide: scripts/planning/web-task-guide.mjs
      test_suite: scripts/planning/web-test-suite.mjs
    validation:
      build:
        - npm run build
      test:
        - npm test
  - id: api
    label: Backend API
    paths:
      - api/
    kind: service
    functional_docs:
      - docs/product/
    technical_docs:
      - docs/api/
    guides:
      - docs/api-guidelines.md
    story_sources:
      - docs/backlog/
    guide_outputs:
      task_guide: .planning/releases/_scope-guides/api/task-guide.md
      test_guide: .planning/releases/_scope-guides/api/test-guide.md
    custom_generators:
      task_guide: null
      test_suite: null
    validation:
      build:
        - ./mvnw test
      test:
        - ./mvnw test
```

Los ids anteriores son ejemplo. El plugin no debe tener una lista fija de scopes.

## Preguntas de `/release init`

El script debe inferir primero y preguntar despues. Preguntas esperadas:

1. Git: existe repositorio git, cual es la branch base, se usara `gh`, y que acciones requieren aprobacion.
2. Scopes: que frentes existen, que paths cubre cada uno y cual sera su id estable.
3. Historias: donde estan las historias fuente, backlog, master plan o documentos de producto.
4. Documentacion funcional: donde vive la definicion de comportamiento, reglas de negocio y criterios de aceptacion.
5. Documentacion tecnica: donde viven arquitectura, contratos, guias de estilo, guias de codigo, convenciones de testing y logging.
6. Validacion: que comandos build/test/smoke se conocen por scope y cuales quedan pendientes.
7. Guias operativas: si ya existe una guia rapida para crear tasks/tests por scope o si debe generarse desde las fuentes.
8. Generadores custom: si el proyecto tiene scripts propios para resumir guias, crear templates de task o generar test suites.
9. Autonomia: que puede ejecutar el agente sin aprobacion y que debe quedar como plan dry-run.

## Deteccion determinista

El script puede detectar:

- carpetas top-level y workspaces;
- `.git/`, branch actual y remotos;
- `package.json`, `pom.xml`, `build.gradle`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `docker-compose.yml`;
- `README.md`, `AGENTS.md`, `CONTRIBUTING.md`, `docs/`;
- carpetas con nombres comunes de backlog o producto, sin tratarlas como obligatorias;
- archivos de guias por patrones como `*guideline*`, `*guide*`, `architecture`, `style`, `coding`, `testing`, `logging`.
- scripts candidatos bajo rutas como `scripts/`, `tools/`, `bin/` o `.planning/scripts/` que generen docs, tests o matrices.

La deteccion no decide sola el contrato final. Propone y escribe solo con `--write` despues de confirmacion o argumentos explicitos.

## Reglas

- Todo scope debe tener `id`, `label` y al menos un `path` o una justificacion `non_code: true`.
- Una story nueva debe declarar `scope_id`.
- Si una capacidad cruza scopes, no se registra como una story multi-owner. Se divide en historias relacionadas con `story_group` comun y `story_part` distinto, por ejemplo `story-01-a` y `story-01-b`.
- Cada historia relacionada vive en la carpeta de su scope y tiene sus propias tasks atomizadas.
- La referencia de orquestacion entre historias relacionadas vive en el `release.md` padre.
- Si no hay guia tecnica para un scope de codigo, el release plan debe crear una story o task previa para definirla antes de tareas de implementacion.
- Si hay documentacion suficiente, `/release scope guide` debe generar `task-guide.md` y `test-guide.md` del scope antes de atomizar historias.
- Si no hay documentacion suficiente, la guia debe marcar gaps explicitos y bloquear la automatizacion deterministica de tasks/tests hasta que se creen las fuentes faltantes o una decision humana acepte el riesgo.
- Si existe un generador custom del proyecto, el plugin debe invocarlo por contrato estable y validar su salida, no duplicar su logica en la skill.
- Si no hay fuente de historias, `/release plan` puede crear historias desde una descripcion humana, pero debe registrar que no hubo backlog fuente.
- Si git esta deshabilitado, los scripts no deben generar pasos `git`/`gh`; deben generar evidencia local y checklist manual.
