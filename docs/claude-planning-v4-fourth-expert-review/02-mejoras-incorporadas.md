# Mejoras incorporadas

## 1. Naming y namespace

`ARC Flow` quedó como codename.

La superficie pública se diseña como:

```text
plugin name + skill name
```

Skills canónicas:

```text
init
config
release
item
task
check
report
decision
update
```

Forma esperada:

```text
/<product-name>:init
/<product-name>:release
```

## 2. Paths canónicos

Ya no se acepta como path canónico:

```text
R0001-slug/
RI0001-slug/
WP0001-slug/
T0001-slug/
```

Se propone:

```text
releases/<primary-id>/
items/<primary-id>/
work-packages/<primary-id>/
tasks/<primary-id>/
```

O un path híbrido que incluya parte del ID distribuido.

## 3. Modelo append-by-file

Los hijos referencian al padre:

```yaml
release_id: 01J-RELEASE
```

Los índices de hijos son proyecciones regenerables.

Esto reduce conflictos Git y escrituras concurrentes sobre agregados padres.

## 4. Límite del ChangeSet

El ChangeSet controla el control plane:

```text
.planning/**
policies
operations
events
approvals
state transitions
canonical metadata
```

El work product queda como evidencia:

```yaml
work_product:
  git_diff_hash: sha256:...
  commit_sha: ...
  changed_paths: []
  verification_refs: []
```

## 5. DSL cerrada

Las guías ya no deberían contener reglas en lenguaje natural.

Operadores iniciales:

```text
equals
not_equals
contains
exists
all
any
not
in
matches
```

## 6. Storage operativo

Se separan:

```text
.planning/events/
.planning/operations/
.planning/.runtime/
.planning/vendor/
```

## 7. Release policies

Primer runtime:

```text
strict_sequence
dependency_graph
```

Futuro:

```text
release_train
parallel
```

## 8. Trust model

El diseño reconoce que el sistema ofrece:

- guardrails;
- trazabilidad;
- human-in-the-loop cooperativo.

No es una sandbox contra un agente malicioso con permisos equivalentes al usuario.

## 9. Corte -1.2

Se formalizaron cinco spikes:

1. plugin real;
2. dos worktrees;
3. crash recovery;
4. canonical hashes;
5. guía ejecutable.
