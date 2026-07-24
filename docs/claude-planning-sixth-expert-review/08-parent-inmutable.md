# Parent inmutable y eliminación de `move`

## Decisión aprobada

```text
ReleaseItem.release_id        immutable
WorkPackage.release_item_id   immutable
Task.work_package_id          immutable
```

## Problema residual

La tabla de reemplazo legacy todavía menciona:

```text
item move
```

Esto contradice parent immutability.

## Reemplazo exacto

Reemplazar la fila correspondiente por:

```md
| `plan-merge`, `plan-story-skip` |
Crear el agregado reemplazante mediante `item add` y cerrar el anterior
mediante `item resolve --resolution SUPERSEDED --replacement <id>`.
`recover` queda reservado para recuperación de operaciones, no para
cambiar el padre de una entidad. |
```

## Prohibiciones

Eliminar de la API activa:

```text
item move
move work package
move task
change parent_id
reparent
```

## Flujo correcto

```text
create replacement
-> copy permitted content
-> register provenance
-> cancel or supersede original
-> set replacement_id
```

## Worktree Merge

Probar:

```text
create/create
edit/edit
delete/edit
supersede/edit
```

No probar:

```text
move/edit
```

## Criterio de aceptación

Ningún comando público, stage interno o use case modifica el parent después de crear el agregado.
