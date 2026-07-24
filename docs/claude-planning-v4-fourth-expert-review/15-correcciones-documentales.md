# Correcciones documentales inmediatas

## 1. Gating

Cambiar:

```text
Después de Corte -1 y Corte -1.1
```

por:

```text
Después de Corte -1, Corte -1.1 y Corte -1.2
```

## 2. Naming residual

Eliminar:

```text
arc-init
```

de flujos que usan placeholders.

Usar:

```text
<product-name>:init
```

o:

```text
init
```

## 3. Versionado

Reemplazar `4.0.0` por placeholders donde la decisión siga abierta.

## 4. Launcher

Renombrar:

```text
launcher público
```

a:

```text
launcher interno estable del plugin
```

## 5. Skills

Agregar:

- allowed tools;
- model invocation policy;
- approvals;
- stop conditions;
- permiso por stage.

## 6. Agregados

Definir agregados independientes y tipos de invariantes.

## 7. Display IDs

Agregar lifecycle, aliases y estrategia de colisión.

## 8. DSL

Corregir el ejemplo UI de `any` a `all` si corresponde.

## 9. Contextos

Separar:

```text
Execution Context
Deployment Environment
```

## 10. Operaciones

Agregar tabla formal de transiciones.

## 11. Scripts internos

Renombrar:

```text
planning-init.mjs
planning-config.mjs
planning-story.mjs
planning-task.mjs
planning-check.mjs
planning-report.mjs
```

a:

```text
workspace-init.mjs
config.mjs
item.mjs
task.mjs
check.mjs
report.mjs
```

## 12. Spikes

Agregar estado:

```text
PLANNED
IN_PROGRESS
PASSED
FAILED
INCONCLUSIVE
DECISION_ACCEPTED_WITH_LIMITATIONS
```
