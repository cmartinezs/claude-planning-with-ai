# Concurrencia y worktrees

## Problema

ULID y optimistic locking resuelven colisiones locales, pero no merges semánticos entre branches.

## Escenario

1. Worktree A y B parten del mismo `release.yml`.
2. A agrega Item A.
3. B agrega Item B.
4. Ambos ChangeSets son válidos.
5. Ambos modifican el listado de items.
6. Git detecta conflicto o se pierde un cambio.

## Recomendación append-by-file

Cada hijo referencia al padre.

Ejemplo:

```yaml
# release-item.yml
release_id: 01J-RELEASE
```

Evitar:

```yaml
# release.yml
items:
  - 01J-ITEM-A
  - 01J-ITEM-B
```

Los índices de hijos deben ser proyecciones.

## Beneficios

- agregar hijo crea archivo nuevo;
- reduce escrituras sobre padres;
- disminuye conflictos;
- favorece merges;
- permite reconstruir índices.

## Operaciones que sí modifican padres

Requieren:

- single writer;
- lock de agregado;
- reconciliación explícita;
- nueva propuesta tras merge.

## Contrato pendiente

Definir:

- ownership de agregados;
- branch strategy;
- merge strategy;
- display ID reconciliation;
- resolución de operaciones concurrentes;
- actualización de índices;
- relación con Git rebase/merge.

## Fixture obligatorio

`concurrent-worktrees` debe probar:

- creación simultánea de items;
- creación simultánea de Work Packages;
- display IDs duplicados;
- eventos independientes;
- merge real;
- regeneración de índices;
- validación posterior.
