# Concurrencia, identidad y eventos

## Problema de concurrencia

El plugin debe funcionar en:

- worktrees;
- branches;
- múltiples agentes;
- sesiones paralelas;
- máquinas distintas;
- modo offline.

Los locks de filesystem solo protegen procesos que comparten disco.

No protegen branches o máquinas independientes.

## Identidad distribuida

Recomendación:

```yaml
id: 01J4F0Z9M...
display_id: T0042
slug: validate-schema
```

Propiedades:

- `id`: identidad primaria estable;
- `display_id`: número humano;
- `slug`: legibilidad.

El runtime debe referenciar siempre `id`.

## Asignación de display ID

Puede derivarse:

- al crear;
- al integrar;
- al renderizar;
- por release;
- por tipo.

No debe utilizarse como clave primaria.

## Eventos inmutables

Estructura:

```text
.planning/events/
  2026/
    07/
      <event-id>.json
```

Schema conceptual:

```yaml
event_id: 01J...
type: task.started
aggregate:
  type: task
  id: 01J...
timestamp: ...
actor: ...
operation_id: ...
payload: ...
input_hash: ...
output_hash: ...
```

## Orden

Usar:

- ULID;
- timestamp UTC;
- causal references;
- operation ID.

No confiar únicamente en orden de líneas.

## Idempotencia

Cada evento debe declarar:

```yaml
operation_id: OP-...
idempotency_key: ...
```

El journal debe rechazar duplicados lógicos.

## Revisión por agregado

ChangeSet recomendado:

```json
{
  "baseRevisions": {
    "release:R0001": "sha256:...",
    "story:S0001": "sha256:...",
    "workPackage:WP0001": "sha256:...",
    "guide:web:task": "sha256:..."
  }
}
```

## Merge

El runtime debe distinguir:

- conflicto de archivo;
- conflicto de revisión;
- conflicto semántico;
- operación duplicada;
- evento concurrente compatible.

No debe intentar resolver automáticamente conflictos semánticos mediante orden de timestamps.
