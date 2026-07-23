# Eliminacion legacy

## Objetivo

v4 parte en limpio. La eliminacion legacy no es una migracion silenciosa ni una capa de compatibilidad: es la remocion deliberada de comandos, storage, templates y documentacion que sostienen el modelo v3.

## Regla principal

No se mantienen aliases. Si un comando v3 no coincide con la superficie v4, se borra del plugin. Si una capacidad sigue siendo necesaria, se reimplementa en el comando gestor v4 correspondiente.

## Superficie v4 permitida

Comandos publicos base:

```text
/plan-init
/release
/plan-story
/plan-task
/plan-check
/plan-report
/plan-decision
/plan-update-version
```

Comandos avanzados solo si se justifican:

```text
/plan-run
/plan-recover
/plan-backlog
```

Todo lo demas debe borrarse o quedar fuera del plugin v4.

## Alcance completo

La eliminacion legacy cubre todo el plugin:

```text
.claude-plugin/        # manifests y marketplace metadata
.page/                 # landing site, comandos, tutoriales, textos y build
.github/workflows/     # deploy/publicacion del site si referencia outputs o comandos
docs/                  # user/developer/reference/commands docs
planning-template/     # template pack distribuido con el plugin
planning-template/scripts/
planning-template/update-version/
scripts/               # tooling de repo, verify, migraciones internas
skills/                # comandos expuestos al usuario
README.md
CHANGELOG.md
CONTRIBUTING.md
CLAUDE.md
AGENTS.md
```

No basta con borrar carpetas de `skills/`. Una capacidad legacy esta viva si sigue apareciendo en docs, site, config, tutoriales, templates, scripts, verificadores, changelog o metadata de publicacion.

## Comandos a eliminar

Carpetas `skills/` a borrar salvo que se reimplementen con nombre v4:

```text
skills/release-init/
skills/release-new/
skills/release-add/
skills/release-remove/
skills/release-status/

skills/plan-new/
skills/plan-expand/
skills/plan-from-epic/
skills/plan-from-release/
skills/plan-template/

skills/us-new/
skills/us-enrich/
skills/us-split/
skills/us-status/
skills/epic-enrich/

skills/doc-generate/
skills/doc-story/
skills/doc-task/

skills/plan-health/
skills/plan-validate/
skills/plan-task-validate/
skills/plan-audit-docs/
skills/plan-doctor/
skills/plan-status/
skills/plan-standup/
skills/plan-history/
skills/plan-export/

skills/plan-enrich-epic/
skills/plan-enrich-story/
skills/plan-split-story/
skills/plan-merge/
skills/plan-story-skip/

skills/plan-agent-plan/
skills/plan-agent-execute/
skills/plan-agent-validate/

skills/plan-retry/
skills/plan-rollback/
skills/plan-clone/
skills/plan-smoke-config/
skills/plan-git-config/
skills/plan-test-suite/
skills/plan-edge-case/
skills/plan-retrospective/
```

Revisar manualmente antes de borrar:

```text
skills/plan-run/
skills/plan-recover/      # nuevo si se decide conservar recovery
skills/plan-backlog/      # nuevo si se decide conservar backlog externo
```

## Storage a eliminar

No deben existir como contrato v4:

```text
.planning/active/
.planning/finished/
.releases/
```

El storage v4 es:

```text
.planning/
  config.yml
  project-context.md
  releases/
```

Los ejemplos, templates y scripts v4 no deben crear ni leer `active/`, `finished/` o `.releases/`.

`/plan-init` no debe copiar el template pack completo al repo de trabajo. El repo de trabajo guarda `.planning/config.yml`, `.planning/project-context.md` y artefactos generados; los templates canonicos se leen desde la instalacion del plugin.

## Template pack y docs a eliminar o rehacer

Eliminar o reemplazar:

```text
planning-template/active/
planning-template/finished/
planning-template/_template/00-initial.md
planning-template/_template/01-expansion.md
planning-template/_template/02-deepening/
```

Rehacer como v4:

```text
planning-template/template-pack.yml
planning-template/templates/release.md
planning-template/templates/scope.md
planning-template/templates/task-guide.md
planning-template/templates/test-guide.md
planning-template/templates/story.md
planning-template/templates/task.md
planning-template/templates/TRACEABILITY.md
planning-template/templates/RETROSPECTIVE-RAW.md
```

Reglas del template pack:

- vive en la instalacion del plugin;
- se versiona junto con el plugin;
- se usa para renderizar artefactos hacia `.planning/releases/`;
- no se copia completo al repo de trabajo;
- puede ser referenciado por version/fingerprint en `.planning/config.yml`.

Actualizar referencias en:

```text
README.md
CHANGELOG.md
CONTRIBUTING.md
CLAUDE.md
AGENTS.md
docs/commands.yml
docs/reference.md
docs/user-guide.md
docs/developer-guide.md
docs/training-mode-plan.md
docs/plugin-review/
planning-template/TUTORIAL/
planning-template/WORKFLOWS/
planning-template/GLOSSARY.md
planning-template/GUIDE.md
planning-template/README.md
planning-template/config.yml
planning-template/update-version/
```

## Configuracion y metadata

Actualizar o rehacer:

```text
.claude-plugin/plugin.json
.claude-plugin/marketplace.json
.page/package.json
.page/package-lock.json
README.md version badge
CHANGELOG.md
```

Reglas:

- `plugin.json` debe describir v4 como release/scope/story/task, no lifecycle planning v3.
- `marketplace.json` no debe listar comandos removidos ni texto antiguo.
- todo version marker debe apuntar a v4.0.0 cuando se publique el major.
- `CHANGELOG.md` debe declarar ruptura, comandos removidos, storage nuevo y ausencia de aliases.
- `planning-template/update-version/` debe explicar que v4 es corte limpio. Si existe herramienta auxiliar de export desde v3, debe documentarse como opcional.
- `config.yml` debe modelar `project`, `plugin.template_pack_ref`, `git`, `scopes`, `guide_outputs`, `custom_generators`, validacion y autonomia; no debe conservar `terminology.planning_item` ni estados INITIAL/EXPANSION/DEEPENING.

## Site y landing page

Actualizar fuente, no outputs generados:

```text
.page/components/
.page/pages/
.page/locales/
.page/context/
.page/hooks/
.page/types/
.page/scripts/verify.js
.page/package.json
.page/package-lock.json
```

No editar como fuente:

```text
.page/out/
.page/.next/
```

Cambios esperados:

- home debe explicar el flujo v4: init -> release init -> release -> scopes -> story groups -> tasks -> checks -> finalize.
- pagina de comandos debe mostrar solo comandos v4.
- tutoriales deben usar `.planning/releases/`, scopes, `story-NN-a`, task guides y test guides.
- training/demo no debe ensenar `plan-new`, `plan-expand`, `active/finished`, `.releases/` ni planificaciones adicionales por scope.
- localizaciones `en` y `es` deben actualizarse juntas.
- `.page/scripts/verify.js` debe fallar si el site renderiza comandos legacy.

Verificacion site:

```text
cd .page
npm run build
```

## Documentacion publica

Actualizar como minimo:

```text
README.md
docs/commands.yml
docs/reference.md
docs/user-guide.md
docs/developer-guide.md
planning-template/TUTORIAL/reference.md
planning-template/TUTORIAL/*.md
planning-template/WORKFLOWS/**/*.md
planning-template/GLOSSARY.md
planning-template/GUIDE.md
planning-template/README.md
```

Reglas:

- `docs/commands.yml` es inventario canonico de comandos v4.
- `docs/reference.md` debe generarse o revisarse desde `docs/commands.yml`.
- README no debe tener tabla de "similar commands" para comandos legacy.
- tutoriales deben iniciar desde `/release init`, no desde `/plan-new` o `/plan-expand`.
- developer guide debe explicar scripts/librerias v4 y el contrato stage-first.
- glossary debe definir release, scope, story group, story part, task guide, test guide y finalize.

## Tooling y CI del plugin

Actualizar:

```text
scripts/verify-plugin.sh
scripts/migrate-commands.sh
.github/workflows/deploy-pages.yml
.gitignore
```

Reglas:

- `verify-plugin.sh` debe validar manifest, docs, site source, template, scripts y ausencia legacy.
- `migrate-commands.sh` debe borrarse si solo migra comandos v3, o reescribirse para tareas v4 reales.
- workflow de Pages debe seguir construyendo desde `.page` y no depender de outputs legacy.
- `.gitignore` debe seguir excluyendo outputs generados, no fuentes v4.

## Scripts legacy

Cada script debe caer en una de tres categorias:

| Categoria | Accion |
|-----------|--------|
| Reescribir | El script implementa una capacidad v4 con modelo release/scope/story/task. |
| Extraer libreria | Se rescata logica pura a `planning-template/scripts/lib/`. |
| Borrar | El script solo existe para modelos v3. |

Revision inicial:

```text
release.mjs              -> reescribir como gestor v4
planning-init.mjs        -> reescribir para estructura v4 base
planning-story.mjs       -> reescribir para scopes
planning-task.mjs        -> adaptar a release/scope/story/task
planning-check.mjs       -> adaptar y ampliar con guide checks
planning-report.mjs      -> adaptar a release/scope
doc-generate.mjs         -> plegar bajo plan-report o borrar wrapper directo
planning-atomize.mjs     -> integrar a release story atomize
planning-mutate.mjs      -> reemplazar por stores/librerias v4
planning-archive.mjs     -> borrar o reimplementar como release finalize
planning-done.mjs        -> borrar si queda cubierto por release/story/task stages
planning-clone.mjs       -> borrar salvo que plan-recover lo justifique
planning-merge.mjs       -> borrar; usar release story move/link si aplica
planning-retry.mjs       -> mover a plan-recover si se conserva
planning-rollback.mjs    -> mover a plan-recover si se conserva
planning-story-skip.mjs  -> mover a release story skip
planning-from-release.mjs -> integrar a release import/plan
update-version.mjs       -> conservar para futuras migraciones v4+
```

## Checks obligatorios

`scripts/verify-plugin.sh` debe fallar si encuentra:

- `skills/release-*`;
- `skills/us-*`;
- `skills/doc-*`;
- comandos removidos en `docs/commands.yml`;
- referencias activas a `.planning/active`, `.planning/finished` o `.releases`;
- referencias a `INITIAL`, `EXPANSION` o `DEEPENING` como estados publicos;
- `Linked Child Plannings` o cualquier instruccion de planificaciones adicionales por scope;
- ejemplos que usen `NNN-slug` como raiz de trabajo;
- templates que creen `00-initial.md`, `01-expansion.md` o `02-deepening/`.
- comandos legacy en `.page/locales`, `.page/components`, `.page/pages` o `.page/out`;
- referencias legacy en `.claude-plugin/marketplace.json` o `.claude-plugin/plugin.json`;
- version markers desalineados entre `.claude-plugin/plugin.json`, `.page/package*.json`, README badge y `CHANGELOG.md`;
- `docs/commands.yml` desalineado con carpetas `skills/` v4;
- `planning-template/config.yml` sin `scopes` o con campos v3 como contrato principal.

Checks sugeridos:

```text
rg -n "release-init|release-new|release-add|release-remove|release-status" skills docs planning-template
rg -n "us-new|us-enrich|us-split|us-status|epic-enrich" skills docs planning-template
rg -n "\.planning/active|\.planning/finished|\.releases" docs planning-template skills .page .claude-plugin
rg -n "INITIAL|EXPANSION|DEEPENING|Linked Child Plannings|02-deepening" docs planning-template skills .page .claude-plugin
rg -n "plan-new|plan-expand|plan-from-epic|plan-template|doc-task|plan-test-suite" README.md docs planning-template skills .page .claude-plugin
```

## Verificacion de cierre

Antes de publicar v4:

```text
bash scripts/verify-plugin.sh
cd .page
npm run build
git diff --check
```

Revision manual:

- abrir README y confirmar que solo describe v4;
- abrir `docs/reference.md` y confirmar que solo lista comandos v4;
- abrir landing site local o build output y confirmar que no muestra comandos v3;
- revisar `planning-template/` como template pack instalado, no como carpeta copiada por `/plan-init`;
- revisar `CHANGELOG.md` y version markers juntos.

## Publicacion

El release v4 debe comunicar:

- no hay compatibilidad de comandos v3;
- no hay migracion automatica obligatoria de workspaces v3;
- el nuevo storage es `.planning/releases/`;
- los comandos v3 fueron removidos, no deprecados;
- si se entrega una herramienta de export/migracion v3, es auxiliar y no condiciona el contrato v4.
