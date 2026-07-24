# Límites de agregados

## Problema conceptual

La documentación utiliza “Release Aggregate”.

Sin embargo:

- Release tiene archivo propio;
- Release Item tiene archivo propio;
- Work Package tiene archivo propio;
- Task tiene archivo propio;
- cada entidad tiene revisión;
- cada entidad puede mutarse independientemente.

Esto se parece más a múltiples agregados relacionados.

## Modelo recomendado

```text
ProjectContext Aggregate
Scope Aggregate
Release Aggregate
ReleaseItem Aggregate
WorkPackage Aggregate
Task Aggregate
```

## Invariantes locales

Se validan transaccionalmente dentro de un agregado:

- schema válido;
- transición permitida;
- scope válido;
- estado de Task;
- campos condicionales de Release Item;
- gates propios de Work Package.

## Invariantes transversales

Se calculan o validan mediante queries y policies:

- readiness de Release;
- completion agregada;
- dependencias satisfechas;
- grafo sin ciclos;
- work packages obligatorios completados;
- gates transversales aprobados.

## Beneficio

Evita pretender atomicidad global sobre toda una Release.

## Relaciones

Cada hijo declara referencia al padre:

```yaml
release_id: ...
release_item_id: ...
work_package_id: ...
```

Los padres no necesitan listas canónicas de hijos.

## Consistencia

Modelo recomendado:

```text
strong consistency within aggregate
eventual/recomputed consistency across aggregates
```

## Operaciones multiagregado

Deben declarar:

- agregados leídos;
- agregados mutados;
- revisiones;
- orden;
- compensación;
- postcondiciones;
- riesgo de conflicto.
