# Estructura completa del plugin v4

## Objetivo

Este documento define la estructura total nueva del repositorio del plugin v4: skills, runtime, template pack, schemas, metadata, documentacion publica, sitio web y outputs generados. Complementa la arquitectura de dominio; aqui la pregunta es donde vive cada cosa y que responsabilidades tiene.

Regla base:

```text
repo del plugin = fuente instalable, runtime, docs y site
workspace usuario = .planning/ con estado canonico y proyecciones generadas
```

El repo del plugin no debe confundirse con el `.planning/` que se crea dentro de proyectos usuarios.

## Arbol objetivo del repo

```text
.
+-- .claude-plugin/
|   +-- plugin.json
|   +-- marketplace.json
|
+-- .github/
|   +-- workflows/
|       +-- deploy-pages.yml
|
+-- .page/
|   +-- components/
|   +-- context/
|   +-- data/
|   +-- hooks/
|   +-- locales/
|   +-- pages/
|   +-- scripts/
|   |   +-- verify.js
|   +-- styles/
|   +-- types/
|   +-- next.config.js
|   +-- package.json
|   +-- package-lock.json
|   +-- tailwind.config.ts
|   +-- tsconfig.json
|
+-- docs/
|   +-- commands.yml
|   +-- reference.md
|   +-- user-guide.md
|   +-- developer-guide.md
|   +-- training-mode-plan.md
|   +-- plugin-redesign-release-flow/
|   +-- plugin-review/
|   +-- claude-planning-v4-expert-review/
|   +-- design-history/
|
+-- runtime/
|   +-- bin/
|   |   +-- claude-planning.mjs
|   +-- commands/
|   |   +-- planning-init.mjs
|   |   +-- planning-config.mjs
|   |   +-- release.mjs
|   |   +-- planning-story.mjs
|   |   +-- planning-task.mjs
|   |   +-- planning-check.mjs
|   |   +-- planning-report.mjs
|   |   +-- planning-decision.mjs
|   |   +-- update-version.mjs
|   +-- lib/
|   +-- schemas/
|   |   +-- config.schema.json
|   |   +-- plugin-lock.schema.json
|   |   +-- scope.schema.json
|   |   +-- guide-metadata.schema.json
|   |   +-- release.schema.json
|   |   +-- story.schema.json
|   |   +-- work-package.schema.json
|   |   +-- task.schema.json
|   |   +-- change-set.schema.json
|   |   +-- event.schema.json
|   |
|   +-- fixtures/
|       +-- monorepo-software/
|       +-- simple-repo/
|       +-- non-code-scopes/
|
+-- template-pack/
|   +-- template-pack.yml
|   +-- templates/
|   |   +-- config.yml
|   |   +-- plugin.lock.yml
|   |   +-- scope.yml
|   |   +-- task-guide.md
|   |   +-- test-guide.md
|   |   +-- release.yml
|   |   +-- release-readme.md
|   |   +-- story.yml
|   |   +-- story-readme.md
|   |   +-- work-package.yml
|   |   +-- work-package-readme.md
|   |   +-- task.yml
|   |   +-- task-readme.md
|   |   +-- TRACEABILITY.md
|   |   +-- RELEASE-NOTES.md
|   |   +-- RETROSPECTIVE.md
|   |
|   +-- docs/
|   |   +-- TUTORIAL/
|   |   +-- WORKFLOWS/
|   |   +-- GLOSSARY.md
|   |   +-- GUIDE.md
|   |   +-- README.md
|   |   +-- LOGGING.md
|   |   +-- PROMPTING.md
|   |   +-- SMOKE-TESTS.md
|   +-- update-version/
|
+-- scripts/
|   +-- verify-plugin.sh
|
+-- skills/
|   +-- plan-init/
|   +-- plan-config/
|   +-- release/
|   +-- plan-story/
|   +-- plan-task/
|   +-- plan-check/
|   +-- plan-report/
|   +-- plan-decision/
|   +-- plan-update-version/
|
+-- README.md
+-- CHANGELOG.md
+-- CONTRIBUTING.md
+-- AGENTS.md
```

`planning-template/` completo queda como estructura legacy de v3. En v4 se reemplaza por `runtime/` y `template-pack/`. No existen `planning-template/active/`, `planning-template/finished/`, `planning-template/_template/00-initial.md`, `01-expansion.md` ni `02-deepening/` como contrato v4.

## Separacion de runtime, templates y tooling

La separacion nueva es deliberada:

| Ruta | Tipo | Responsabilidad |
|------|------|-----------------|
| `runtime/` | Codigo del producto plugin | Launcher, use cases, librerias, schemas, fixtures y ejecucion deterministica. |
| `template-pack/` | Artefactos renderizables | Templates, docs de template pack y migraciones de template pack. No contiene scripts de dominio. |
| `scripts/` | Tooling del repo | Verificacion, mantenimiento y tareas de publicacion del repositorio del plugin. No se distribuye como runtime publico. |
| `.page/scripts/` | Tooling del sitio | Validadores/build helpers del sitio web. No pertenece al plugin runtime. |
| `skills/` | API conversacional | Wrappers delgados que llaman al launcher y acotan juicio/aprobacion. |

Por tanto, `scripts/` dentro de `planning-template/` era una herencia v3, no una decision correcta para v4. El redisenio nuevo lo reemplaza por `runtime/commands/` y `runtime/lib/`.

## Metadata del plugin

`.claude-plugin/` contiene solo metadata de distribucion:

| Archivo | Responsabilidad v4 |
|---------|--------------------|
| `plugin.json` | Nombre, version, descripcion corta, autor y metadata requerida por Claude Code. Debe describir el runtime release/story/work-package/task, no el flujo v3 Markdown-first. |
| `marketplace.json` | Texto publico, comandos expuestos, enlaces, tags y metadata de marketplace. No debe listar comandos legacy. |

Reglas:

- La version debe coincidir con `CHANGELOG.md`, README badge, site package y update-version.
- La descripcion debe mencionar `plan-init`, `plan-config`, release, stories/capabilities, work packages, tasks, ChangeSets y estado canonico.
- No debe prometer compatibilidad con comandos v3.

## Skills

`skills/` expone la API conversacional. Cada carpeta contiene un `SKILL.md` delgado.

Skills base:

```text
skills/plan-init/
skills/plan-config/
skills/release/
skills/plan-story/
skills/plan-task/
skills/plan-check/
skills/plan-report/
skills/plan-decision/
```

Skill de mantenimiento:

```text
skills/plan-update-version/
```

Skills avanzadas solo si se justifican despues del vertical slice:

```text
skills/plan-run/
skills/plan-recover/
skills/plan-backlog/
```

Contrato de cada `SKILL.md`:

- proposito;
- argumentos publicos;
- precondiciones;
- llamada al launcher `claude-planning <domain> <stage>`;
- donde entra juicio del agente;
- cuando pedir aprobacion humana;
- criterios de stop.

No debe contener parseo Markdown, asignacion de IDs, logica de transiciones, pasos Git repetidos, tablas grandes duplicadas ni reglas ya definidas por schemas/runtime/templates.

## Runtime y scripts

`runtime/` contiene el codigo ejecutable distribuido con el plugin. No vive dentro del template pack porque no es plantilla: es runtime.

La entrada estable es:

```text
runtime/bin/claude-planning.mjs
```

Las skills deben invocar el launcher conceptual:

```text
claude-planning <domain> <stage> [args] [--format json|markdown]
```

El launcher resuelve internamente rutas de instalacion, template pack, schemas y workspace actual. El usuario no debe necesitar conocer rutas internas como `runtime/commands/release.mjs`.

Scripts de dominio:

| Script | Responsabilidad |
|--------|-----------------|
| `planning-init.mjs` | Bootstrap del workspace, config inicial, plugin lock y estructura base. |
| `planning-config.mjs` | Scopes, fuentes, policies, comandos, autonomia, guias y generadores. |
| `release.mjs` | Release aggregate, lifecycle, readiness, deployment events y finalization. |
| `planning-story.mjs` | Stories/capabilities, criterios funcionales, work packages y atomizacion. |
| `planning-task.mjs` | Inspect, start, verify, correction y closeout de tasks. |
| `planning-check.mjs` | Schemas, invariantes, guide freshness, gates, readiness y evidencia. |
| `planning-report.mjs` | Status, standup, history, traceability, release notes, docs y exports. |
| `planning-decision.mjs` | Decision records, aceptacion/rechazo, waivers y enlaces. |
| `update-version.mjs` | Migraciones futuras v4+ y actualizacion del template pack. |

`runtime/lib/` contiene librerias compartidas:

```text
schema.mjs
identity.mjs
revision.mjs
paths.mjs
command-policy.mjs
event-journal.mjs
change-set.mjs
atomic-write.mjs
project-store.mjs
scope-store.mjs
release-store.mjs
story-store.mjs
work-package-store.mjs
task-store.mjs
guide-store.mjs
render.mjs
```

Reglas:

- Todas las mutaciones pasan por ChangeSet.
- `apply` falla si `baseRevision` esta obsoleta.
- Los comandos ejecutables se guardan como `executable + args + working_directory + timeout + approval`.
- Las escrituras son atomicas y confinadas al workspace actual.
- Cada operacion relevante registra evento en `events.ndjson`.

## Schemas

`runtime/schemas/` es el contrato estructurado del runtime. Los schemas validan estado y operaciones; por eso pertenecen al runtime, no al template pack.

| Schema | Entidad |
|--------|---------|
| `config.schema.json` | Project context, policies, commands, scopes y autonomia. |
| `plugin-lock.schema.json` | Version del plugin, schema y template pack fingerprint. |
| `scope.schema.json` | Scope catalog, kind, ownership, paths, guide revisions y provenance. |
| `guide-metadata.schema.json` | Estado de guia, source fingerprints, generator y aprobacion. |
| `release.schema.json` | Release aggregate, lifecycle, lane, stories, gates, deployment events y finalization. |
| `story.schema.json` | Story/capability funcional. |
| `work-package.schema.json` | Trabajo tecnico por scope y gates propios. |
| `task.schema.json` | Cambio atomico, evidencia y closeout. |
| `change-set.schema.json` | Operacion propuesta/aplicable con `baseRevision` e idempotencia. |
| `event.schema.json` | Evento append-only para `events.ndjson`. |

Los schemas se versionan con el plugin y se referencian desde `plugin.lock.yml` junto al template pack compatible.

## Templates

`template-pack/templates/` contiene renderers o plantillas canonicas para crear estado y proyecciones. Aqui no debe haber scripts ejecutables de dominio.

Plantillas de estado canonico:

```text
config.yml
plugin.lock.yml
scope.yml
release.yml
story.yml
work-package.yml
task.yml
```

Plantillas de proyeccion humana:

```text
release-readme.md
story-readme.md
work-package-readme.md
task-readme.md
TRACEABILITY.md
RELEASE-NOTES.md
RETROSPECTIVE.md
task-guide.md
test-guide.md
```

Reglas:

- El workspace usuario no recibe una copia completa de `template-pack/`.
- `/plan-init` crea estado inicial y lock; las plantillas se leen desde la instalacion del plugin.
- Markdown generado debe poder regenerarse desde YAML/JSON canonico.
- Si un usuario edita Markdown generado, `/plan-check docs` debe detectar drift o regenerarlo segun politica.

## Fixtures y pruebas de arquitectura

`runtime/fixtures/` contiene proyectos minimos para validar el runtime:

| Fixture | Cubre |
|---------|-------|
| `monorepo-software/` | Multiples scopes de codigo, worktrees, comandos por paquete, dependencias y gates. |
| `simple-repo/` | Proyecto pequeno con una release, una story, un work package y tasks. |
| `non-code-scopes/` | Scopes `documentation`, `process` o `compliance` sin build/test de software. |

`scripts/verify-plugin.sh` debe validar:

- comandos v4 presentes y comandos v3 ausentes;
- schemas presentes;
- fixtures validos;
- ChangeSets idempotentes;
- rechazo por `baseRevision` obsoleta;
- ausencia de storage v3;
- referencias publicas alineadas en docs y site;
- version markers alineados.

## Documentacion del repo

`docs/` contiene documentacion fuente del plugin, no estado de usuario.

| Ruta | Responsabilidad v4 |
|------|--------------------|
| `docs/commands.yml` | Inventario canonico de comandos v4. Fuente para reference/site cuando sea posible. |
| `docs/reference.md` | Referencia publica de comandos, argumentos y stages. |
| `docs/user-guide.md` | Guia de uso para usuarios del plugin. |
| `docs/developer-guide.md` | Guia para mantener runtime, schemas, launcher, templates y validators. |
| `docs/training-mode-plan.md` | Training/demo actualizado al flujo v4 si se conserva. |
| `docs/plugin-redesign-release-flow/` | Decision de arquitectura del redisenio v4. |
| `docs/plugin-review/` | Revisiones historicas y hallazgos que alimentan el redisenio. |
| `docs/claude-planning-v4-expert-review/` | Review externo de la propuesta v4. |
| `docs/design-history/` | Material archivado; no debe ser fuente publica principal. |

Reglas:

- `docs/commands.yml` debe listar solo comandos activos v4 y comandos avanzados cuando existan.
- `docs/reference.md`, README y site no deben contener tabla de comandos similares legacy.
- La documentacion publica debe explicar primero `plan-init -> plan-config -> release -> story/capability -> work package -> task -> check/report`.
- Los docs de redesign pueden mencionar v3 como diagnostico, pero los docs publicos no deben ensenarlo como flujo vigente.

## Sitio web

`.page/` es el sitio Next.js/Tailwind del plugin.

Fuente editable:

```text
.page/components/
.page/context/
.page/data/
.page/hooks/
.page/locales/
.page/pages/
.page/scripts/verify.js
.page/styles/
.page/types/
.page/package.json
.page/package-lock.json
```

Outputs generados, no editar:

```text
.page/.next/
.page/out/
.page/node_modules/
```

Responsabilidades v4 del sitio:

- Home: explicar el flujo `plan-init -> plan-config -> release -> story/capability -> work package -> task -> ChangeSet -> check/report -> release/deployment -> finalize`.
- Commands: mostrar solo comandos v4 y separar `plan-update-version` como mantenimiento.
- Tutorials: usar IDs `R0001`, `S0001`, `WP0001`, `T0001` y storage `.planning/scopes/` + `.planning/releases/`.
- Training: no ensenar `plan-new`, `plan-expand`, `active/finished`, `.releases/` ni historias hermanas por scope.
- Locales: actualizar `en` y `es` juntos.
- Verify: `.page/scripts/verify.js` debe fallar ante comandos legacy, storage v3 o copy antiguo.

Validacion:

```text
cd .page
npm run build
```

## Workspace generado en proyectos usuarios

El plugin v4 crea esta estructura en el proyecto del usuario:

```text
.planning/
  config.yml
  plugin.lock.yml
  events.ndjson

  scopes/
    <scope-id>/
      scope.yml
      task-guide.md
      test-guide.md

  decisions/
    DEC-0001-slug.md

  releases/
    R0001-slug/
      release.yml
      README.md
      stories/
        S0001-slug/
          story.yml
          README.md
          work-packages/
            WP0001-scope-slug/
              work-package.yml
              tasks/
                T0001-slug/
                  task.yml
                  README.md
      TRACEABILITY.md
      RELEASE-NOTES.md
      RETROSPECTIVE.md
```

No se genera:

```text
.planning/active/
.planning/finished/
.releases/
.planning/scripts/
```

El runtime vive en el plugin; el workspace guarda estado, lock, eventos, scopes, releases y proyecciones.

## Publicacion y versionado

Antes de publicar v4:

- `.claude-plugin/plugin.json` y `marketplace.json` describen solo v4.
- `README.md`, `docs/commands.yml`, `docs/reference.md`, `docs/user-guide.md` y site estan alineados.
- `runtime/`, `runtime/schemas/`, `template-pack/template-pack.yml` y `template-pack/templates/` tienen versiones compatibles.
- `CHANGELOG.md` declara ruptura, comandos removidos, storage nuevo y ausencia de aliases.
- `template-pack/update-version/<N>-<N+1>.md` explica el corte limpio y futuras migraciones v4+.
- `scripts/verify-plugin.sh`, `.page/scripts/verify.js` y `npm run build` pasan.

## Criterio de consistencia

Una capacidad esta correctamente ubicada cuando:

- skill: solo orquesta conversacion y launcher;
- script: ejecuta use case determinista;
- lib: encapsula contrato tecnico reutilizable;
- schema: define estado valido;
- template: renderiza estado o proyeccion;
- doc: explica el contrato;
- site: presenta el flujo publico;
- metadata: publica version y comandos;
- workspace usuario: guarda estado canonico y evidencia.

Si una regla aparece duplicada en skill, script, template, doc y site, debe moverse al lugar canonico y el resto debe referenciarla.
