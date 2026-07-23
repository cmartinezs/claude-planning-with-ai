# Próximos pasos

## P0 — Resolver antes de implementar

### 1. Fuente de verdad

Rediseñar `config.yml` para no duplicar `scope.yml`.

### 2. Guías estructuradas

Crear:

```text
task-guide.yml
test-guide.yml
```

y usar Markdown solo como proyección.

### 3. Event journal

Reemplazar:

```text
events.ndjson
```

como storage primario por eventos individuales.

### 4. Revisiones

Diseñar `baseRevisions` por agregado.

### 5. Identidad

Decidir:

```text
ULID/UUIDv7 interno + display ID secuencial
```

### 6. Launcher

Mover la entrada ejecutable a `bin/`.

### 7. Packaging

Crear runtime bundle self-contained.

## P1 — Completar dominio

### 8. Release Item tipado

Resolver Story/Capability.

### 9. Schemas compartidos

Crear:

- gates;
- actors;
- approvals;
- blockers;
- risks;
- waivers;
- decisions;
- deployment events.

### 10. Environments

Definir:

- beta;
- demo;
- production;
- custom environments.

### 11. Guide revisions

Fijarlas por Work Package.

### 12. Decisions

Persistir YAML más Markdown generado.

## P2 — Primer vertical slice

```text
plan-init
  -> config
  -> scope
  -> release
  -> release item
  -> work package
  -> task
  -> ChangeSet
  -> apply
  -> verify
  -> report
```

## P3 — Validación

Fixtures:

1. monorepo;
2. repo simple;
3. scope no-code;
4. dos worktrees concurrentes;
5. operación fallida multiarchivo;
6. plugin actualizado con template pack antiguo;
7. Windows/WSL2.

## P4 — Skills

Crear skills solo cuando el runtime tenga:

- schemas;
- CLI;
- ChangeSets;
- storage;
- tests;
- error contracts.

## Criterio de éxito

La arquitectura debe poder explicarse sin excepciones:

```text
1. Inicializa.
2. Configura scopes y policies.
3. Crea release items.
4. Divide por Work Packages.
5. Atomiza en tasks.
6. Propone ChangeSets.
7. Valida y aprueba.
8. Aplica y verifica.
9. Registra eventos.
10. Genera reportes y release outputs.
```
