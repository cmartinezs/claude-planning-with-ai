# Identidad y paths

## Identidad propuesta

```yaml
id: 01J4F0Z9M...
display_id: T0042
slug: validate-schema
```

Esto es correcto para referencias internas.

## Problema del filesystem

La estructura continúa usando:

```text
R0001-slug/
RI0001-slug/
WP0001-slug/
T0001-slug/
```

Los display IDs pueden colisionar entre worktrees.

## Escenario

1. Worktree A crea `RI0004`.
2. Worktree B crea otro `RI0004`.
3. Los ULID son distintos.
4. Los paths tienen el mismo prefijo.
5. El merge produce colisión.

## Opciones

### Opción A — Primary ID como path

```text
releases/<primary-id>/
items/<primary-id>/
work-packages/<primary-id>/
tasks/<primary-id>/
```

La proyección humana muestra:

```text
R0001
RI0004
```

### Opción B — Path híbrido

```text
RI0004-7H3K9-publish-assessment/
```

Incluye una fracción estable del primary ID.

### Opción C — Display ID asignado al integrar

La branch crea paths por primary ID.

El display ID se asigna durante merge o render.

## Regla recomendada

El path canónico no debe depender únicamente de:

- número secuencial;
- slug;
- orden;
- scope;
- título.

## Estrategias de ID

### Runtime entities

Usar ID distribuido:

- release;
- Release Item;
- Work Package;
- Task;
- event;
- operation.

### Catalog keys

Usar slugs humanos validados:

- scope `web`;
- gate `unit-tests`;
- concern `security`;
- command `web-build`.
