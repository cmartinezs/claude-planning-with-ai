# Eliminación definitiva del fallback y contrato de namespace

## Problema

La documentación todavía permite un fallback del tipo:

```text
/<acronym>-init
```

Esto mantiene una segunda convención innecesaria y contradice el objetivo de una API única.

## Decisión obligatoria

Las skills deben exponerse exclusivamente como:

```text
/<plugin-name>:init
/<plugin-name>:config
/<plugin-name>:release
/<plugin-name>:item
/<plugin-name>:task
/<plugin-name>:check
/<plugin-name>:report
/<plugin-name>:decision
/<plugin-name>:update
```

## Cambios obligatorios

Modificar:

```text
docs/plugin-redesign-release-flow/
02-mapa-comandos-skills.md

docs/plugin-redesign-release-flow/
09-corte-1-2-spikes-producto-runtime.md
```

## Texto exacto que debe incorporarse

```md
Las skills canónicas usan nombres cortos y se exponen mediante el
namespace del plugin:

/<plugin-name>:init
/<plugin-name>:config
/<plugin-name>:release
/<plugin-name>:item
/<plugin-name>:task
/<plugin-name>:check
/<plugin-name>:report
/<plugin-name>:decision
/<plugin-name>:update

No se crearán skills duplicadas con prefijos por acrónimo.
El Spike Host Integration valida discovery, autocomplete, ayuda y
presentación, pero no altera esta convención.
```

## Debe eliminarse

```text
/<acronym>-init
/arc-init
fallback prefijado
fallback por acrónimo
```

Solo se permite conservar estas cadenas en:

```text
docs/design-history/
docs/claude-planning-v4-*-expert-review/
```

## Criterio de aceptación

Ejecutar búsqueda global.

Resultado esperado:

```text
0 coincidencias activas en docs públicos, roadmap y arquitectura.
```

No se acepta una frase que deje el fallback “por si acaso”.
