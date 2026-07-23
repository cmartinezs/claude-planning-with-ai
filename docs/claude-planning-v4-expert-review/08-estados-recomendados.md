# Estados recomendados

## Principio

El lifecycle y los blockers deben ser dimensiones separadas.

No usar `BLOCKED` como reemplazo del estado real.

## Release

Estados sugeridos:

```text
DRAFT
PLANNED
ACTIVE
VERIFYING
RELEASED
CANCELLED
```

Metadata de finalización:

```yaml
finalization:
  completed: true
  completed_at: ...
  retrospective_status: APPROVED
```

No es necesario que `FINALIZED` bloquee el flujo principal.

## Story

Estados sugeridos:

```text
TODO
READY
IN_PROGRESS
VERIFYING
DONE
CANCELLED
```

## Work Package

Estados sugeridos:

```text
TODO
READY
IN_PROGRESS
VERIFYING
DONE
CANCELLED
```

## Task

Estados sugeridos:

```text
TODO
READY
IN_PROGRESS
VERIFYING
DONE
CANCELLED
```

## Blockers

```yaml
status: IN_PROGRESS

blockers:
  - blocker_id: B0001
    status: OPEN
    severity: BLOCKING
    reason: Missing API contract
    created_at: ...
    resolved_at: null
```

## Riesgos

```yaml
risks:
  - risk_id: RISK-0001
    probability: medium
    impact: high
    mitigation: ...
    owner: ...
```

## Waivers

```yaml
waivers:
  - waiver_id: W0001
    gate: security-review
    reason: ...
    approved_by: ...
    expires_at: ...
```

## Skip

`SKIPPED` puede existir como resolución, no necesariamente como estado principal.

```yaml
resolution: SKIPPED
reason: ...
approved_by: ...
accepted_risk: ...
replacement:
  release_id: R0002
  work_item_id: S0015
```

## Commitment

Cada elemento debe declarar:

```yaml
commitment: required
```

o:

```yaml
commitment: optional
```

Los elementos requeridos no deben omitirse sin waiver.
