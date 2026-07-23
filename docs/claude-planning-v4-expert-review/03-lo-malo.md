# Lo malo

## 1. Las historias multi-scope no son realmente User Stories

Este es el principal problema conceptual.

La propuesta establece que:

- una story pertenece a un scope;
- una story nunca cruza scopes;
- una capacidad que afecta web y API se divide en `story-01-a` y `story-01-b`;
- `release.md` coordina ambas.

Una User Story representa valor o comportamiento observable por un actor.

Ejemplo:

> Como docente, quiero publicar una evaluación para que mis estudiantes puedan responderla.

La parte API no entrega valor independientemente.

La parte web tampoco.

Son slices técnicos de una misma historia.

Por tanto:

```text
story-01-a: Capability UI
story-01-b: Capability API
```

no son dos User Stories.

Son dos work packages técnicos.

El `Story Group 01` es, semánticamente, la verdadera User Story o Capability.

### Modelo recomendado

```text
Release
  └── User Story / Capability
        ├── Scope Work Package: API
        │     └── Tasks
        ├── Scope Work Package: Web
        │     └── Tasks
        └── Scope Work Package: Agents
              └── Tasks
```

O:

```text
release -> story -> scope slices -> tasks
```

La Story debe contener:

- actor;
- necesidad;
- valor;
- criterios de aceptación;
- reglas funcionales;
- outcome;
- Definition of Done funcional.

El Scope Slice debe contener:

- scope propietario;
- diseño técnico;
- interfaces;
- dependencias;
- riesgos;
- tasks;
- validaciones técnicas.

## 2. `scope` mezcla demasiados conceptos

La propuesta permite que un scope sea:

- carpeta;
- package;
- repositorio;
- servicio;
- módulo;
- documentación;
- infraestructura;
- proceso manual;
- legal;
- operations.

Estos elementos pertenecen a dimensiones diferentes:

- artefacto;
- deployment unit;
- bounded context;
- equipo;
- disciplina;
- proceso.

Debe definirse scope como:

> Una unidad estable de ownership y validación que puede recibir un work package y posee paths, fuentes, reglas y gates propios.

Luego se pueden soportar tipos:

```yaml
kind:
  - application
  - service
  - library
  - infrastructure
  - documentation
  - process
  - compliance
```

Cada tipo debería activar reglas diferentes.

No tiene sentido exigir el mismo smoke test, Git flow o Test Execution Evidence para un scope `legal` y para un scope `api`.

## 3. Los scopes son de proyecto, no de release

Los scopes se descubren durante la configuración del proyecto, pero las guías aparecen dentro de cada release.

También se propone opcionalmente un directorio global `_scope-guides/`.

Esto deja ambiguo cuál es el artefacto canónico.

La recomendación es:

```text
.planning/
  config.yml
  scopes/
    web/
      scope.yml
      task-guide.md
      test-guide.md
    api/
      scope.yml
      task-guide.md
      test-guide.md
  releases/
    R0001-example/
      release.yml
```

Las releases deben referenciar revisiones concretas de las guías:

```yaml
scope_refs:
  - scope_id: web
    guide_revision: sha256:...
  - scope_id: api
    guide_revision: sha256:...
```

Esto evita duplicación y mejora reproducibilidad.

## 4. Secuencia lineal demasiado rígida

Impedir liberar una release posterior mientras una anterior no esté cerrada funciona para un único release train.

No funciona bien para:

- hotfixes;
- ramas de mantenimiento;
- productos múltiples;
- despliegues independientes;
- mobile con aprobación de stores;
- releases paralelas por cliente.

El orden debe ser una política configurable:

```yaml
release_policy:
  mode: strict_sequence
```

Alternativas:

```yaml
mode: dependency_graph
mode: release_train
mode: parallel
```

También pueden existir lanes:

```yaml
release_lane: main
release_lane: hotfix
release_lane: mobile
```

## 5. `BLOCKED` está modelado como estado principal

Una release, story o task puede estar en progreso y tener blockers.

`BLOCKED` no debería reemplazar el estado real del lifecycle.

Modelo recomendado:

```yaml
status: IN_PROGRESS

blockers:
  - id: B-004
    severity: blocking
    reason: API contract undefined
    created_at: ...
    resolved_at: null
```

La UI o el reporte puede mostrar:

```text
IN_PROGRESS · BLOCKED
```

sin perder la fase real.

## 6. `SKIPPED` puede ocultar alcance incompleto

Permitir que una release quede lista cuando todas las stories están `DONE` o `SKIPPED` puede convertir `SKIPPED` en una salida administrativa.

Un skip debe exigir:

```yaml
resolution: SKIPPED
reason: ...
approved_by: ...
accepted_risk: ...
replacement:
  release_id: R0002
  work_item_id: ...
```

Los elementos deberían declarar:

```yaml
commitment: required | optional
```

Solo los opcionales deberían poder omitirse sin waiver formal.

## 7. Release está sobrecargada

La entidad release representa simultáneamente:

- plan de trabajo;
- agrupación funcional;
- orden de ejecución;
- gate de calidad;
- evento de liberación;
- cierre administrativo;
- retrospectiva.

Conviene separar conceptualmente:

```text
Release Plan
Deployment Event
Finalization
```

No necesariamente deben ser comandos distintos, pero sí eventos o entidades diferenciadas.
