# Corte -1.1: contratos residuales del runtime

## Objetivo

La segunda revision experta aprueba la arquitectura para avanzar al Corte -1, pero identifica contradicciones que deben cerrarse antes de escribir runtime productivo. Este documento convierte esas observaciones en contrato de diseno. La tercera revision no invalida este corte, pero lo extiende con spikes obligatorios en [Corte -1.2](09-corte-1-2-spikes-producto-runtime.md).

Regla:

```text
No implementar runtime productivo hasta cerrar este Corte -1.1.
```

## 1. Fuente unica de scopes

`config.yml` no contiene la definicion completa de scopes. Solo referencia el catalogo:

```yaml
scope_catalog:
  directory: .planning/scopes
  enabled:
    - web
    - api
    - legal
```

La fuente canonica vive en:

```text
.planning/scopes/<scope-id>/scope.yml
```

`scope.yml` contiene `id`, `display_id`, `label`, `kind`, ownership, paths, non-code justification, sources, dependencies, concerns, guide refs y validation profiles.

## 2. Guias estructuradas

Markdown no puede ser regla ejecutable. Cada scope tiene guias estructuradas y proyecciones humanas:

```text
.planning/scopes/web/
  scope.yml
  task-guide.yml
  test-guide.yml
  task-guide.md
  test-guide.md
```

Los `.yml` contienen:

- tipos de Work Package;
- tipos de Task;
- gates;
- required sections;
- decomposition rules estructuradas;
- test matrix;
- command references;
- evidence requirements;
- provenance por guia.

Los `.md` explican la guia para humanos y agentes, pero el runtime no los interpreta como base de datos.

## 3. Release Item tipado

La entidad canonica dentro de una release es `Release Item`. `Story/Capability` queda como lenguaje de producto, no como unico tipo de entidad.

```yaml
kind: user_story | capability | defect | enabler | spike | compliance | migration | operational
```

Campos condicionales:

| Kind | Campos requeridos |
|------|-------------------|
| `user_story` | actor, need, value, acceptance_criteria |
| `capability` | outcome, behavior, acceptance_criteria |
| `defect` | observed_behavior, expected_behavior, reproduction, severity |
| `enabler` | technical_outcome, unlocked_capabilities |
| `spike` | question, timebox, expected_decision |
| `compliance` | obligation, authority, deadline, evidence |
| `migration` | source_state, target_state, rollback |
| `operational` | procedure, owner, evidence |

`release-item.yml` reemplaza a un `story.yml` demasiado ambiguo. El termino `story` puede mantenerse como alias conversacional para `kind: user_story`, pero no como schema unico.

## 4. Scopes, concerns y gate profiles

Un scope representa una unidad de delivery/ownership. No debe absorber todos los conceptos transversales.

Separar:

```text
Delivery Scope
Cross-cutting Concern
Gate Profile
```

Ejemplo:

```yaml
paths:
  overlap_policy: reject | allow | explicit

scope_dependencies:
  - from: web
    to: design-system

concerns:
  - id: security
    applies_to:
      - web
      - api

gate_profiles:
  - id: security-default
    gates:
      - threat-model
      - dependency-audit
```

Los scopes pueden solaparse solo cuando `overlap_policy` lo permite y la dependencia queda declarada.

## 5. Identidad distribuida

Los IDs secuenciales no son claves primarias. La identidad primaria debe ser distribuida:

```yaml
id: 01J4F0Z9M...
display_id: T0042
slug: validate-schema
```

Reglas:

- `id` es la clave primaria y se usa en referencias internas.
- `display_id` es etiqueta humana y puede asignarse al crear, integrar o renderizar.
- `slug` es decorativo.
- ULID, UUIDv7 u otro formato distribuido evitan colisiones entre worktrees y agentes.

## 6. Revisiones por agregado

Un `baseRevision` global invalida operaciones por cambios no relacionados. El ChangeSet debe declarar revisiones por agregado leido:

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

Una operacion falla solo si cambia un agregado que la operacion leyo o muta.

## 7. Event journal por archivos inmutables

`events.ndjson` no es storage primario. Es proyeccion/export.

Storage primario:

```text
.planning/events/
  2026/
    07/
      01J4E-release-created.json
      01J4F-task-started.json
```

Cada evento declara `event_id`, `type`, aggregate, timestamp UTC, actor, operation_id, idempotency_key, payload, input_hash y output_hash. El orden se deriva de ULID/timestamp/causal references, no del orden de lineas.

## 8. Operaciones multiarchivo

Cada operacion usa directorios propios. El manifest resumido puede versionarse:

```text
.planning/operations/<operation-id>/
  operation.yml
  change-set.json
  result.json
```

Los archivos de staging, snapshots `before/` y logs viven en runtime storage no versionado por defecto:

```text
.planning/.runtime/operations/<operation-id>/
  before/
  staged/
  logs/
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

La operacion debe:

1. cargar revisiones por agregado;
2. validar schemas;
3. validar boundaries;
4. construir staging;
5. comprobar postcondiciones simuladas;
6. bloquear agregados afectados cuando comparten filesystem;
7. aplicar estado canonico;
8. verificar;
9. registrar eventos;
10. regenerar proyecciones.

## 9. Comandos externos como saga

Git, GitHub, deployments, test environments y APIs externas no son atomicamente reversibles.

Se modelan como saga:

```text
prepare -> execute -> verify -> compensate
```

El ChangeSet debe declarar rollback tecnico, compensacion logica o rollback imposible.

## 10. Approval binding

La aprobacion se vincula al hash del ChangeSet:

```yaml
approval:
  actor: ...
  change_set_hash: sha256:...
  approved_at: ...
```

Modificar el ChangeSet invalida la aprobacion.

## 11. CQS para checks y reportes

`check` no muta. Solo valida, reporta y recomienda operaciones:

```json
{
  "valid": false,
  "findings": [],
  "recommendedOperations": []
}
```

La generacion vive en `item atomize`, `task prepare` o `config guide refresh`.

`report` puede emitir stdout sin mutar. Si escribe proyecciones Markdown, debe hacerlo via `report render propose` y ChangeSet.

## 12. Vocabulario unico de mutacion

No mezclar `dry-run/write` con ChangeSets como modelo mental.

CLI conceptual:

```text
<product-cli> workspace init propose
<product-cli> changeset validate OP-...
<product-cli> changeset approve OP-...
<product-cli> changeset apply OP-...
<product-cli> changeset verify OP-...
```

Los comandos publicos pueden ocultar parte de esta mecanica, pero el runtime conserva el contrato `propose/validate/approve/apply/verify`.

## 13. Launcher y bundle

El ejecutable publico vive en la raiz. El nombre exacto queda pendiente del naming gate:

```text
bin/
  <product-cli>
```

El runtime compilado vive en:

```text
runtime/
  src/
  dist/
    <product-cli>.mjs
  package.json
  package-lock.json
  build.mjs
```

El bundle debe ser self-contained. No se asume `npm install` en el workspace usuario.

Debe incluir parser YAML, JSON Schema validator, parser de argumentos, hashing, globbing, locks y renderers.

Esto no elimina la dependencia del runtime de ejecucion. Corte -1.2 debe decidir entre Node.js 20+ obligatorio, binarios nativos o instalacion administrada.

## 14. Template pack historico

`plugin.lock.yml` debe permitir reproducibilidad historica. Un fingerprint solo no basta si el template desaparece.

Estrategia recomendada:

```text
.planning/vendor/template-packs/<fingerprint>/
```

Guardar solo templates realmente utilizados por el workspace. El runtime puede validar con el pack instalado actual, pero debe poder regenerar o auditar artefactos historicos con el snapshot vendor cuando el lock lo requiera.

## 15. Schemas faltantes

Crear schemas propios o `$defs` reutilizables:

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
release-item.schema.json
operation.schema.json
```

`deployment-event.schema.json` debe cubrir al menos:

```yaml
environment: beta | demo | production | custom
artifact_version: ...
commit_sha: ...
started_at: ...
completed_at: ...
result: succeeded | failed | rolled_back
verification: ...
rollback: ...
```

## Criterio de salida del Corte -1.1

El runtime puede comenzar cuando:

- no existan fuentes duplicadas;
- todos los estados operativos tengan schema;
- la identidad sea segura en worktrees;
- la atomicidad multiarchivo este definida;
- el launcher funcione instalado desde `bin/`;
- las dependencias esten empaquetadas;
- el journal no cause conflictos sistematicos;
- el template pack pueda resolverse de forma reproducible;
- `check` sea query-only;
- el vocabulario `propose/apply/verify` sea el unico contrato de mutacion.
