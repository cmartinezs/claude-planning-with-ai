# Estado de incorporación

## Aspectos correctamente incorporados

### Gating

El roadmap ya declara que no puede avanzar mientras existan spikes:

```text
PLANNED
IN_PROGRESS
FAILED
INCONCLUSIVE
```

### Agregados

Se formalizaron:

```text
ProjectContext Aggregate
Scope Aggregate
Release Aggregate
ReleaseItem Aggregate
WorkPackage Aggregate
Task Aggregate
```

### Consistencia

```text
strong consistency within aggregate
eventual/recomputed consistency across aggregates
```

### Invocación

Se separan:

```text
API conversacional
Launcher interno estable
CLI externa opcional
```

### DSL

Incluye:

- tipos;
- field paths;
- ausencia de coerción;
- errores estructurados;
- short-circuit;
- trace;
- requisitos regex.

### Hashing

Se adopta:

```text
RFC 8785
UTF-8
SHA-256
```

### Contextos

Se separan:

```text
Execution Context
Deployment Environment
```

### Spikes

El orden general es correcto.

## Estado definitivo

| Área | Estado |
|---|---|
| Dominio | aprobado |
| Storage | aprobado |
| Agregados | aprobado |
| ChangeSets | aprobado |
| Event journal | aprobado |
| DSL | aprobada |
| Canonicalización | aprobada |
| Execution Context | aprobado |
| Deployment Environment | aprobado |
| State machine | corregir |
| Permisos | corregir |
| Naming | cerrar |
| Runtime | cerrar |
| Spikes | listos después de correcciones |

## Prohibición

No reinterpretar “aprobado” como “volver a evaluar”.

Las áreas aprobadas no deben reabrirse durante los spikes salvo que una prueba demuestre una imposibilidad técnica objetiva.
