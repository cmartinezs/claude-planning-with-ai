# Corrección de identidad y paths

## Decisión aprobada

```text
Primary ID = UUIDv7
```

## Problema residual

Persisten ejemplos como:

```text
01J...
01J-RELEASE
OP-01J...
R0002
RI0004-7H3K9-...
```

Estos ejemplos contradicen UUIDv7 y display IDs deterministas.

## Archivos a corregir

```text
docs/plugin-redesign-release-flow/
01-arquitectura-objetivo.md
08-corte-1-1-contratos-runtime.md
09-corte-1-2-spikes-producto-runtime.md
10-corte-1-2-contratos-ejecucion.md
```

## Ejemplo obligatorio

```json
{
  "operationId": "0190f1c8-4e39-7a21-8bb2-2a45f8154ef1",
  "target": {
    "releaseId": "0190f1c8-5f11-7cc1-8bb2-2a45f8154ef2",
    "releaseItemId": "0190f1c8-6041-7d11-8bb2-2a45f8154ef3",
    "workPackageId": "0190f1c8-7131-7e01-8bb2-2a45f8154ef4"
  }
}
```

## Path definitivo

```text
releases/<uuidv7>/
items/<uuidv7>/
work-packages/<uuidv7>/
tasks/<uuidv7>/
```

## Eliminar

```text
RI0004-7H3K9-publish-assessment/
R0001-slug/
01J...
OP-01J...
```

## Uso de display IDs

Los display IDs solo se permiten en:

- comandos humanos;
- reportes;
- README;
- tablas;
- proyecciones.

No se permiten en:

- paths canónicos;
- foreign keys;
- base revisions;
- event aggregate IDs;
- operation IDs.

## Criterio de aceptación

La documentación activa no contiene ejemplos que parezcan ULID o counters como identidad primaria.
