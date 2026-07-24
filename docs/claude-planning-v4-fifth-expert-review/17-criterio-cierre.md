# Criterio de cierre definitivo

## Cierre de arquitectura

La arquitectura se congela cuando:

- A01–A10 están completos;
- D01–D05 están completos;
- los contratos no tienen alternativas abiertas;
- el roadmap está alineado;
- la state machine está corregida;
- hooks están especificados.

## Cierre del Corte -1.2

Debe cumplirse todo:

```text
S1 PASSED
S2 PASSED
S3 PASSED
S4 PASSED
S5 PASSED
S6 PASSED
```

Además:

- ningún criterio crítico fue dispensado;
- no existe data loss;
- hashes son reproducibles;
- recovery es idempotente;
- hooks bloquean direct writes;
- Node 20+ funciona;
- UUIDv7 funciona;
- Integrated Prototype funciona.

## Evidencia mínima

```text
code
tests
fixtures
logs
ADRs
screenshots where relevant
platform matrix
result documents
```

## No aceptado como evidencia

- solo Markdown;
- solo promesas;
- solo pseudocódigo;
- solo diagramas;
- “debería funcionar”;
- resultados sin logs;
- ADR sin prueba.

## Revisión siguiente

La siguiente revisión debe evaluar únicamente:

```text
evidence package
```

No debe revisar otra vez:

- naming conceptual;
- modelo de dominio;
- agregados;
- Node versus native;
- UUID versus ULID;
- counters versus deterministic display IDs.

## Go/No-Go

### GO

Todos los criterios completos.

### NO-GO

Cualquier criterio crítico fallido.

No existe aprobación condicional para integridad, data loss, hashing o recovery.
