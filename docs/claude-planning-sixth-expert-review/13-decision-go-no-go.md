# Decisión GO/NO-GO

## Estado actual

```text
NO-GO
```

## Causas

1. Hook vulnerable.
2. Verificador de spikes débil.
3. Drift de state machine.
4. Drift de identidad.
5. Stage `move` residual.
6. Verificador v3 usado como gate next-generation.

## Condición de transición

```text
NO-GO
  -> apply six correction groups
  -> run final gate
  -> GO
```

## Estado esperado después de corregir

```text
GO FOR S1 — HOST INTEGRATION
```

## Alcance del GO

El GO autoriza:

- comenzar Host Integration;
- cambiar S1 a `IN_PROGRESS`;
- crear fixtures;
- crear tests;
- recolectar evidencia;
- producir ADR.

El GO no autoriza:

- comenzar Corte 0;
- runtime productivo;
- publicación;
- saltar S2–S6;
- declarar Corte -1.2 cerrado.

## Regla

No iniciar S1 parcialmente.

No corregir el hook “durante S1”.

No dejar el verificador para después.

Los gates son precondiciones, no tareas internas del spike.
