# Persistencia y fuentes de verdad

## Principio

Toda regla ejecutable debe tener una representación estructurada y validable.

Markdown no debe ser consumido como base de datos.

## Fuentes canónicas recomendadas

```text
.planning/
  config.yml
  plugin.lock.yml

  scopes/
    web/
      scope.yml
      task-guide.yml
      test-guide.yml
      task-guide.md
      test-guide.md

  decisions/
    DEC-0001/
      decision.yml
      README.md

  releases/
    R0001/
      release.yml
      README.md
```

## `config.yml`

Debe contener:

- project metadata;
- policies globales;
- autonomía;
- Git;
- referencias al scope catalog;
- command registry;
- runtime preferences.

No debe duplicar la definición completa de scopes.

## `scope.yml`

Debe contener:

- ID;
- label;
- kind;
- ownership;
- paths;
- non-code;
- sources;
- dependencies;
- concerns;
- guides;
- validation profiles.

## Guías

El estado estructurado debe incluir:

- tipos de Work Package;
- tipos de Task;
- gates;
- required sections;
- decomposition rules estructuradas;
- test matrix;
- command references;
- evidence requirements.

La narrativa puede mantenerse en Markdown.

## Decisions

No usar únicamente:

```text
DEC-0001-slug.md
```

Usar:

```text
DEC-0001-slug/
  decision.yml
  README.md
```

`decision.yml` debe registrar:

- estado;
- propuesta;
- alternativas;
- decisión;
- aprobadores;
- links;
- waivers;
- timestamps;
- provenance.

## Proyecciones

Markdown generado:

- README;
- traceability;
- release notes;
- reports;
- retrospective;
- guide explanation.

## Drift

`plan-check docs` debe detectar:

- proyección faltante;
- proyección stale;
- edición manual;
- renderer incompatible.

Políticas:

```yaml
generated_docs:
  drift_policy: report | regenerate | reject
```
