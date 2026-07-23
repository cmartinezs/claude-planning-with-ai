# Plan incremental

## Regla de trabajo

Esto es v4 y parte en limpio. No hay compatibilidad hacia atras, aliases legacy ni storage paralelo por defecto. La ruta sigue siendo incremental para controlar riesgo de implementacion, pero cada corte debe construir el modelo v4 final, no una transicion desde v3.

## Corte 0: configurar contexto del proyecto

Objetivo: hacer que `/release init` configure lo necesario para que el plugin pueda trabajar agnosticamente en cualquier estructura.

Cambios:

- Detectar y confirmar si el proyecto usa git.
- Si usa git, configurar branch base, estrategia de ramas y si se permitira automatizacion `git`/`gh`.
- Detectar carpetas, paquetes, workspaces o repositorios candidatos a scope.
- Pedir confirmacion humana del catalogo de scopes: id, nombre, paths, tipo, owner opcional y reglas de validacion.
- Registrar donde viven las historias o backlog fuente, si existen.
- Registrar guias funcionales, guias tecnicas, guias de arquitectura, guias de estilo/coding y documentacion de producto.
- Registrar comandos de build/test/smoke cuando puedan inferirse; marcar como `unknown` lo que requiera decision humana.
- Generar un indice inicial por scope con las fuentes documentales usadas para crear tasks y tests.
- Escribir `.planning/config.yml` y `.planning/project-context.md`.
- Registrar version/ruta del template pack instalado del plugin, sin copiar templates completos al repo de trabajo.

Validacion:

```text
node <plugin-install>/planning-template/scripts/release.mjs init --dry-run --format json
node <plugin-install>/planning-template/scripts/release.mjs init --write --format json
bash scripts/verify-plugin.sh
```

## Corte 1: definir contrato de release

Objetivo: establecer release como entidad principal y definir el nuevo contrato de archivos.

Cambios:

- Crear template de release nuevo con tabla de scopes, story groups y referencias de orquestacion, no de plannings.
- Definir estados `DRAFT`, `PLANNED`, `IN_PROGRESS`, `READY_FOR_RELEASE`, `RELEASED`, `FINALIZED`, `BLOCKED`, `CANCELLED`.
- Agregar validacion determinista de secuencia:
  - no saltar numeros al crear;
  - no liberar fuera de orden;
  - no finalizar fuera de orden;
  - cancelar solo con razon.
- Mantener `story-NN-name.md` y `task-NN-name.md` con cambios minimos para historias single-scope.
- Agregar soporte para historias relacionadas multi-scope con ids `story-NN-a`, `story-NN-b`, etc.
- Agregar `release_id`, `scope_id`, `story_group` y `story_part` o referencias equivalentes en story/task para trazabilidad.
- Usar `.planning/releases/release-NNN-slug/` como unica raiz de trabajo.
- Eliminar cualquier planificacion adicional por scope: si un scope necesita historias propias, se agregan dentro de `scopes/<scope-id>/`.
- Crear `task-guide.md` y `test-guide.md` por scope como artefactos generados desde la documentacion del proyecto.

Validacion:

```text
node <plugin-install>/planning-template/scripts/release.mjs status --format json
node <plugin-install>/planning-template/scripts/release.mjs new --dry-run ...
bash scripts/verify-plugin.sh
```

## Corte 2: introducir `/release`

Objetivo: tener un unico comando publico para release.

Cambios:

- Crear `skills/release/SKILL.md`.
- Eliminar `skills/release-*` del contrato v4.
- Actualizar `docs/commands.yml`, `README.md`, `docs/reference.md`, `docs/user-guide.md`.

Etapas minimas:

```text
/release init
/release new --title <title> --target <period> --date <date>
/release status [release-id]
/release scope add <release-id> <scope-id>
/release scope guide <release-id> <scope-id> --tasks --tests
/release story add <release-id> <scope-id> [--group NN --part a] --title <title>
/release story link <release-id> <story-group> --depends <scope/story>:<scope/story>
/release story remove <release-id> <scope-id> <story-id>
/release mark <release-id> <status>
/release finalize <release-id>
```

## Corte 3: adaptar story/task al contexto de release

Objetivo: que `/plan-story` y `/plan-task` acepten release y scope como raiz.

Cambios:

- Permitir argumentos `release-001 web story-01-a` y `release-001 web story-01-a task-01`.
- Rechazar `NNN-slug story-01 task-01` como forma v4.
- Hacer que `planning-story.mjs` lea stories desde el scope de la release.
- Hacer que `planning-task.mjs` derive rutas desde la story, no desde supuestos de carpeta planning.
- Actualizar validadores para exigir una o mas tasks por story.
- Actualizar validadores para que `release.md` sea la unica fuente de dependencias entre historias relacionadas de distintos scopes.
- Hacer que la atomizacion consulte `scopes/<scope-id>/task-guide.md` y `scopes/<scope-id>/test-guide.md` antes de crear tasks.

No cambiar todavia el contenido grande del template de task; solo agregar metadatos necesarios.

## Corte 3.5: generar guias tecnicas por scope

Objetivo: convertir documentacion del proyecto en un resumen operativo que sirva para crear tasks y test suites sin hardcodear reglas en el plugin.

Cambios:

- Crear una etapa `/release scope guide <release-id> <scope-id> --tasks --tests`.
- Leer las fuentes configuradas en `/release init`: documentacion funcional, tecnica, guias, PDRs aceptados, convenciones de test y comandos.
- Generar `task-guide.md` con tipos de task, orden recomendado, plantillas de secciones, criterios de readiness, decisiones previas y preguntas que bloquean automatizacion.
- Generar `test-guide.md` con gates por tipo de task, comandos, ambientes, mocks/fakes, evidencia minima y gaps.
- Guardar firma o fingerprint de fuentes para detectar cuando la guia esta stale.
- Permitir generadores custom por scope cuando el proyecto defina scripts propios.
- Hacer que `/plan-check guide` falle si una story se atomiza con guia faltante o stale.

## Corte 4: consolidar check/report/docs

Objetivo: reducir comandos duplicados sin perder capacidades.

Cambios:

- Crear `/plan-check` como wrapper unico de `planning-check.mjs`.
- Crear o ajustar `/plan-report` para cubrir summary, standup, history, export, docs y release notes.
- Eliminar las skills viejas que solo eran aliases conceptuales.
- Centralizar salida markdown/json.

Reemplazos v4:

```text
/plan-health         -> /plan-check health
/plan-validate       -> /plan-check validate
/plan-task-validate  -> /plan-check task
/plan-audit-docs     -> /plan-check docs
/plan-doctor         -> /plan-check doctor
/plan-standup        -> /plan-report standup
/plan-history        -> /plan-report history
/plan-export         -> /plan-report export
/doc-task            -> /plan-report docs --level task
/doc-story           -> /plan-report docs --level story
/doc-generate        -> /plan-report docs
```

## Corte 5: consolidar backlog/import/recovery

Objetivo: mover comandos secundarios fuera del flujo principal.

Cambios:

- Crear `/plan-backlog` solo si se decide mantener backlog externo como capacidad explicita.
- Crear `/plan-recover` para retry, rollback, clone, merge y skip.
- Reubicar `plan-from-release` como etapa de `/release import` o `/release plan`.
- Mantener `plan-decision` separado porque registra una decision transversal real.

## Corte 6: cierre de ruptura v4

Objetivo: dejar una superficie limpia y publicar el cambio como major.

Cambios:

- Confirmar contra `CHANGELOG.md` que el siguiente major es v4.0.0.
- Ejecutar la eliminacion legacy definida en [Eliminacion legacy](06-eliminacion-legacy.md).
- Actualizar manifests y metadata: `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, README badge y `.page/package*.json`.
- Rehacer documentacion publica: README, `docs/commands.yml`, reference, user guide, developer guide, tutoriales, workflows y glossary.
- Rehacer site/landing desde `.page` para mostrar solo el flujo v4 y validar con `npm run build`.
- Rehacer `planning-template/config.yml`, templates y scripts del plugin instalable. `/plan-init` no los copia completos al repo de trabajo.
- Actualizar `scripts/verify-plugin.sh` para validar ausencia legacy en skills, docs, template, site, manifests y version markers.
- Actualizar `CHANGELOG.md`.
- Actualizar `planning-template/update-version/<N>-<N+1>.md`.
- Documentar tabla de comandos removidos y reemplazos.
- Definir si existe una herramienta separada de export/migracion desde v3. Esa herramienta no debe condicionar el diseno v4.

## Primer corte recomendado

El primer cambio implementable deberia ser pequeno, pero ya sobre el contrato v4:

1. Crear `skills/release/SKILL.md` como comando gestor v4.
2. Reemplazar o rehacer `planning-template/scripts/release.mjs` con etapas `init`, `new`, `story-*`, `mark`, `finalize` en dry-run por defecto.
3. Agregar validacion de secuencia para create/release/finalize.
4. Agregar fixtures en `scripts/verify-plugin.sh`.
5. Actualizar README/reference con el flujo v4 como unico flujo recomendado.

Esto permite validar el modelo con poco riesgo sin arrastrar las decisiones de v3.

## Preguntas abiertas

1. Identificador de release: usar `release-001-slug`, `R001-slug` o conservar `vX.Y.Z` como archivo principal con ordinal interno.
2. Relacion con version semantica: una release puede o no coincidir con version de plugin/producto; conviene separar `release_id` de `version`.
3. Ubicacion final: la propuesta base usa `.planning/releases/`; solo cambiar si aparece una razon fuerte.
4. Ejecucion concurrente: permitir stories de release futura mientras una anterior sigue abierta, o requerir confirmacion humana siempre.
5. Cancelacion: definir si `CANCELLED` cuenta como cierre secuencial permanente o si requiere una release reemplazo.

## Criterio de exito

La documentacion principal deberia poder explicar el plugin con este mapa:

```text
1. Inicializa .planning.
2. Configura git, scopes, fuentes de historias, docs y guias.
3. Crea una release.
4. Define scopes de la release.
5. Genera o refresca guias de tasks/tests por scope desde la documentacion real del proyecto.
6. Define historias por scope; si una capacidad afecta varios scopes, crea `story-NN-a`, `story-NN-b`, etc.
7. Registra en la release padre la referencia de orquestacion entre historias relacionadas.
8. Atomiza cada historia en tasks dentro de su scope usando la guia del scope.
9. Ejecuta tasks.
10. Cierra historias.
11. Libera y finaliza releases en orden.
```

Si hace falta una tabla de "comandos similares" para entender que usar, todavia no esta suficientemente simple.
