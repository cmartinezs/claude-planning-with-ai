# Guias por scope para tasks y tests

## Objetivo

Cada scope necesita una guia operativa corta que traduzca la documentacion del proyecto a reglas concretas para crear tasks tecnicas y test suites. La guia no debe vivir hardcodeada en el plugin. Debe generarse desde las fuentes configuradas del proyecto y refrescarse cuando esas fuentes cambien.

Nombre provisional:

```text
scope task guide
scope test guide
```

## Archivos

Por release:

```text
.planning/releases/release-001-slug/
  scopes/
    web/
      scope.md
      task-guide.md
      test-guide.md
    api/
      scope.md
      task-guide.md
      test-guide.md
```

Opcionalmente, si una guia aplica a todas las releases, `/release init` puede generar un artefacto global de proyecto:

```text
.planning/releases/_scope-guides/
  web/
    task-guide.md
    test-guide.md
  api/
    task-guide.md
    test-guide.md
```

La release puede referenciarla o guardar un snapshot de metadatos con fingerprint de fuentes. El template canonico sigue viviendo en la instalacion del plugin; estos archivos son artefactos generados del proyecto.

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

El script debe guardar una seccion `Source Index` con paths y fingerprints para saber si la guia quedo stale.

## Contenido de `task-guide.md`

Estructura recomendada:

```md
# Task Guide: <scope-id>

## Source Index

| Source | Role | Fingerprint | Notes |
|--------|------|-------------|-------|

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

Esos tipos son un ejemplo de lo que puede salir de la documentacion de un scope. No son reglas globales del plugin.

## Contenido de `test-guide.md`

Estructura recomendada:

```md
# Test Guide: <scope-id>

## Source Index

| Source | Role | Fingerprint | Notes |
|--------|------|-------------|-------|

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

## Deterministic automation

The script path is project-configurable:

```yaml
scopes:
  - id: web
    custom_generators:
      task_guide: scripts/planning/web-task-guide.mjs
      task_template: scripts/planning/web-task-template.mjs
      test_suite: scripts/planning/web-test-suite.mjs
```

Contract:

- The plugin invokes the generator with JSON input.
- The generator returns JSON or Markdown plus metadata.
- The plugin validates required sections, fingerprints and output paths.
- If the generator is missing, the plugin falls back to generic extraction and marks uncertain parts as gaps.
- The AI agent may synthesize missing narrative only in sections explicitly marked non-deterministic.

## Integration points

`/release init`:

- discovers candidate sources and generators;
- writes config;
- creates initial `_scope-guides/` entries when possible.

`/release scope guide`:

- generates or refreshes `task-guide.md` and `test-guide.md`;
- reports stale sources and gaps.

`/release story atomize`:

- reads the scope guides before creating tasks;
- fails when required guides are missing or stale unless the user explicitly allows a non-deterministic fallback.

`/plan-check guide`:

- validates guide freshness, required sections and generator output.

`/plan-check tests --generate`:

- uses `test-guide.md` to generate task/story test suites.
