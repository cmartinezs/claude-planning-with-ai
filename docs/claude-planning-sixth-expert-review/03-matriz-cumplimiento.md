# Matriz de cumplimiento de la quinta revisión

| ID | Requisito | Estado | Acción |
|---|---|---|---|
| A01 | Eliminar fallback en mapa de comandos | APLICADO | ninguna |
| A02 | Eliminar fallback en Corte -1.2 | APLICADO | ninguna |
| A03 | Restringir contrato de `allowed-tools` | APLICADO | ninguna |
| A04 | Agregar hook `PreToolUse` | APLICADO | ninguna |
| A05 | Bloquear correctamente direct writes | FALLIDO | corregir hook |
| A06 | Criticidad y no-waivable | APLICADO | ninguna |
| A07 | Corregir state machine | PARCIAL | eliminar drift |
| A08 | Verificador no circular y confiable | FALLIDO | endurecer verificador |
| A09 | Completar Corte 0 | APLICADO | ninguna |
| A10 | Corregir criterio Corte -1.1 | APLICADO | ninguna |
| D01 | Producto nuevo 1.0.0 | APLICADO | ninguna |
| D02 | Node.js 20+ | APLICADO | ninguna |
| D03 | UUIDv7 | PARCIAL | eliminar ejemplos legacy |
| D04 | Display IDs deterministas | PARCIAL | eliminar paths híbridos |
| D05 | Parent inmutable | PARCIAL | eliminar `move` |

## Estado agregado

```text
9 aplicado
4 parcial
2 fallido
```

## Condición para comenzar S1

Todos los elementos deben quedar:

```text
APLICADO
```

No se admite:

- parcial;
- mitigación textual;
- aceptación condicional;
- “se corregirá durante S1”.

## Regla

Las seis correcciones deben ejecutarse antes de cambiar el estado de:

```text
spikes/host-integration/spike.json
```

desde:

```text
PLANNED
```

a:

```text
IN_PROGRESS
```
