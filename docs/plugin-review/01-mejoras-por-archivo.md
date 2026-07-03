# Mejoras por archivo

## Metadata y documentación principal

### `.claude-plugin/plugin.json`

1. Reducir la descripción actual. Es demasiado larga para metadata de plugin y mezcla marketing con inventario completo de comandos.
2. Mover el inventario completo a `docs/reference.md` y dejar aquí una descripción corta: propósito, tipo de almacenamiento, comandos principales y compatibilidad general.
3. Corregir consistencia de nombres: algunos comandos aparecen sin `/` (`plan-new`, `plan-expand`) y otros con `/` (`/plan-run`, `/plan-git-config`).
4. Agregar una frase que refleje mejor la finalidad general: no solo "software projects", sino "project planning and execution, optimized for software repositories".

### `.claude-plugin/marketplace.json`

1. Actualizar la descripción porque todavía menciona `plan-scope`, comando que ya no existe en `skills/`.
2. Agregar comandos de release, agentes y documentación, que sí existen pero no aparecen en la descripción.
3. Mantener un resumen más breve que `plugin.json`; el marketplace debería vender el valor, no enumerar toda la superficie.

### `README.md`

1. Ampliar "Commands at a glance" para incluir comandos reales faltantes: `/plan-run`, `/plan-agent-*`, `/plan-git-config`, `/plan-health`, `/plan-report`, `/plan-history`, `/plan-export`, `/plan-clone`, `/plan-merge`, `/plan-retry`, `/plan-rollback`, `/plan-story-skip`, `/us-split`, `/us-status`, `/doc-*` y `/release-*`.
2. Agregar una sección "Which flow should I use?" con rutas para idea nueva, stories existentes, ejecución asistida y pipeline autónomo.
3. Aclarar que `/plan-story` es el comando actual para ejecutar una story; no existe `/plan-scope`.
4. Añadir una nota sobre el uso fuera de software: funciona para proyectos generales, pero varias funciones avanzadas son software-first.

### `docs/reference.md`

1. Reemplazar referencias a `scope`, `scope-NN` y `/plan-scope` por `story`, `story-NN` y `/plan-story` cuando representen la unidad antigua.
2. Actualizar la estructura instalada por `/plan-init`: actualmente muestra `scope-NN-name.md`, pero la plantilla real es `story-NN-name.md`.
3. Mantener una tabla completa con los 50 comandos detectados en `skills/`.
4. Separar comandos por intención real: setup, backlog, lifecycle, execution, automation agents, documentation, release planning, maintenance and recovery.
5. Documentar `argument-hint` y modo de uso para cada comando.

### `docs/user-guide.md`

1. Actualización prioritaria: todavía documenta `Scope` como concepto central.
2. Reescribir `Scope` como `User Story / Story`, alineado con `planning-template/GLOSSARY.md`.
3. Cambiar ejemplos con `/plan-scope` y `scope-01` a `/plan-story` y `story-01`.
4. Cambiar "all scopes done" por "all stories done".
5. Agregar una sección de proyecto general no software con ejemplos: evento, investigación, documentación, proceso operativo.
6. Aclarar qué comandos escriben código o documentación y cuáles solo modifican `.planning/`.

### `docs/developer-guide.md`

1. Actualizar el nombre del plugin en ejemplos: aparece `planning-system`, pero el plugin real es `claude-planning-with-ai`.
2. Corregir `ATOMIZE-SCOPE` por `ATOMIZE-STORY.md`.
3. Corregir "scope table" y "scope consistency" por "story table" y "story consistency".
4. Agregar una regla de mantenimiento: todo rename conceptual debe actualizar `README.md`, `docs/`, `planning-template/`, `.page/locales/` y metadata.
5. Agregar checklist de validación manual después de editar un skill.

### `CHANGELOG.md`

1. Mantener enlaces inferiores completos: `[Unreleased]` debe comparar contra la última versión publicada y cada versión debe tener link propio.
2. Agregar nota en `[Unreleased]` si se corrige la deriva `scope/story`.
3. Considerar mover planes internos antiguos a un archivo de diseño o mantenerlos fuera de la documentación pública si generan ruido.

## Skills `plan-*`

### `skills/plan-story/SKILL.md`

1. Corregir la recomendación final: menciona `/plan-advance`, pero ese comando no existe.
2. Reemplazar esa sugerencia por `/plan-status` y luego `/plan-story <planning-id> <next-story-id>`.
3. Revisar si debe tener `Edit` en `allowed-tools`, porque modifica archivos.
4. Aclarar si `/plan-story` debe hacer commits por tarea internamente o delegar siempre a `/plan-task`.
5. La confirmación manual de done criteria limita el modo autónomo; conviene añadir política explícita para `/plan-run` o agentes.

### `skills/plan-task/SKILL.md`

1. Renombrar "Derive the scope" por "Derive the commit scope" para evitar confusión con el concepto antiguo.
2. Añadir fallback si `Technical Design -> Affected files / components` no existe o está incompleto.
3. Aclarar cómo actuar en proyectos no software donde no hay runner de tests.
4. Agregar regla para documentación generada después del commit: no commitearla automáticamente o hacer segundo commit docs.
5. Mantener `Edit` en `allowed-tools`.

### `skills/plan-run/SKILL.md`

1. Ajustar la promesa "sin más interrupciones" porque los skills llamados pueden pedir confirmación manual o contexto git.
2. Aclarar que es autónomo salvo checkpoints críticos.
3. Especificar qué ocurre cuando `plan-agent-execute` deja stories en `BLOCKED`.
4. Agregar salida esperada para proyectos sin git o sin GitHub CLI.
5. Si se busca compatibilidad general, agregar modo `--no-git` o instrucciones para workspaces no versionados.

### `skills/plan-agent-execute/SKILL.md`

1. Verificar que no queden conceptos `scope` en el cuerpo.
2. Hacer explícito que la ejecución paralela solo es segura si las stories no tocan los mismos archivos o áreas.
3. Agregar criterio de exclusión para archivos compartidos, migraciones, schemas o estado global.
4. Añadir salida de "batch plan" antes de disparar agentes.

### `skills/plan-agent-plan/SKILL.md`

1. Documentar el algoritmo para derivar el próximo número y manejo de colisiones.
2. Revisar ideas existentes en `.planning/ideas/` para evitar duplicar iniciativas.
3. Reemplazar "underspecified scope" por "underspecified story".

### `skills/plan-agent-validate/SKILL.md`

1. Aclarar si `SKIPPED` y `STANDBY` cuentan como estados cerrables o bloqueantes.
2. Coordinar con `plan-validate`, que hoy solo menciona `TODO`, `IN PROGRESS`, `DONE`.
3. Evitar archivar automáticamente si hay documentación pendiente generada por `doc-*`.

### `skills/plan-validate/SKILL.md`

1. Actualizar estados válidos: `TODO`, `IN PROGRESS`, `DONE`, `BLOCKED`, `SKIPPED`, `STANDBY`.
2. Agregar validación de comandos inexistentes en notas o sugerencias.
3. Agregar validación de drift conceptual: `scope-NN`, `/plan-scope`, `doc-scope`, `EXECUTE-SCOPE`, `ATOMIZE-SCOPE`.
4. Agregar validación de changelog/version links.

### `skills/plan-health/SKILL.md`

1. Diferenciar claramente de `/plan-validate`: health global, validate por planning.
2. Agregar chequeo de documentación instalada: `GUIDE.md`, `GLOSSARY.md`, `TRACEABILITY-GLOBAL.md`, `WORKFLOWS/`, `config.yml`.
3. Agregar chequeo de compatibilidad post-migración `scope -> story`.
4. Agregar reporte de comandos sugeridos por docs pero no instalados.

### `skills/plan-init/SKILL.md`

1. Separar mejor inicialización para proyectos no software.
2. Agregar flujo para proyectos generales: áreas por entregables, equipo, fase o carpeta documental.
3. Mejorar `--blank` con instrucciones claras de relleno manual para usuarios no técnicos.
4. Generar `config.yml` con `project.type` o `mode`: `software`, `general`, `documentation`, `research`, `operations`.
5. Agregar al reporte final una guía de próximo paso según el modo detectado.

### Otros skills `plan-*`

1. `plan-new`: aclarar que `Approximate Scope` es alcance general, detectar duplicados y agregar opción de planning ligero.
2. `plan-expand`: reforzar criterios para dividir stories y permitir "work packages" o "entregables" en proyectos generales.
3. `plan-atomize`: documentar cuándo no atomizar y reemplazar tests unitarios por evidencia verificable cuando no hay código.
4. `plan-done`: alinear con `STANDBY`, `SKIPPED` y `BLOCKED`; evitar duplicar PR si `/plan-story` ya lo abrió.
5. `plan-archive`: permitir retrospectiva mínima o `--no-retro`; consolidar docs con `/doc-generate`.
6. `plan-rollback`: hacer más fuerte el warning de que no revierte código y generar checklist de archivos a revertir.
7. `plan-retry`: verificar que el blocker fue resuelto y agregar modo por story.
8. `plan-story-skip`: hacer motivo obligatorio y coordinar con `plan-validate`.
9. `plan-enrich-epic`: aclarar que agrega stories a un planning activo; considerar alias conceptual `/plan-add-story`.
10. `plan-enrich-story`: agregar checklist mínimo y compartir plantilla con `/us-enrich`.
11. `plan-split-story`: definir renumeración, task folders existentes y cross-references.
12. `plan-merge`: agregar guardas para branches, PRs, dependencias, traceability y releases.
13. `plan-clone`: aclarar qué clona y considerar `--keep-expansion`.
14. `plan-report`: agregar modo ejecutivo/técnico e incluir blockers, decisiones, residuals y releases.
15. `plan-export`: agregar formatos `jira`, `github-issue`, `markdown`, `release-notes`, `brief`, `status-report`.
16. `plan-history`: documentar dependencia de git y agregar fallback sin git.
17. `plan-standup`: incluir `STANDBY` separado de `BLOCKED` y lenguaje para equipos no software.

## Skills `doc-*`, `us-*`, `epic-*` y `release-*`

### `skills/doc-generate/SKILL.md`

1. Es el skill más largo del repo; conviene dividirlo mentalmente en secciones o sub-workflows.
2. Asegurar que todo usa `story` y no `scope`.
3. Agregar soporte para documentación no software: actas, decisiones, manual operativo, checklist de entrega, reporte de cierre.
4. Definir si los docs generados viven en el proyecto usuario o dentro de `.planning/`.
5. Agregar política de overwrite/append más clara.

### `skills/doc-task/SKILL.md` y `skills/doc-story/SKILL.md`

1. Mantenerlos como wrappers.
2. Aclarar que son invocados automáticamente por `/plan-task` y `/plan-story`.
3. Agregar `--force` o `--regenerate`.
4. Confirmar que los nombres reemplazaron completamente a `doc-scope`.

### Skills de backlog

1. `us-new`: agregar soporte para requerimiento, tarea de negocio, hipótesis de investigación y mejora operativa; permitir `--type`.
2. `us-enrich`: añadir perfiles de enriquecimiento y considerar "Implementation Notes" configurable.
3. `us-split`: documentar cuándo usarlo frente a `plan-split-story`.
4. `us-status`: agregar readiness score y sugerencias concretas por story.
5. `epic-enrich`: aclarar que detecta gaps y agrega stories; diferenciarlo de `us-new`.

### Skills de release

1. `release-init`: agregar `argument-hint`, aclarar que es opcional e independiente de `/plan-init`.
2. `release-new`: soportar releases no semver como `2026-Q3`, `MVP-1`, `Entrega-Cliente-A`.
3. `release-add`: advertir si el planning no existe, está superseded o incompleto.
4. `release-remove`: registrar razón de remoción e historial.
5. `release-status`: alinear estados con `STANDBY` y `SKIPPED`; enlazar reportes o exports.

## Planning template, workflows y landing

### `planning-template/GLOSSARY.md`

1. Mantenerlo como terminología canónica.
2. Agregar "Work Item" o "Deliverable" como concepto general para proyectos no software.
3. Agregar tabla de equivalencias: software, producto y general.
4. Aclarar que `Approximate Scope` es alcance general, no `scope-NN`.

### Templates y configuración

1. `GUIDE.md`: agregar adaptación de áreas para proyectos no software e instrucciones para `config.yml`.
2. `PROMPTING.md`: agregar prompts para uso general y evidencia verificable sin tests unitarios.
3. `config.yml`: agregar `project.type`, `execution.requires_git`, `execution.requires_tests`, `docs.output_dir`.
4. `task-NN-name.md`: cambiar "Unit Tests" por `Verification` con subsección de tests si aplica.
5. `story-NN-name.md`: agregar `Evidence / Verification`, `Source / Requirement link` y `Story Type`.
6. `00-initial.md`: aclarar `Approximate Scope`, agregar `Project Mode` y `Success Evidence`.
7. `01-expansion.md`: agregar columna opcional `Evidence` y aclarar que dependencies usan IDs de stories.

### Workflows

1. `WORKFLOWS/README.md`: revisar que no conserve workflows antiguos con `scope`, agregar cuándo usar cada grupo.
2. `CREATE-PLANNING.md`: evitar que "scope" parezca `scope-NN`, elegir modo de proyecto y leer ideas existentes.
3. `ADVANCE-PLANNING.md`: reforzar creación de stories independientes y vincular con `plan-expand`.
4. `ATOMIZE-STORY.md`: alinear con `plan-atomize`, agregar cuándo no atomizar y verificación configurable.
5. `GENERATE-DOCUMENT.md`: separar generar artefacto, validar artefacto y documentar artefacto.
6. `EXPAND-ELEMENT.md`: unificar idioma y confirmar si sigue siendo usado.
7. `SUPERSEDE-PLANNING.md`: reforzar guardas para código mergeado, releases y documentación.
8. `CHECK-PLANNING-CONTEXT.md`: documentar comportamiento sin git y alinear con `STANDBY`.
9. `CHECK-STORY-CONTEXT.md`: formalizar salidas y fallback sin branch.
10. `CHECK-DEVWORKFLOW-CONSISTENCY.md`, `CHECK-PHASE5-CHAIN.md`, `CHECK-VERSIONING-ALIGNMENT.md`: completar, conectar o archivar.
11. `05-SDLC-PHASE-GUIDANCE/README.md`: agregar alternativa "Project Area Guidance" y áreas no técnicas.

### Tutorial y landing

1. `planning-template/TUTORIAL/README.md`: decidir bilingüismo formal y agregar flujo para proyecto general, solo documentación y solo release.
2. `planning-template/TUTORIAL/reference.md`: corregir "story demasiado amplio", reemplazar "scope nuevo" y añadir comandos de docs/release.
3. `.page/locales/commandsPage.*`: usar como fuente parcial para actualizar `docs/reference.md` y verificar los comandos reales.
4. `.page/components/Commands.tsx`: no requiere cambios prioritarios comparado con docs/skills.
