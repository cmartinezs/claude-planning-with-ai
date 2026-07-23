# Storage recomendado

## Estructura propuesta

```text
.planning/
  config.yml
  plugin.lock.yml
  events.ndjson

  scopes/
    web/
      scope.yml
      task-guide.md
      test-guide.md
    api/
      scope.yml
      task-guide.md
      test-guide.md

  decisions/
    DEC-0001-slug.md

  releases/
    R0001-capability/
      release.yml
      README.md

      stories/
        S0001-publish-assessment/
          story.yml
          README.md

          work-packages/
            WP0001-api/
              work-package.yml
              tasks/
                T0001-command-contract/
                  task.yml
                  README.md

            WP0002-web/
              work-package.yml
              tasks/
                T0002-form-flow/
                  task.yml
                  README.md

      TRACEABILITY.md
      RELEASE-NOTES.md
      RETROSPECTIVE.md
```

## Estado canónico

El estado operativo debe vivir en:

- `config.yml`;
- `scope.yml`;
- `release.yml`;
- `story.yml`;
- `work-package.yml`;
- `task.yml`;
- `events.ndjson`.

## Proyecciones humanas

Los siguientes archivos deben ser generados:

- `README.md`;
- `TRACEABILITY.md`;
- `RELEASE-NOTES.md`;
- `RETROSPECTIVE.md`;
- reportes;
- dashboards Markdown;
- exports.

## Regla principal

> YAML o JSON es la fuente de verdad. Markdown es una proyección humana.

## Evitar archivo y carpeta con el mismo nombre

No se recomienda:

```text
story-name.md
story-name/
```

Aunque es válido, genera fricción en:

- navegación;
- autocompletado;
- herramientas;
- scripts;
- referencias.

Es preferible:

```text
story-name/
  story.yml
  README.md
```

## Scope catalog global

Las guías deben vivir a nivel de proyecto.

Cada release debe registrar la revisión usada:

```yaml
scope_refs:
  - scope_id: web
    guide_revision: sha256:...
  - scope_id: api
    guide_revision: sha256:...
```

Esto permite reproducir el contexto de planificación de una release histórica.

## Event journal

`events.ndjson` debe registrar operaciones relevantes:

```json
{"type":"release.created","entity_id":"R0001","timestamp":"..."}
{"type":"story.added","entity_id":"S0001","timestamp":"..."}
{"type":"task.started","entity_id":"T0001","timestamp":"..."}
{"type":"gate.failed","entity_id":"T0001","timestamp":"..."}
{"type":"release.deployed","entity_id":"R0001","timestamp":"..."}
```

El journal debe ser append-only.
