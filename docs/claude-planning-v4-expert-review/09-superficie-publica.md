# Superficie pública recomendada

## Comandos base

```text
/plan-init
/plan-config
/release
/plan-story
/plan-task
/plan-check
/plan-report
/plan-decision
```

Ocho comandos bien definidos son preferibles a un comando único sobrecargado.

## `/plan-init`

Responsabilidad:

- bootstrap completo del workspace;
- creación de estructura;
- detección inicial;
- creación de config;
- creación de plugin lock.

No debe existir un segundo `release init`.

## `/plan-config`

Responsabilidad:

- scopes;
- fuentes;
- policies;
- Git;
- comandos;
- autonomía;
- guides;
- custom generators.

## `/release`

Responsabilidad:

- lifecycle de release;
- alcance;
- stories;
- readiness;
- release;
- deployment;
- finalización.

Debe actuar como router público y delegar a use cases internos.

## `/plan-story`

Responsabilidad:

- crear stories;
- enriquecer stories;
- dividir capacidades;
- crear work packages;
- validar criterios funcionales;
- atomizar por scope.

## `/plan-task`

Responsabilidad:

- inspeccionar;
- preparar;
- ejecutar;
- validar;
- corregir;
- cerrar tasks.

## `/plan-check`

Responsabilidad:

- invariantes;
- schemas;
- links;
- dependencias;
- guides;
- gates;
- readiness;
- evidencia.

`status` no debería ser un check.

## `/plan-report`

Responsabilidad:

- summary;
- status;
- standup;
- history;
- release notes;
- traceability;
- export;
- documentación generada.

## `/plan-decision`

Responsabilidad:

- registrar decisiones;
- actualizar decisiones;
- aceptar o rechazar propuestas;
- vincular decisiones con releases, stories y scopes.

## Comandos avanzados

Solo si existe una necesidad real:

```text
/plan-run
/plan-recover
/plan-backlog
```

No deben implementarse por anticipación.

## Launcher estable

En lugar de ejecutar rutas internas:

```text
node .planning/scripts/release.mjs
```

usar:

```text
claude-planning release ...
```

El launcher debe resolver:

- instalación;
- versión;
- template pack;
- workspace;
- schemas;
- runtime.
