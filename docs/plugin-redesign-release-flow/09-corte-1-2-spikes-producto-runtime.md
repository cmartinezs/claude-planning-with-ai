# Corte -1.2: spikes de producto y runtime

## Objetivo

La tercera revision experta aprueba el dominio `release -> release item -> scope work package -> task`, pero no aprueba todavia el naming definitivo ni el runtime productivo. Este corte amplifica el Corte -1.1 con decisiones que solo pueden cerrarse mediante spikes tecnicos.

Regla:

```text
No iniciar el vertical slice productivo hasta cerrar los spikes de este corte.
```

## 1. Naming gate

`ARC Flow` y `arcflow` quedan como codename, no como marca aprobada.

Antes de modificar manifests, sitio, paquetes o binarios definitivos, validar:

- GitHub;
- npm;
- PyPI;
- crates.io;
- Homebrew;
- Chocolatey;
- dominios;
- marketplaces;
- buscadores;
- nombres de binarios instalables;
- marcas o productos relevantes.

Criterios:

- distintivo;
- corto;
- pronunciable;
- buscable;
- disponible;
- no atado exclusivamente a Claude;
- compatible con plugin y CLI;
- sin duplicacion incomoda con slash commands namespaced.

## 2. Namespace real de plugin

La API publica debe disenarse como composicion:

```text
plugin name + skill name
```

No asumir que una skill se vera como comando standalone. El host puede mostrar:

```text
/<product-name>:init
/<product-name>:config
/<product-name>:release
```

Por eso los nombres canonicos de skills deben ser cortos:

```text
skills/init/
skills/config/
skills/release/
skills/item/
skills/task/
skills/check/
skills/report/
skills/decision/
skills/update/
```

Un prefijo por acronimo, por ejemplo `/arc-init`, solo es fallback si el spike demuestra que el namespace del plugin no queda visible o no es usable.

## 3. Runtime prerequisite

Un bundle JavaScript self-contained elimina `npm install`, pero no elimina Node.js.

Decision requerida:

```text
Opcion A: bundle JavaScript + Node.js 20+ obligatorio
Opcion B: binarios nativos por plataforma
Opcion C: instalacion administrada del runtime
```

Si se elige Node obligatorio, el launcher debe hacer preflight:

- `node` disponible;
- version minima;
- permisos de ejecucion;
- ruta del plugin root;
- mensaje de instalacion claro;
- salida JSON para skills.

## 4. Paths canonicos

Los IDs primarios distribuidos no bastan si el filesystem usa solo `display_id`.

Prohibido como path canonico:

```text
R0001-slug/
RI0001-slug/
WP0001-slug/
T0001-slug/
```

Opciones permitidas:

```text
releases/<primary-id>/
items/<primary-id>/
work-packages/<primary-id>/
tasks/<primary-id>/
```

o path hibrido:

```text
RI0004-7H3K9-publish-assessment/
```

El `display_id` y el slug son para lectura humana y proyecciones. Las referencias internas usan `id`.

## 5. Merge protocol

Evitar listas de hijos en padres como fuente canonica.

Preferir:

```yaml
# release-item.yml
release_id: 01J-RELEASE
```

En vez de:

```yaml
# release.yml
items:
  - 01J-ITEM-A
  - 01J-ITEM-B
```

Los indices de hijos son proyecciones regenerables. Operaciones que modifican padres requieren single writer, lock de agregado, reconciliacion explicita o nueva propuesta despues del merge.

## 6. Limite del ChangeSet

El ChangeSet controla obligatoriamente el control plane:

```text
.planning/**
policies
operations
events
approvals
state transitions
canonical metadata
```

El work product se registra como evidencia:

```text
src/**
tests/**
infra/**
product docs
configuration
```

El runtime no debe convertirse en editor universal de codigo. Puede generar templates, skeletons, documentacion o configuracion solo mediante operaciones explicitas y limitadas.

Ejemplo de evidencia:

```yaml
work_product:
  git_diff_hash: sha256:...
  commit_sha: ...
  changed_paths:
    - src/...
  verification_refs:
    - test-run:...
```

## 7. DSL de guias

YAML no basta si contiene lenguaje natural como regla ejecutable.

Las guias deben usar una DSL cerrada para:

- applicability;
- required sections;
- ordering;
- dependency;
- gate selection;
- evidence requirements;
- command selection;
- environment selection.

Operadores permitidos iniciales:

```text
equals
not_equals
contains
exists
all
any
not
in
matches
```

Ejemplo:

```yaml
applies_when:
  all:
    - field: item.kind
      op: in
      value:
        - user_story
        - capability
    - field: item.tags
      op: contains
      value: ui

ordering:
  - predecessor_type: contract-check
    successor_type: real-api-connection
```

La narrativa puede vivir en `description`, pero no controla automatizacion.

## 8. Catalogos canonicos

Agregar storage canonico para conceptos transversales:

```text
.planning/
  concerns/
    security.yml
    accessibility.yml
  gates/
    unit-tests.yml
    threat-model.yml
    accessibility-review.yml
  gate-profiles/
    security-default.yml
    frontend-default.yml
  environments/
    local.yml
    beta.yml
    demo.yml
    production.yml
```

IDs de catalogo usan claves humanas validadas:

```text
web
unit-tests
security
deploy-beta
```

Entidades runtime usan IDs distribuidos:

```text
release
release item
work package
task
event
operation
```

## 9. Hashing canonico

Definir pipeline unico:

```text
YAML 1.2 seguro
-> objeto validado
-> eliminar campos no semanticos
-> canonical JSON
-> UTF-8
-> SHA-256
```

Rechazar:

- claves duplicadas;
- custom tags;
- aliases peligrosos;
- anchors no permitidos;
- valores ambiguos;
- tipos implicitos de YAML 1.1.

Distinguir:

```text
content_revision
source_fingerprint
template_fingerprint
operation_hash
change_set_hash
render_hash
```

`revision` no puede incluir su propio campo `revision` en el hash.

## 10. Eventos, operaciones y retencion

Decision inicial:

```text
YAML/JSON de agregados = estado canonico
eventos = auditoria inmutable
```

No implementar event sourcing completo en la primera version.

Storage operativo:

```text
.planning/events/              # auditoria versionable
.planning/operations/          # manifests resumidos, versionable segun policy
.planning/.runtime/            # staging, before, logs; gitignored
.planning/vendor/              # snapshots segun lock
```

Politica ejemplo:

```yaml
runtime:
  operation_retention_days: 7
  retain_failed_operations: true
  retain_before_snapshots: false
  event_retention: permanent
```

Debe existir mantenimiento para archive, purge y report sin romper locks ni evidencia requerida.

## 11. Reportes y renders

`check` es query-only.

`report` puede escribir solo si usa una operacion:

```text
<product-cli> report render propose
<product-cli> changeset apply OP-...
```

Status, readiness, release notes y traceability pueden salir a stdout sin mutar.

## 12. Trust model

La aprobacion no es una frontera criptografica si el agente puede ejecutar el launcher.

Declaracion requerida:

```text
El sistema provee guardrails, trazabilidad y human-in-the-loop cooperativo. No es una sandbox frente a un agente malicioso con acceso equivalente al usuario.
```

Refuerzos:

- confirmacion explicita;
- actor y sesion;
- texto de aprobacion;
- policy que prohiba autoapproval;
- challenge interactivo;
- hooks;
- deteccion de drift;
- permisos de filesystem cuando sea posible;
- auditoria de llamadas.

## 13. Spikes obligatorios

### Spike 1: plugin real

Validar manifest, skill namespaced, launcher, runtime, plugin root, PATH, Node ausente, binario colisionado, actualizacion, Windows/WSL2/Linux.

### Spike 2: dos worktrees

Crear simultaneamente Release Items, Work Packages, eventos y cambios sobre una misma release; fusionar branches y regenerar indices.

### Spike 3: crash recovery

Fallar despues de staging, primer write, canonical state, antes del evento y despues de comando externo. Validar rollback, compensacion, retry, idempotencia y limpieza.

### Spike 4: canonical hashes

Dos YAML equivalentes deben producir el mismo hash pese a orden, indentacion, line endings, comentarios y estilos de string.

### Spike 5: guia ejecutable

Atomizar un Work Package sin interpretar lenguaje natural, invocar LLM ni leer Markdown.

## Criterio de salida

El Corte -1.2 se cierra solo si los cinco spikes producen:

- decisiones explicitas;
- contratos verificables;
- fixtures;
- pruebas automatizadas;
- documentacion actualizada;
- decision final de nombre/producto/versionado.
