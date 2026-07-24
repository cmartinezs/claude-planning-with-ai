# Estrategia de spikes

## Estado

Los cinco spikes actuales son correctos, pero deberían estructurarse de forma uniforme.

## Template de spike

```text
Hypothesis
Scope
Non-goals
Timebox
Prototype location
Reusable or disposable
Inputs
Fault model
Pass criteria
Fail criteria
Evidence
Decision record
Result
```

## Orden recomendado

### Spike 1A — Host integration

Validar:

- namespace;
- skill discovery;
- autocompletado;
- help;
- bin PATH;
- plugin root;
- plugin data;
- reload;
- update.

### Spike 1B — Runtime distribution

Comparar:

- Node obligatorio;
- binario nativo;
- instalación administrada;
- Windows;
- WSL2;
- Linux;
- macOS si aplica.

### Spike 2 — Canonical core

Implementar:

- ULID o UUIDv7;
- canonical JSON;
- hashing;
- path normalization;
- DSL evaluator.

### Spike 3 — Worktree merge

Probar:

- create/create;
- edit/edit;
- delete/edit;
- move/edit;
- display ID collision;
- regenerated indexes.

### Spike 4 — Transaction recovery

Fallar:

- después de staging;
- después del primer write;
- después del estado canónico;
- antes del evento;
- después de comando externo.

### Spike 5 — Integrated prototype

Flujo:

```text
init
-> release
-> item
-> work package
-> task
-> propose
-> apply
-> check
-> report
```

## Guía ejecutable

El actual spike de guía ejecutable puede:

- integrarse al Canonical Core;
- mantenerse como prueba adicional.

## Criterio de salida

Cada spike debe producir:

- código;
- fixtures;
- pruebas;
- evidencia;
- ADR;
- decisión.
