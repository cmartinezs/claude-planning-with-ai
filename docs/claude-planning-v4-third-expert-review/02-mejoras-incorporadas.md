# Mejoras incorporadas

## Estado general

La segunda revisión fue incorporada de forma sustantiva.

## Release Item tipado

La entidad canónica ahora puede representar:

```yaml
kind: user_story | capability | defect | enabler | spike | compliance | migration | operational
```

Campos condicionales:

| Kind | Campos principales |
|---|---|
| `user_story` | actor, need, value, acceptance criteria |
| `capability` | outcome, behavior, acceptance criteria |
| `defect` | observed behavior, expected behavior, reproduction, severity |
| `enabler` | technical outcome, unlocked capabilities |
| `spike` | question, timebox, expected decision |
| `compliance` | obligation, authority, deadline, evidence |
| `migration` | source state, target state, rollback |
| `operational` | procedure, owner, evidence |

## Fuente única de scopes

`config.yml` solo referencia:

```yaml
scope_catalog:
  directory: .planning/scopes
  enabled:
    - web
    - legal
```

La definición completa vive en:

```text
.planning/scopes/<scope-id>/scope.yml
```

## Guías estructuradas

Se separaron:

```text
task-guide.yml
task-guide.md
test-guide.yml
test-guide.md
```

Regla:

```text
YAML es regla ejecutable.
Markdown es explicación humana.
```

## Identidad distribuida

Se incorporó:

```yaml
id: 01J4F0Z9M...
display_id: T0042
slug: validate-schema
```

## Revisiones por agregado

ChangeSet:

```json
{
  "baseRevisions": {
    "projectConfig": "sha256:...",
    "scope:web": "sha256:...",
    "guide:web:task": "sha256:...",
    "release:01J...": "sha256:...",
    "releaseItem:01J...": "sha256:...",
    "workPackage:01J...": "sha256:..."
  }
}
```

## Event journal

El storage primario ahora utiliza eventos por archivo:

```text
.planning/events/YYYY/MM/<event-id>.json
```

`events.ndjson` queda como export.

## Operaciones multiarchivo

```text
.planning/.operations/<operation-id>/
  operation.yml
  change-set.json
  before/
  staged/
  result.json
```

Estados:

```text
PROPOSED
VALIDATED
APPROVED
STAGED
APPLYING
APPLIED
VERIFIED
RECORDED
FAILED
ROLLED_BACK
```

## CQS

`/arc-check` ya no muta.

Solo:

- valida;
- reporta;
- recomienda operaciones.

## Launcher y bundle

```text
bin/arcflow
runtime/dist/arcflow.mjs
```

No se asume `npm install` en el workspace usuario.

## Template pack histórico

```text
.planning/vendor/template-packs/<fingerprint>/
```

Permite conservar templates utilizados anteriormente.

## Schemas

Se agregaron contratos para:

- actor;
- approval;
- gate;
- blocker;
- risk;
- waiver;
- decision;
- deployment event;
- finalization;
- revision;
- command;
- provenance;
- resolution;
- Release Item;
- operation.
