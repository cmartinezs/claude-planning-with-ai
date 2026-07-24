# Execution Context y Deployment Environment

## Problema

La documentación utiliza:

```text
local
ci
beta
demo
production
```

bajo conceptos cercanos a environment.

Pero representan categorías distintas.

## Execution Context

Lugar o mecanismo donde se ejecuta una validación:

```text
local
ci
container
isolated acceptance
preview
```

## Deployment Environment

Target desplegable:

```text
beta
demo
staging
production
```

## Ejemplo

```yaml
execution_context:
  id: ci
  kind: pipeline
  runner: github-actions

deployment_environment:
  id: beta
  kind: preproduction
  deployment_command: deploy-beta
```

## Relación

Un test puede:

- ejecutarse en CI;
- apuntar a beta;
- producir evidencia para release readiness.

## Storage recomendado

```text
.planning/execution-contexts/
.planning/environments/
```

O una entidad compartida con:

```yaml
kind: local | ci | preview | preproduction | production
```

## Recomendación

Separar ambos conceptos.

Esto evita tratar `ci` como si fuera un target desplegable.

## Integraciones

Execution Context:

- commands;
- runners;
- setup;
- teardown;
- test evidence.

Deployment Environment:

- deployment;
- promotion;
- rollback;
- approvals;
- secrets refs;
- smoke verification.
