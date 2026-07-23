# Arquitectura objetivo

## Principios

1. Release primero: la release es la unidad publica de planificacion, seguimiento, liberacion y cierre.
2. Story como valor: la User Story o Capability representa comportamiento observable, actor, necesidad, valor y criterios funcionales.
3. Work package por scope: el trabajo tecnico se divide por unidades estables de ownership y validacion, no por "historias hermanas".
4. Scopes globales: los scopes pertenecen al proyecto y las releases referencian revisiones concretas de sus guias.
5. Estado estructurado: YAML o JSON es fuente de verdad; Markdown es proyeccion humana generada.
6. Identidad estable: IDs inmutables como `R0001`, `S0001`, `WP0001` y `T0001`; los slugs son decorativos.
7. Menos comandos publicos: un comando por intencion principal; las variaciones son subcomandos o stages internos.
8. Skills delgadas: la skill coordina intencion, aprobacion y juicio del agente; no implementa mecanica repetible.
9. Runtime determinista: parseo, validacion, escritura atomica, indices, estados, secuencia, locks, journal y comandos planificados viven en scripts/librerias.
10. IA acotada: el agente interpreta producto, descompone trabajo, toma decisiones tecnicas justificadas, implementa codigo y revisa evidencia.
11. Configuracion explicita: policies, lanes, gates, autonomia, comandos permitidos y generadores custom viven en configuracion versionada.
12. Reproducibilidad: cada workspace registra plugin lock, schema, template pack, guide revisions y eventos.

## Modelo de dominio

```text
Project Context
+-- Scope Catalog
|   +-- Scope
|   +-- Task Guide
|   +-- Test Guide
+-- Policies
+-- Decisions
+-- Releases
    +-- Release
        +-- User Story / Capability
            +-- Scope Work Package
            |   +-- Tasks
            +-- Scope Work Package
                +-- Tasks
```

Version corta:

```text
release -> story/capability -> scope work package -> task
```

### Release

La release controla:

- objetivo del incremento;
- alcance comprometido;
- target, lane y politica de entrega;
- stories/capabilities incluidas;
- gates de release;
- riesgos y blockers agregados;
- eventos de release y deployment;
- evidencia de cierre y finalizacion.

La release no reemplaza deployment ni retrospectiva. Los eventos de deployment y la finalizacion son entidades/eventos diferenciados dentro del agregado de release.

### User Story o Capability

La story contiene el valor funcional:

- actor;
- necesidad;
- valor;
- comportamiento esperado;
- criterios de aceptacion;
- reglas funcionales;
- outcome;
- Definition of Done funcional;
- work packages requeridos u opcionales.

La story no se divide artificialmente por componentes tecnicos. Si una capacidad afecta web, API, datos y documentacion, sigue siendo una story y contiene cuatro work packages.

### Scope Work Package

Un work package contiene la porcion tecnica o disciplinaria de una story para un scope propietario:

- scope propietario;
- diseno tecnico;
- interfaces;
- contratos;
- dependencias tecnicas;
- riesgos y blockers del scope;
- gates aplicables;
- tasks atomicas;
- evidencia del scope.

Un work package puede representar API, frontend, agents, infraestructura, documentacion, datos, compliance u operacion manual.

### Task

La task es el cambio atomico ejecutable:

- objetivo tecnico;
- archivos esperados;
- precondiciones;
- pasos;
- pruebas;
- evidencia;
- closeout.

Una task pertenece a exactamente un work package y hereda el scope de ese work package.

## Scope

`scope` queda definido como una unidad estable de ownership y validacion que puede recibir work packages y posee paths, fuentes, reglas y gates propios.

Un scope no es solo una carpeta. Puede mapear a artefactos, repositorios, paquetes, servicios, modulos, equipos, disciplinas o procesos. Por eso debe declarar `kind`:

```yaml
kind: application | service | library | infrastructure | documentation | process | compliance | data | operations
```

Reglas:

- Los scopes se configuran en `/plan-init` y se modifican con `/plan-config`.
- Todo scope tiene `id`, `label`, `kind` y al menos un `path` o una justificacion `non_code: true`.
- Cada kind activa reglas y gates distintos; un scope `compliance` no hereda automaticamente gates de software.
- Las guias `task-guide.md` y `test-guide.md` viven a nivel de proyecto bajo `.planning/scopes/<scope-id>/`.
- Cada release referencia la revision de guia usada para mantener reproducibilidad historica.
- Los scripts no asumen nombres como `web`, `api` o `docs`; solo leen el catalogo configurado.

## Storage canonico

Estructura objetivo:

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

No se mantienen `.planning/active/`, `.planning/finished/` ni `.releases/` como contrato de v4. Tampoco se usa el patron `story-name.md` junto a `story-name/`; cada entidad con hijos vive en una carpeta con YAML canonico y README generado.

Estado canonico:

- `config.yml`;
- `plugin.lock.yml`;
- `scope.yml`;
- `release.yml`;
- `story.yml`;
- `work-package.yml`;
- `task.yml`;
- `events.ndjson`.

Proyecciones humanas generadas:

- `README.md`;
- `TRACEABILITY.md`;
- `RELEASE-NOTES.md`;
- `RETROSPECTIVE.md`;
- reportes;
- dashboards Markdown;
- exports.

## Plugin lock y template pack

`/plan-init` crea `.planning/plugin.lock.yml` para fijar la reproducibilidad:

```yaml
plugin:
  version: 4.0.0
  schema_version: 4
  template_pack:
    id: default
    version: 4.0.0
    fingerprint: sha256:...
```

Los templates canonicos viven en la instalacion del plugin. El workspace no recibe una copia completa del template pack; solo guarda estado, lock y artefactos generados. El runtime debe poder leer artefactos creados con revisiones anteriores compatibles del schema y bloquear o advertir cuando cambian schema, template pack o guide revisions.

## Identidad

Los IDs son inmutables y no mezclan identidad, orden visible, scope, slug ni titulo.

Recomendado:

```text
R0001
S0001
WP0001
T0001
```

Los slugs mejoran lectura, pero no son la referencia primaria:

```text
R0001-release-flow-redesign
S0004-configure-project-scopes
WP0012-api-contract
T0041-validate-schema
```

Cambiar un titulo o mover un work package dentro de una story no debe romper dependencias ni trazabilidad.

## Estados y dimensiones separadas

El lifecycle y los blockers son dimensiones separadas. No se usa `BLOCKED` como reemplazo del estado real.

### Release

Estados:

```text
DRAFT
PLANNED
ACTIVE
VERIFYING
RELEASED
CANCELLED
```

Finalizacion es metadata:

```yaml
finalization:
  completed: true
  completed_at: ...
  retrospective_status: APPROVED
```

### Story, Work Package y Task

Estados:

```text
TODO
READY
IN_PROGRESS
VERIFYING
DONE
CANCELLED
```

`SKIPPED` existe como resolucion, no como estado principal:

```yaml
resolution: SKIPPED
reason: ...
approved_by: ...
accepted_risk: ...
replacement:
  release_id: R0002
  work_item_id: S0015
```

Cada elemento declara:

```yaml
commitment: required | optional
```

Los elementos `required` no pueden omitirse sin waiver formal.

Blockers:

```yaml
status: IN_PROGRESS
blockers:
  - blocker_id: B0001
    status: OPEN
    severity: BLOCKING
    reason: Missing API contract
    created_at: ...
    resolved_at: null
```

Waivers:

```yaml
waivers:
  - waiver_id: W0001
    gate: security-review
    reason: ...
    approved_by: ...
    expires_at: ...
```

## Politicas de release

La secuencia lineal no debe estar hardcodeada. La configuracion define el modo:

```yaml
release_policy:
  mode: strict_sequence
  lanes:
    - main
    - hotfix
```

Modos permitidos inicialmente:

- `strict_sequence`: no liberar una release si hay una anterior abierta en la misma lane.
- `dependency_graph`: libera cuando sus dependencias declaradas estan satisfechas.
- `release_train`: agrupa releases por ventanas de entrega.
- `parallel`: permite releases independientes con gates explicitos.

La cancelacion exige razon, impacto y aprobacion humana. Una release cancelada conserva su ID y queda registrada en el journal.

## Protocolo determinista de mutacion

Toda mutacion debe seguir:

```text
inspect -> propose -> validate -> approve -> apply -> verify -> record
```

`dry-run` es solo una forma de presentar un `ChangeSet`; no es una transaccion. `apply` debe fallar si cambia la revision base.

Contrato minimo:

```json
{
  "schemaVersion": 1,
  "operationId": "OP-01J...",
  "operation": "story.atomize",
  "target": {
    "releaseId": "R0001",
    "storyId": "S0001",
    "workPackageId": "WP0001"
  },
  "baseRevision": "sha256:...",
  "idempotencyKey": "...",
  "assumptions": [],
  "preconditions": [],
  "fileChanges": [],
  "commands": [],
  "postconditions": [],
  "requiresApproval": true
}
```

Propiedades obligatorias:

- validable por JSON Schema;
- serializable;
- idempotente;
- auditable;
- reintentable;
- rechazable;
- aplicable sin volver a consultar al LLM;
- invalido cuando cambia `baseRevision`.

Cada aplicacion debe usar escrituras atomicas, optimistic locking, operation journal, validacion post-write y rollback tecnico cuando aplique.

## Seguridad de comandos

Los comandos no se guardan como strings de shell. Se guardan como estructura:

```yaml
command:
  executable: npm
  args:
    - run
    - test
  working_directory: web
  timeout_seconds: 120
  approval: required
```

El runtime debe protegerse contra command injection, path traversal, symlink escape, ejecucion fuera del workspace, comandos no aprobados, exposicion de secretos y uso indiscriminado de `git` o `gh`.

## Launcher estable

La interfaz interna recomendada no expone rutas como `.planning/scripts/release.mjs` ni rutas de instalacion del plugin. Las skills llaman un launcher estable:

```text
claude-planning <domain> <stage> [args] [--format json|markdown]
```

El launcher resuelve:

- instalacion del plugin;
- version;
- template pack;
- workspace actual;
- schemas;
- runtime;
- boundaries de paths;
- compatibilidad de schema.

## Responsabilidades deterministas

El runtime debe hacerse cargo de:

- asignar IDs estables sin colisiones;
- calcular revision del workspace;
- validar schemas;
- validar transiciones de estados;
- aplicar politicas de release/lane/dependencias;
- crear carpetas y archivos desde templates;
- actualizar YAML canonico;
- regenerar proyecciones Markdown;
- sincronizar estado agregado desde stories, work packages y tasks;
- validar links, dependencias, gates, evidencia y guide revisions;
- generar y refrescar indices por scope desde fuentes configuradas;
- generar esqueletos de work package, task y test suite desde guias aprobadas;
- producir comandos git/gh permitidos como estructuras, no shell libre;
- registrar eventos append-only en `events.ndjson`;
- bloquear cambios concurrentes con optimistic locking.

## Responsabilidades del agente AI

El agente queda limitado a:

- transformar intencion de negocio en stories/capabilities candidatas;
- proponer work packages por scope;
- dividir work packages en tasks tecnicas atomicas;
- sintetizar guias cuando las fuentes no permiten extraccion deterministica completa;
- completar secciones de diseno que requieren juicio;
- detectar riesgos y tradeoffs no triviales;
- implementar codigo;
- revisar evidencia y proponer correcciones;
- sintetizar decisiones y retrospectivas desde hechos capturados.

Cuando el agente produzca stories, work packages o tasks, debe entregar un bloque estructurado que el runtime valida y aplica como `ChangeSet`. El agente no debe editar manualmente estados, indices, rutas, dependencias o proyecciones derivables.

## Flujo feliz propuesto

```text
/plan-init
/plan-config scopes
/plan-config policies
/release new --title "Capability name" --target 2026-Q3-M1-W2 --date 2026-08-07
/plan-story add R0001 --title "Publish assessment"
/plan-story package add R0001 S0001 --scope api --title "Command contract and persistence"
/plan-story package add R0001 S0001 --scope web --title "Teacher publishing UI"
/plan-story atomize R0001 S0001 WP0001
/plan-story atomize R0001 S0001 WP0002
/plan-task inspect R0001 S0001 WP0001 T0001
/plan-task start R0001 S0001 WP0001 T0001
/plan-check readiness R0001
/plan-report status R0001
/release mark R0001 VERIFYING
/release mark R0001 RELEASED
/release finalize R0001
```

La forma exacta puede cambiar, pero el usuario debe sentir que navega release -> story/capability -> scope work package -> task, no una coleccion de utilidades ni una jerarquia de planificaciones paralelas.
