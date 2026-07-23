# Runtime, launcher y Node.js

## Propuesta actual

```text
bin/arcflow
runtime/dist/arcflow.mjs
```

El bundle es self-contained.

## Qué resuelve

- no requiere `npm install`;
- incluye dependencias;
- simplifica distribución;
- reduce drift.

## Qué no resuelve

Sigue necesitando:

```text
node
```

El hecho de que Claude Code funcione no garantiza que Node esté instalado, especialmente cuando se usa un instalador nativo.

## Opciones

### Opción A — Node obligatorio

Declarar:

```text
Runtime requires Node.js 20+
```

Agregar preflight:

- versión;
- path;
- permisos;
- mensaje de instalación.

Ventajas:

- implementación simple;
- adecuada para usuarios desarrolladores.

### Opción B — Binarios nativos

Distribuir:

- Linux x64;
- Linux ARM64;
- macOS x64;
- macOS ARM64;
- Windows x64;
- Windows ARM64.

Ventajas:

- cero runtime externo.

Desventajas:

- CI y releases más complejos;
- múltiples artefactos;
- signing;
- mayor mantenimiento.

### Opción C — Instalación administrada

Instalar dependencias o runtime en almacenamiento persistente del plugin.

No elimina necesariamente la dependencia de Node/npm.

## Decisión requerida

Definir explícitamente:

```text
bundle JavaScript + Node obligatorio
```

o:

```text
binario nativo
```

## Spike

Debe probar:

- Claude Code nativo sin Node;
- Node ausente;
- Node incompatible;
- Windows/WSL2;
- resolución del plugin root;
- actualización del plugin.
