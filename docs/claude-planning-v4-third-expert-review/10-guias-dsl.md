# Guías ejecutables y DSL

## Problema

Mover reglas desde Markdown a YAML no las vuelve automáticamente ejecutables.

Ejemplo problemático:

```yaml
when: User-visible UI behavior.

decomposition_rules:
  - id: contract-before-ui
    rule: contract-check must precede real-api-connection
```

El runtime tendría que interpretar lenguaje natural.

## Estructura recomendada

```yaml
applies_when:
  any:
    - item_kind: user_story
    - tags_contains: ui

ordering:
  - predecessor_type: contract-check
    successor_type: real-api-connection
```

## DSL cerrada

Operadores sugeridos:

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

## Ejemplo

```yaml
applies_when:
  all:
    - field: item.kind
      op: in
      value:
        - user_story
        - capability
    - field: item.tags
      op: contains
      value: ui
```

## Tipos de reglas

- applicability;
- required sections;
- ordering;
- dependency;
- gate selection;
- evidence requirements;
- command selection;
- environment selection.

## Narrativa

La guía puede mantener:

```yaml
description: Human-readable explanation.
```

Pero la narrativa no debe controlar automatización.

## Criterio

Un Work Package debe poder atomizarse sin:

- interpretar frases;
- llamar un LLM para entender reglas;
- extraer semántica desde Markdown.
