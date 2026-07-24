# State machine de operaciones

## Estados existentes

```text
PROPOSED
VALIDATED
APPROVED
STAGED
APPLYING
APPLIED
VERIFIED
RECORDED
FAILED
ROLLED_BACK
```

## Problema

No existe una tabla formal de transiciones.

## State machine recomendada

```text
PROPOSED
  -> VALIDATED
  -> FAILED

VALIDATED
  -> APPROVED
  -> REJECTED
  -> STALE

APPROVED
  -> STAGED
  -> STALE

STAGED
  -> APPLYING
  -> FAILED

APPLYING
  -> APPLIED
  -> FAILED
  -> ROLLED_BACK

APPLIED
  -> VERIFIED
  -> FAILED
  -> ROLLED_BACK

VERIFIED
  -> RECORDED
  -> FAILED
```

## Estados adicionales sugeridos

```text
REJECTED
STALE
COMPENSATING
COMPENSATED
PARTIALLY_APPLIED
MANUAL_INTERVENTION_REQUIRED
```

## Casos que deben definirse

- crash después de `APPLIED`;
- evento no registrado;
- postcondition fallida;
- verificación fallida;
- compensación parcial;
- comando externo exitoso y write local fallido;
- ChangeSet obsoleto después de aprobación;
- rollback imposible;
- reintento de operación idempotente.

## Operation manifest

Debe registrar:

```yaml
state: ...
previous_state: ...
transition_reason: ...
attempt: ...
started_at: ...
updated_at: ...
recovery_required: ...
manual_action: ...
```

## Resultado del Spike 3

El spike debe terminar en:

- tabla formal;
- tests de transición;
- fault matrix;
- recovery runbook;
- ADR.
