# Gating del Corte -1.2

## Contrato correcto

El Corte -1.2 declara:

```text
No iniciar el vertical slice productivo
hasta cerrar los spikes de este corte.
```

Esta es la regla correcta.

## Contradicción

El roadmap todavía contiene:

```text
Después de Corte -1 y Corte -1.1,
implementar el vertical slice.
```

Esto omite el Corte -1.2.

También conserva un flujo residual:

```text
arc-init
  -> config
  -> release
```

cuando el naming definitivo sigue pendiente.

## Corrección requerida

Reemplazar por:

```text
Después de cerrar Corte -1,
Corte -1.1 y Corte -1.2,
implementar el primer vertical slice.
```

Flujo agnóstico:

```text
init
  -> config
  -> scope catalog
  -> release
  -> release item
  -> work package
  -> task
  -> check
  -> report
```

## Criterio de cierre

El Corte -1.2 no se cierra con documentación.

Debe producir:

- decisiones explícitas;
- prototipos;
- fixtures;
- pruebas automatizadas;
- evidencia;
- ADRs;
- naming decidido;
- runtime decidido;
- versión o producto decididos.

## Regla de control

No permitir que el roadmap salte al Corte 0 mientras exista un spike con estado:

```text
PLANNED
IN_PROGRESS
FAILED
INCONCLUSIVE
```

Todos deben quedar:

```text
PASSED
```

o:

```text
DECISION_ACCEPTED_WITH_LIMITATIONS
```
