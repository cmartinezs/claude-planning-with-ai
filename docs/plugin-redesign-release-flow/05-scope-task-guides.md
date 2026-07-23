# Guias por scope para work packages, tasks y tests

## Objetivo

Cada scope necesita guias operativas cortas que traduzcan la documentacion del proyecto a reglas concretas para crear work packages, tasks tecnicas y test suites. La guia no debe vivir hardcodeada en el plugin. Debe generarse desde las fuentes configuradas del proyecto, revisarse, aprobarse y refrescarse cuando esas fuentes cambien.

Nombres:

```text
scope task guide
scope test guide
```

## Archivos

Las guias viven a nivel de proyecto:

```text
.planning/
  scopes/
    web/
      scope.yml
      task-guide.md
      test-guide.md
    api/
      scope.yml
      task-guide.md
      test-guide.md
```

Cada release registra la revision usada:

```yaml
scope_refs:
  - scope_id: web
    task_guide_revision: sha256:...
    test_guide_revision: sha256:...
  - scope_id: api
    task_guide_revision: sha256:...
    test_guide_revision: sha256:...
```

Esto evita duplicar guias por release y permite reproducir el contexto de una release historica. Si una release necesita congelar contenido adicional, debe hacerlo como metadata estructurada, no como nueva fuente canonica.

## Metadata de guia

`scope.yml` debe mantener el estado y provenance:

```yaml
scope_id: web
kind: application
guide_status:
  task_guide: approved
  test_guide: approved
guide_revisions:
  task_guide: sha256:...
  test_guide: sha256:...
provenance:
  sources:
    - docs/product/
    - docs/frontend-guidelines.md
  source_fingerprints:
    - path: docs/frontend-guidelines.md
      fingerprint: sha256:...
  generator_version: 4.0.0
  model: gpt-5
  prompt_version: scope-guide-v1
  generated_at: 2026-07-22T00:00:00Z
  reviewed_by: carlos
  approved_at: 2026-07-22T00:00:00Z
```

Estados permitidos:

```text
generated
reviewed
approved
stale
rejected
```

Una guia `generated`, `stale` o `rejected` no habilita atomizacion automatica en modo estricto. Debe existir aprobacion humana o una waiver explicita.

## Fuentes

Las guias se generan desde:

- documentacion funcional;
- documentacion tecnica;
- guias de arquitectura;
- guias de estilo/coding;
- guias de UI/UX, contratos, datos, seguridad, logging o testing;
- PDRs/ADRs aceptados;
- templates existentes del proyecto;
- scripts de build/test/smoke;
- convenciones detectadas en codigo solo cuando la documentacion lo permite o cuando el usuario lo aprueba.

El runtime guarda `Source Index` con paths y fingerprints para detectar staleness.

## Contenido de `task-guide.md`

Estructura recomendada:

```md
# Task Guide: <scope-id>

## Source Index

| Source | Role | Fingerprint | Notes |
|--------|------|-------------|-------|

## Scope Contract

| Field | Value |
|-------|-------|
| Scope kind | |
| Ownership | |
| Paths | |
| Non-code scope | |

## Work Package Types

| Type | When to use | Required sections | Required gates |
|------|-------------|-------------------|----------------|

## Task Types

| Type | When to use | Required sections | Deterministic template |
|------|-------------|-------------------|------------------------|

## Readiness Gates

| Gate | Applies to | Deterministic check | Blocks atomization? |
|------|------------|---------------------|---------------------|

## Task Decomposition Rules

- [scope-specific rules derived from docs]

## Automation Contract

- generator:
- inputs:
- output schema:
- fallback when missing:

## Open Gaps

| Gap | Impact | Required action |
|-----|--------|-----------------|
```

## Ejemplo agnostico: scope UI

Si la documentacion de un scope UI dice que una pantalla debe pasar por datos, representacion y conexion real, la guia puede derivar tipos como:

| Type | Purpose |
|------|---------|
| `contract-check` | Verificar datos de lectura/escritura, DTOs, errores, permisos, i18n y sync/async antes de disenar la pantalla. |
| `wireframe` | Definir estructura visible, estados, rutas, acciones y jerarquia de informacion. |
| `component-hierarchy` | Mapear page/section/component/hook/schema/service y responsabilidades. |
| `functional-mockup` | Construir maqueta con datos fake que pruebe layout, estados y flujos sin backend real. |
| `data-provider` | Definir loader/facade/query/mutation, estados, errores, cache y transformaciones. |
| `real-api-connection` | Reemplazar fake data por API real sin cambiar el contrato visible ya probado. |
| `e2e-suite` | Automatizar el flujo real con ambiente aislado y evidencia reproducible. |

Esos tipos son ejemplo de lo que puede salir de la documentacion de un scope. No son reglas globales del plugin.

## Ejemplo agnostico: scope compliance

Un scope no-code puede derivar work packages y tasks manuales:

| Type | Purpose |
|------|---------|
| `policy-review` | Revisar que el cambio respete politica interna o regulatoria. |
| `approval-record` | Registrar aprobador, fecha, alcance aprobado y evidencia. |
| `external-notice` | Preparar comunicacion o artefacto requerido fuera del codigo. |

Sus gates no deben exigir build/test de software salvo que el scope configure comandos propios.

## Contenido de `test-guide.md`

Estructura recomendada:

```md
# Test Guide: <scope-id>

## Source Index

| Source | Role | Fingerprint | Notes |
|--------|------|-------------|-------|

## Gates By Work Package Type

| Work Package Type | Required gates | Commands | Evidence |
|-------------------|----------------|----------|----------|

## Gates By Task Type

| Task Type | Required gates | Commands | Evidence |
|-----------|----------------|----------|----------|

## Test Data And Environments

| Need | Strategy | Setup | Teardown |
|------|----------|-------|----------|

## Deterministic Generation

- generator:
- input schema:
- output paths:
- validation command:

## Open Gaps

| Gap | Impact | Required action |
|-----|--------|-----------------|
```

## Automatizacion deterministica

La ruta del generador es configurable por proyecto:

```yaml
scopes:
  - id: web
    custom_generators:
      task_guide: scripts/planning/web-task-guide.mjs
      task_template: scripts/planning/web-task-template.mjs
      test_suite: scripts/planning/web-test-suite.mjs
```

Contrato:

- El plugin invoca el generador con input JSON.
- El generador retorna JSON o Markdown mas metadata.
- El plugin valida secciones requeridas, fingerprints y rutas de salida.
- Si falta el generador, el plugin cae a extraccion generica y marca las partes inciertas como gaps.
- El agente AI puede sintetizar narrativa faltante solo en secciones explicitamente marcadas como no deterministicas.
- La guia generada sigue siendo entrada no deterministica hasta que sea revisada, aprobada y versionada.

## Seguridad de generadores

Los generadores custom deben tratarse como codigo ejecutable sujeto a politica:

- resolver rutas dentro del boundary del workspace actual;
- rechazar path traversal y symlink escape;
- pasar inputs como archivos JSON o stdin, no por interpolacion de shell;
- guardar executable y args por separado;
- aplicar timeouts;
- redactar secretos en logs;
- registrar version del generador, input hash y output hash;
- exigir aprobacion para rutas de generador nuevas o modificadas salvo que la politica las permita.

## Puntos de integracion

`/plan-init`:

- descubre fuentes y generadores candidatos;
- escribe config inicial y plugin lock;
- crea entradas del catalogo de scopes cuando es posible.

`/plan-config guide refresh`:

- genera o refresca `task-guide.md` y `test-guide.md`;
- actualiza metadata y revisiones de guia;
- reporta fuentes stale y gaps.

`/plan-config guide approve`:

- marca guias revisadas como aprobadas;
- registra aprobador, timestamp y revision en `scope.yml`;
- emite un evento en `events.ndjson`.

`/plan-story package add`:

- lee guias de scope aprobadas antes de crear un work package;
- registra la revision de guia usada por la release.

`/plan-story atomize`:

- lee el work package y las guias de scope antes de crear tasks;
- falla cuando faltan guias requeridas o estan stale, salvo que el usuario apruebe una waiver explicita.

`/plan-check guides`:

- valida frescura de guias, secciones requeridas, provenance y salida del generador.

`/plan-check tests --generate`:

- usa `test-guide.md` para generar test suites de task/story.
