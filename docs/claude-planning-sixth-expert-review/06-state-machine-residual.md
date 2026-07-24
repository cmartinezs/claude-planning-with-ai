# Eliminación del drift residual de state machine

## Estado principal

La state machine aprobada utiliza:

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

## Problema residual

La documentación del Spike Transaction Recovery todavía menciona:

```text
PARTIALLY_APPLIED
```

Ese estado no pertenece al contrato definitivo.

## Cambio exacto

Reemplazar:

```md
Validar rollback, compensación, retry, idempotencia, limpieza y estados
`PARTIALLY_APPLIED` o `MANUAL_INTERVENTION_REQUIRED`.
```

por:

```md
Validar rollback, compensación, retry, idempotencia y limpieza.

Cuando una operación haya producido efectos parciales, debe transicionar
a `COMPENSATING` o `MANUAL_INTERVENTION_REQUIRED`, según exista o no
una compensación automática segura.
```

## Búsqueda obligatoria

```bash
rg "PARTIALLY_APPLIED" docs/plugin-redesign-release-flow
```

Resultado esperado:

```text
0 matches
```

## Regla

No agregar un alias de compatibilidad.

No mantener el estado como “histórico” dentro de la documentación activa.

## Criterio de aceptación

Toda la documentación activa utiliza exclusivamente la state machine aprobada.
