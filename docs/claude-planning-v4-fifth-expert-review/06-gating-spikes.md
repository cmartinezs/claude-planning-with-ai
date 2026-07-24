# Gating obligatorio de spikes

## Problema

`DECISION_ACCEPTED_WITH_LIMITATIONS` puede cerrar actualmente un spike fallido sin distinguir criticidad.

Esto no es aceptable para integridad, hashing, concurrencia o recovery.

## Template obligatorio

Cada spike debe incluir:

```yaml
critical: true
waivable: false
```

Cada criterio debe incluir:

```yaml
pass_criteria:
  - id: no-data-loss
    severity: critical
    waivable: false
```

## Regla exacta

```md
DECISION_ACCEPTED_WITH_LIMITATIONS no puede utilizarse cuando falla
un criterio critical con waivable: false.

Los criterios de integridad, ausencia de pérdida de datos,
reproducibilidad de hashes, aislamiento de paths e idempotencia
son siempre critical y no waivable.
```

## Spikes con criterios no renunciables

### Canonical Core

No renunciable:

- hash reproducible;
- path normalization;
- identity uniqueness;
- DSL determinista.

### Worktree Merge

No renunciable:

- ausencia de pérdida de datos;
- ausencia de sobrescritura silenciosa;
- índices regenerables.

### Transaction Recovery

No renunciable:

- idempotencia;
- consistencia;
- recovery verificable;
- no corrupción.

### Integrated Prototype

No renunciable:

- integridad del estado;
- ChangeSet obligatorio;
- audit trail.

## Reapertura obligatoria

Agregar transición:

```text
DECISION_ACCEPTED_WITH_LIMITATIONS
  -> IN_PROGRESS
```

Evento:

```text
reopen_accepted_limitation
```

Guard:

```text
Se cumple la condición de reapertura registrada en el ADR.
```

## Criterio de aceptación

Un spike con fallo crítico no puede cerrar el Corte -1.2.

No se acepta una mitigación textual como sustituto de una prueba crítica fallida.
