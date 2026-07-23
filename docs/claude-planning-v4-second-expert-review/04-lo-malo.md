# Lo malo

## 1. Dos fuentes de verdad para scopes

`config.yml` contiene una lista completa de scopes con:

- paths;
- documentación;
- guides;
- generators;
- validation.

Al mismo tiempo existe:

```text
.planning/scopes/<scope-id>/scope.yml
```

como entidad canónica.

Esto crea duplicación.

### Corrección

`config.yml` debería contener únicamente referencias:

```yaml
scope_catalog:
  directory: .planning/scopes
  enabled:
    - web
    - api
    - legal
```

La definición completa debe vivir en:

```text
.planning/scopes/<scope-id>/scope.yml
```

## 2. Guías Markdown como reglas ejecutables

El principio dice:

> YAML o JSON es la fuente de verdad.

Sin embargo, `task-guide.md` y `test-guide.md` contienen reglas usadas para:

- crear Work Packages;
- atomizar tasks;
- seleccionar gates;
- generar tests;
- decidir readiness.

Esto obliga al runtime a interpretar Markdown.

### Corrección

```text
.planning/scopes/web/
  scope.yml
  task-guide.yml
  test-guide.yml
  task-guide.md
  test-guide.md
```

Los `.yml` contienen reglas ejecutables.

Los `.md` contienen explicación humana.

Ejemplo:

```yaml
work_package_types:
  - id: api-feature
    required_sections:
      - contracts
      - persistence
      - error_handling
    required_gates:
      - unit-tests
      - acceptance-tests
      - smoke-test
```

## 3. Ambigüedad `Story/Capability`

La documentación utiliza:

```text
Story/Capability
User Story or Capability
```

sin definir una entidad canónica.

Una release puede contener:

- user stories;
- defects;
- spikes;
- enablers;
- refactors;
- compliance;
- migrations;
- operational work.

### Recomendación

Definir una entidad general:

```text
Release Item
```

o una Story tipada:

```yaml
type: user_story | capability | defect | enabler | spike | compliance
```

Campos condicionales:

- `user_story`: actor, need, value;
- `defect`: observed behavior, expected behavior;
- `enabler`: technical outcome;
- `spike`: question, timebox, decision output;
- `compliance`: obligation, authority, evidence.

## 4. Scopes superpuestos

Los scopes pueden representar:

- servicio;
- repositorio;
- equipo;
- disciplina;
- módulo;
- proceso.

Esto produce solapamientos.

Ejemplo:

```text
web
design-system
security
accessibility
```

### Recomendación

Separar:

```text
Delivery Scope
Cross-cutting Concern
Gate Profile
```

Agregar políticas:

```yaml
paths:
  overlap_policy: reject | allow | explicit

scope_dependencies:
  - from: web
    to: design-system
```

## 5. Metadata de guías demasiado agregada

`scope.yml` contiene un único bloque de provenance para task guide y test guide.

Pero ambas guías pueden usar:

- fuentes diferentes;
- modelos diferentes;
- prompts diferentes;
- fechas diferentes;
- aprobadores diferentes.

### Corrección

```yaml
guides:
  task:
    status: approved
    revision: sha256:...
    provenance: ...
  test:
    status: approved
    revision: sha256:...
    provenance: ...
```

## 6. Revisión de guía fijada solo en release

La revisión utilizada debería registrarse en cada Work Package:

```yaml
guide_refs:
  task:
    revision: sha256:...
  test:
    revision: sha256:...
```

La release puede mantener un índice agregado, pero no ser la única referencia.

## 7. Estados derivados y lifecycle mezclados

El runtime plantea sincronizar estado agregado.

Debe distinguirse:

```yaml
status: ACTIVE

completion:
  required_work_packages: 8
  completed_work_packages: 7

readiness:
  releasable: false
```

No se debe cambiar automáticamente el lifecycle por una condición calculada.
