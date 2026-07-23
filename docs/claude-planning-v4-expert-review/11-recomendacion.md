# Recomendación

## No comenzar todavía por `skills/release/SKILL.md`

El primer paso no debería ser implementar el comando público.

Primero debe ejecutarse un:

```text
Corte -1: contrato del dominio y del runtime
```

## Entregables del Corte -1

### 1. Modelo formal

Definir:

- Release;
- Story;
- Scope Work Package;
- Task;
- Scope;
- Decision;
- Gate;
- Blocker;
- Waiver;
- Deployment Event.

### 2. Schemas

Crear JSON Schema o equivalente para:

- config;
- plugin lock;
- scope;
- release;
- story;
- work package;
- task;
- change set;
- event;
- guide metadata.

### 3. Protocolo de mutación

Definir:

```text
inspect -> propose -> validate -> approve -> apply -> verify -> record
```

### 4. Identidad

Definir IDs inmutables:

```text
R0001
S0001
WP0001
T0001
```

### 5. Concurrencia

Definir:

- revision hash;
- optimistic locking;
- operation locks;
- idempotency;
- conflictos;
- comportamiento en worktrees.

### 6. Storage

Definir estado canónico estructurado.

Markdown debe quedar como proyección.

### 7. Políticas

Definir políticas configurables para:

- secuencia de releases;
- lanes;
- autonomía;
- approvals;
- gates;
- skip;
- cancelación;
- deployment;
- finalización.

### 8. Ejecución segura

Definir contrato estructurado para:

- comandos;
- generators;
- rutas;
- cwd;
- timeouts;
- outputs;
- permisos.

### 9. Fixtures

Crear al menos tres proyectos de prueba:

1. monorepo software;
2. repositorio simple;
3. proyecto con scopes no-code.

### 10. Pruebas de arquitectura

Validar:

- transiciones;
- dependencias;
- ciclos;
- IDs;
- concurrencia;
- idempotencia;
- atomicidad;
- staleness;
- reproducibilidad;
- seguridad de paths.

## Después del Corte -1

El orden recomendado es:

1. runtime y schemas;
2. storage;
3. change sets;
4. project init/config;
5. scope catalog;
6. release aggregate;
7. story y work packages;
8. tasks;
9. checks;
10. reports;
11. skills;
12. documentación;
13. eliminación legacy.
