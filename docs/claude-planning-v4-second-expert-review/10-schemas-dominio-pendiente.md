# Schemas y dominio pendiente

## Schemas base existentes en la propuesta

```text
config
plugin-lock
scope
guide-metadata
release
story
work-package
task
change-set
event
```

## Schemas faltantes

Crear contratos propios o `$defs` reutilizables:

```text
actor.schema.json
approval.schema.json
gate.schema.json
blocker.schema.json
risk.schema.json
waiver.schema.json
decision.schema.json
deployment-event.schema.json
finalization.schema.json
revision-ref.schema.json
command-spec.schema.json
provenance.schema.json
resolution.schema.json
```

## Release Item

Resolver la ambigüedad Story/Capability.

Opción recomendada:

```yaml
kind: user_story | capability | defect | enabler | spike | compliance
```

## Campos condicionales

### User Story

```yaml
actor: ...
need: ...
value: ...
acceptance_criteria: ...
```

### Defect

```yaml
observed_behavior: ...
expected_behavior: ...
reproduction: ...
severity: ...
```

### Enabler

```yaml
technical_outcome: ...
unlocked_capabilities: ...
```

### Spike

```yaml
question: ...
timebox: ...
expected_decision: ...
```

### Compliance

```yaml
obligation: ...
authority: ...
deadline: ...
evidence: ...
```

## Deployment Event

Schema mínimo:

```yaml
environment: beta | demo | production
artifact_version: ...
commit_sha: ...
started_at: ...
completed_at: ...
result: succeeded | failed | rolled_back
verification: ...
rollback: ...
```

## Actor

```yaml
type: human | agent | system
id: ...
display_name: ...
source: ...
session_id: ...
```

## Approval

```yaml
approval_id: ...
actor: ...
change_set_hash: ...
scope: ...
approved_at: ...
```

## Gate

```yaml
gate_id: ...
type: automated | manual
required: true
status: pending | passed | failed | waived
evidence_refs: []
```
