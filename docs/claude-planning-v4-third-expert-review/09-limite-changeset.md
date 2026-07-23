# Límite del ChangeSet

## Ambigüedad actual

La propuesta indica:

> Todas las mutaciones pasan por ChangeSet.

También indica que el agente implementa código.

No está claro si el ChangeSet controla:

- solo `.planning/**`;
- source code;
- tests;
- infraestructura;
- Git;
- GitHub;
- comandos externos.

## Riesgo

Si controla todo, el runtime se convierte en:

- patch engine;
- diff manager;
- rollback engine;
- Git orchestrator;
- code editor;
- command runner;
- reconciliador de conflictos.

El alcance crece drásticamente.

## Separación recomendada

### Control plane

Gestionado obligatoriamente por el runtime:

```text
.planning/**
policies
operations
events
approvals
state transitions
canonical metadata
```

### Work product plane

Gestionado por herramientas normales:

```text
src/**
tests/**
infra/**
product docs
configuration
```

## Evidencia del work product

```yaml
work_product:
  git_diff_hash: ...
  commit_sha: ...
  changed_paths:
    - ...
  verification_refs:
    - ...
```

## Regla

El ChangeSet controla obligatoriamente el control plane.

Puede registrar o planificar operaciones sobre el work product, pero no necesita ser el editor universal.

## Excepciones

Cuando el runtime genere:

- templates;
- test skeletons;
- documentación;
- configuración;

puede aplicar cambios sobre work product mediante una operación explícita y limitada.
