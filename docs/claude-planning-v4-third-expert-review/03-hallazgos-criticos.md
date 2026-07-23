# Hallazgos críticos

## 1. Naming no validado

`ARC Flow` y `arcflow` presentan colisiones con productos existentes.

No debe aprobarse como nombre definitivo sin un naming gate.

## 2. Namespace de skills

Los comandos visibles de un plugin no necesariamente serán:

```text
/arc-init
```

La forma efectiva puede incorporar el nombre del plugin:

```text
/plugin-name:skill-name
```

La superficie pública debe diseñarse considerando esta composición.

## 3. Dependencia de Node.js

Un bundle JavaScript self-contained elimina dependencias npm, pero no elimina la dependencia del runtime Node.

Claude Code puede estar instalado nativamente sin Node.

## 4. Paths colisionables

Aunque los IDs internos sean ULID, el filesystem sigue utilizando:

```text
R0001/
RI0001/
WP0001/
T0001/
```

Dos worktrees pueden crear los mismos display IDs.

## 5. Merge de agregados

Dos branches pueden agregar hijos distintos y modificar simultáneamente el mismo `release.yml`.

Optimistic locking local no resuelve merges entre branches.

## 6. ChangeSet demasiado amplio o demasiado ambiguo

No se ha definido si controla:

- solo `.planning/**`;
- también el código fuente;
- comandos;
- Git;
- infraestructura.

## 7. YAML no necesariamente determinista

Campos como:

```yaml
when: User-visible UI behavior.
rule: contract-check must precede real-api-connection
```

siguen requiriendo interpretación humana o de IA.

## 8. Persistencia operacional incompleta

Falta definir:

- qué se versiona;
- qué queda gitignored;
- qué se retiene;
- dónde viven caches;
- cómo se eliminan snapshots.
