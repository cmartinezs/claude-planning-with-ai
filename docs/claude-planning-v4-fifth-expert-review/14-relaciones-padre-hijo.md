# Relaciones padre-hijo inmutables

## Decisión obligatoria

```text
ReleaseItem.release_id        immutable
WorkPackage.release_item_id   immutable
Task.work_package_id          immutable
```

## Prohibido en 1.0

```text
move Release Item
move Work Package
move Task
change parent_id
```

## Traslado de trabajo

Para mover trabajo:

1. crear nuevo agregado bajo el nuevo padre;
2. copiar solo el contenido permitido;
3. registrar provenance;
4. marcar el anterior como `SUPERSEDED` o `CANCELLED`;
5. registrar `replacement_id`.

## Ejemplo

```yaml
status: CANCELLED
resolution: SUPERSEDED
replacement_id: 019...
reason: Moved to another Release Item.
```

## Beneficios

- elimina move/edit conflict;
- simplifica merge;
- simplifica auditoría;
- preserva trazabilidad;
- evita reescritura de paths;
- evita actualizar múltiples foreign keys.

## Worktree Spike

No probar `move/edit`.

Probar:

```text
create/create
edit/edit
delete/edit
supersede/edit
```

## Criterio de aceptación

Ningún comando público ni interno modifica `parent_id`.

Los schemas declaran esos campos read-only después de creación.
