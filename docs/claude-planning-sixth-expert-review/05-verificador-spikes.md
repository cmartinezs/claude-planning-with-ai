# Corrección obligatoria del verificador de spikes

## Archivo

```text
spikes/verify-corte-1.2.mjs
```

## Problema principal

El verificador actual acepta un spike como `PASSED` aunque tenga:

```json
{
  "evidence": [],
  "fixtures": [],
  "tests": [],
  "adr": null,
  "decision": null,
  "result": null
}
```

Esto invalida el gate.

## Cambio 1 — unificar ADR

Eliminar:

```text
decision_record
```

Conservar únicamente:

```json
"adr": "docs/adr/ADR-0001.md"
```

Aplicar a:

- los seis manifests;
- el verificador;
- la documentación.

## Cambio 2 — estado por criterio

Cada criterio debe tener:

```json
{
  "id": "no-data-loss",
  "severity": "critical",
  "waivable": false,
  "status": "PENDING",
  "evidence_refs": []
}
```

Estados válidos:

```text
PENDING
PASSED
FAILED
NOT_APPLICABLE
```

## Regla `NOT_APPLICABLE`

Solo se permite cuando:

```text
waivable: true
```

## Requisitos para `PASSED`

Un spike con:

```json
"status": "PASSED"
```

debe cumplir:

```text
evidence.length > 0
fixtures.length > 0
tests.length > 0
adr no nulo
decision no nulo
result no nulo
todos pass_criteria.status = PASSED
ningún fail_criterion.status = FAILED
```

## Requisitos para aceptación limitada

Debe incluir:

- ADR;
- decisión;
- resultado;
- evidencia;
- criterios afectados;
- riesgo aceptado;
- owner;
- mitigación;
- condición de reapertura.

## Prohibición

No permitir `DECISION_ACCEPTED_WITH_LIMITATIONS` cuando un criterio tenga:

```text
severity: critical
waivable: false
status: FAILED
```

## Test negativo obligatorio

Este manifest debe producir exit code `1`:

```json
{
  "status": "PASSED",
  "evidence": [],
  "fixtures": [],
  "tests": [],
  "adr": null,
  "decision": null,
  "result": null
}
```

## Criterio de aceptación

El verificador no puede confundir:

```text
estructura completa
```

con:

```text
spike demostrado
```
