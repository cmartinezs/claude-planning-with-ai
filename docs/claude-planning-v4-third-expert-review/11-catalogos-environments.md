# Catálogos y environments

## Problema

La arquitectura separa:

```text
Delivery Scope
Cross-cutting Concern
Gate Profile
```

Pero no define storage canónico para concerns y gates.

## Estructura propuesta

```text
.planning/
  scopes/
  concerns/
    security.yml
    accessibility.yml
  gate-profiles/
    security-default.yml
    frontend-default.yml
  gates/
    unit-tests.yml
    threat-model.yml
    accessibility-review.yml
```

## Gate

```yaml
id: unit-tests
type: automated
command_ref: web-unit-tests
evidence:
  - command_output
```

## Concern

```yaml
id: security
gate_profiles:
  - security-default
applies_to:
  scope_kinds:
    - application
    - service
```

## Gate Profile

```yaml
id: security-default
gates:
  - threat-model
  - dependency-audit
```

## Environments

La propuesta menciona:

```text
beta
demo
production
custom
```

Debe existir un catálogo:

```text
.planning/environments/
  local.yml
  beta.yml
  demo.yml
  production.yml
```

## Environment schema

```yaml
id: beta
kind: preproduction
deployment_commands:
  - deploy-beta
verification_commands:
  - smoke-beta
approval_policy: required
promotion:
  next: production
rollback_policy: supported
evidence_requirements:
  - deployment-log
  - smoke-result
```

## Integración

Environment se relaciona con:

- test guide;
- release readiness;
- deployment event;
- post-deployment verification;
- promotion;
- rollback;
- secrets references.
