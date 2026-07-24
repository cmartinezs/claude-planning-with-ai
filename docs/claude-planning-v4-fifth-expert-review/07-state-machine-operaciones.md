# State machine obligatoria de operaciones

## Problema

La state machine actual permite:

```text
VERIFIED -> FAILED
```

por una “verification_failed”.

Esto es incorrecto.

Si la verificación falla, la operación no estaba verificada.

## Estados definitivos

```text
PROPOSED
INVALID
VALIDATED
APPROVED
REJECTED
STALE
STAGED
APPLYING
APPLIED
VERIFYING
VERIFIED
RECORDING
RECORDED
COMPENSATING
COMPENSATED
ROLLED_BACK
MANUAL_INTERVENTION_REQUIRED
```

## Transiciones obligatorias

```text
PROPOSED
  -> VALIDATED
  -> INVALID

VALIDATED
  -> APPROVED
  -> REJECTED
  -> STALE

APPROVED
  -> STAGED
  -> STALE

STAGED
  -> APPLYING
  -> INVALID

APPLYING
  -> APPLIED
  -> COMPENSATING
  -> MANUAL_INTERVENTION_REQUIRED

APPLIED
  -> VERIFYING

VERIFYING
  -> VERIFIED
  -> COMPENSATING
  -> MANUAL_INTERVENTION_REQUIRED

VERIFIED
  -> RECORDING

RECORDING
  -> RECORDED
  -> MANUAL_INTERVENTION_REQUIRED

COMPENSATING
  -> COMPENSATED
  -> MANUAL_INTERVENTION_REQUIRED
```

## Semántica obligatoria

### `INVALID`

Error detectado antes de aplicar efectos.

### `APPLYING`

La operación ya comenzó a mutar.

### `VERIFYING`

Las escrituras terminaron, pero todavía no están aprobadas como válidas.

### `VERIFIED`

Las postcondiciones y hashes pasaron.

### `RECORDING`

Se están persistiendo eventos, manifest y proyecciones.

### `COMPENSATING`

Hubo efectos y se está ejecutando recovery.

### `MANUAL_INTERVENTION_REQUIRED`

No existe recovery automático seguro.

## Debe eliminarse

```text
VERIFIED -> FAILED
verification_failed desde VERIFIED
```

## Eventos obligatorios

```text
propose_operation
invalidate_operation
validate_operation
approve_operation
reject_operation
mark_operation_stale
stage_operation
begin_apply
apply_succeeded
begin_verification
verification_succeeded
verification_failed
begin_recording
recording_succeeded
recording_failed
begin_compensation
compensation_succeeded
compensation_failed
request_manual_intervention
```

## Criterio de aceptación

- Todas las transiciones están en schema.
- No puede editarse `state` directamente.
- Cada transición registra actor, motivo, timestamp, evidence y previous state.
- Todos los estados tienen tests positivos y negativos.
