# Spikes definitivos

## Regla

Ejecutar exactamente seis spikes.

No agregar un séptimo spike sin ADR aprobado.

## S1 — Host Integration

### Debe demostrar

- manifest válido;
- namespace;
- discovery;
- autocomplete;
- help;
- `bin/` en PATH del Bash tool;
- plugin root;
- plugin data;
- reload;
- update;
- hooks activos.

### Resultado obligatorio

```text
PASSED
```

## S2 — Runtime Node 20+

### Debe demostrar

- Node ausente;
- Node incompatible;
- Node 20;
- Windows;
- WSL2;
- Linux;
- macOS;
- paths con espacios;
- salida JSON.

### Resultado obligatorio

```text
PASSED
```

## S3 — Canonical Core

### Debe implementar

- UUIDv7;
- display ID determinista;
- RFC 8785;
- tree hash;
- path normalization;
- DSL v1;
- schemas mínimos.

### Resultado obligatorio

```text
PASSED
```

## S4 — Worktree Merge

### Debe probar

- create/create;
- edit/edit;
- delete/edit;
- supersede/edit;
- índices regenerables;
- no data loss.

### Resultado obligatorio

```text
PASSED
```

## S5 — Transaction Recovery

### Debe probar

- staging failure;
- partial apply;
- verification failure;
- recording failure;
- external command success/local write failure;
- compensation;
- idempotent retry;
- manual intervention.

### Resultado obligatorio

```text
PASSED
```

## S6 — Integrated Prototype

### Flujo

```text
init
-> release
-> item
-> work package
-> task
-> propose
-> validate
-> approve
-> apply
-> verify
-> check
-> report
```

### Debe demostrar

- estado canónico;
- event audit;
- ChangeSet;
- aprobación;
- projection;
- hooks;
- no direct writes;
- reproducibilidad.

### Resultado obligatorio

```text
PASSED
```
