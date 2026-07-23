# Inconsistencias residuales

## 1. IDs de catálogos versus entidades

No utilizar ULID para todo.

### Entidades runtime

- release;
- Release Item;
- Work Package;
- Task;
- event;
- operation.

Usar ID distribuido.

### Catálogos

- scope `web`;
- gate `unit-tests`;
- concern `security`;
- command `web-build`.

Usar clave humana validada.

## 2. Saltos de display ID

La propuesta aún menciona impedir saltos de release ID.

Con concurrencia, cancelaciones y asignación tardía, los gaps son normales.

Validar:

- unicidad;
- formato;
- resolución;
- no ambigüedad.

No continuidad.

## 3. Release Train y Parallel

No implementar inicialmente:

```text
release_train
parallel
```

Comenzar con:

```text
strict_sequence
dependency_graph
```

## 4. Schema versus dominio

Separar:

```text
schema validator
domain invariant validator
policy evaluator
graph validator
security validator
renderer validator
```

JSON Schema no debería resolver:

- ciclos;
- transiciones;
- referencias;
- políticas;
- gates;
- conflictos.

## 5. Lifecycle versus derivados

Mantener separados:

```yaml
status: ACTIVE
completion: ...
readiness: ...
health: ...
```

No transicionar automáticamente por métricas derivadas.
