# Resumen ejecutivo

## Veredicto

El cambio de foco es correcto y necesario.

La v4 deja de intentar ordenar 53 comandos y redefine el dominio alrededor de una unidad de entrega reconocible: la release. También acierta al separar ejecución mecánica determinista, juicio de IA y aprobación humana.

Esta es la dirección correcta para convertir el plugin en una herramienta de ingeniería y no en una colección de prompts.

La propuesta debe aprobarse como dirección estratégica, pero no debería implementarse todavía en su forma actual.

## Correcciones estructurales necesarias

Antes del primer corte deben resolverse cuatro problemas:

1. El actual `Story Group` debe convertirse en la verdadera User Story o Capability.
2. Las historias `story-01-a`, `story-01-b` no deberían llamarse historias: son work packages o scope slices.
3. Markdown no debería ser el almacenamiento canónico para estados, relaciones y dependencias.
4. `dry-run + --write` no constituye por sí solo un protocolo determinista y seguro de mutación.

## Modelo recomendado

El modelo actual propone:

```text
release -> scopes -> sibling stories -> tasks
```

El modelo recomendado es:

```text
release -> story/capability -> scope work packages -> tasks
```

## Criterio de aprobación

La dirección de la v4 debe mantenerse, pero su implementación debería comenzar únicamente después de definir:

- modelo de dominio;
- schemas estructurados;
- protocolo de mutación;
- política de concurrencia;
- identidad estable;
- almacenamiento canónico;
- reglas de aprobación y autonomía.
