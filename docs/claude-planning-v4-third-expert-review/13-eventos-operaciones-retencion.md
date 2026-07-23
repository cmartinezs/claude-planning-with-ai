# Eventos, operaciones y retención

## Eventos: modelo recomendado

Declarar explícitamente:

```text
YAML/JSON de agregados = estado canónico
eventos = auditoría inmutable
```

No utilizar event sourcing completo en la primera versión.

## Razón

Event sourcing requiere:

- replay;
- snapshots;
- migration de eventos;
- ordering;
- causalidad;
- reconstrucción;
- compensaciones;
- mayor complejidad.

## Recovery

La recuperación debe usar:

- operation manifest;
- before/staged;
- hashes;
- canonical state;
- result.

No replay completo de eventos.

## Problema de `.operations/`

Puede contener:

- código;
- secretos;
- archivos grandes;
- datos temporales;
- resultados sensibles.

## Separación recomendada

```text
.planning/events/              # auditoría versionable
.planning/operations/          # manifests resumidos
.planning/.runtime/            # staging, before, logs; gitignored
.planning/vendor/              # snapshots según política
```

## Política Git

| Ruta | Git |
|---|---|
| canonical state | versionado |
| audit events | configurable, recomendado |
| operation manifest | configurable |
| staged/before | no versionado |
| runtime logs | no versionado |
| template vendor | según lock |

## Retención

```yaml
runtime:
  operation_retention_days: 7
  retain_failed_operations: true
  retain_before_snapshots: false
  event_retention: permanent
```

## Limpieza

Debe existir mantenimiento que:

- archive;
- purge;
- reporte;
- respete locks;
- preserve evidencia requerida.
