# Permisos y `allowed-tools`

## Problema

La forma:

```yaml
allowed-tools: Bash(<product-cli> ...)
```

es demasiado amplia.

Puede preaprobar:

- `approve`;
- `apply`;
- deployment;
- update;
- Git mutante.

## Regla obligatoria

`allowed-tools` debe declarar comandos concretos.

Nunca utilizar:

```yaml
allowed-tools: Bash(<product-cli> *)
```

Ni equivalentes amplios.

## Contrato por skill

### Skill `check`

```yaml
---
description: Validate project state without mutation.
argument-hint: <stage> [target]
disable-model-invocation: true
allowed-tools: Bash(<product-cli> check *)
---
```

### Skill `report`

Solo preaprobar stages query-only:

```yaml
---
description: Produce query-only project reports.
argument-hint: <status|standup|history> [target]
disable-model-invocation: true
allowed-tools: Bash(<product-cli> report status *) Bash(<product-cli> report standup *) Bash(<product-cli> report history *)
---
```

`report render` no debe estar preaprobado.

### Skills mutantes

Para:

```text
init
config
release
item
task
decision
update
```

usar:

```yaml
---
description: ...
argument-hint: ...
disable-model-invocation: true
---
```

Sin `allowed-tools` general.

## Aprobaciones

```text
Host permission != runtime approval
```

El host decide si Bash puede ejecutarse.

El runtime decide si un ChangeSet concreto puede aplicarse.

## Policy obligatoria

```yaml
approvals:
  allow_agent_self_approval: false
```

## Criterio de aceptación

- Ninguna skill mutante preaprueba `approve`.
- Ninguna skill mutante preaprueba `apply`.
- Ninguna skill preaprueba deployment.
- Ninguna skill usa wildcard general sobre todo el CLI.
- `check` y reportes query-only sí pueden usar preaprobación restringida.
