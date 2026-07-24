# Protección obligatoria de `.planning/**`

## Problema

La documentación dice que las skills no deben modificar `.planning/**` directamente.

Eso no constituye enforcement.

## Estructura obligatoria

Agregar al repo:

```text
hooks/
  hooks.json

scripts/
  protect-planning-state.mjs
  verify-plugin.sh
```

## Contrato del hook

Implementar `PreToolUse`.

Debe interceptar:

```text
Write
Edit
Bash
```

## Reglas obligatorias

### Write y Edit

Denegar cualquier escritura cuyo target esté dentro de:

```text
<workspace>/.planning/**
```

### Bash

Denegar cualquier comando que pueda escribir en `.planning/**`, salvo cuando el ejecutable invocado sea el launcher aprobado:

```text
<product-cli>
```

### Lectura

Permitir:

- Read;
- Glob;
- Grep;
- Bash query-only;
- comandos del launcher query-only.

## Mensaje exacto de bloqueo

```text
Direct writes to .planning/** are prohibited.
Use <product-cli> to produce and apply a ChangeSet.
```

## Validaciones del script

Debe detectar:

- paths relativos;
- paths absolutos;
- `../`;
- symlinks;
- redirects `>`;
- `tee`;
- `cp`;
- `mv`;
- `rm`;
- shells anidados;
- `python`, `node` o scripts utilizados para escribir en `.planning`.

## Tests obligatorios

```text
write-direct-file
edit-direct-file
bash-redirect
bash-tee
bash-cp
bash-mv
bash-rm
symlink-escape
launcher-allowed
read-allowed
```

## Criterio de aceptación

Todos los intentos directos deben fallar antes de ejecutar la herramienta.

Solo el launcher aprobado puede mutar `.planning/**`.
