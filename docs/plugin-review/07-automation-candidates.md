# Skills candidatas para automatización

## Resumen

El problema principal no es solo la cantidad de comandos, sino que varias skills contienen lógica determinista que se repite o que es llamada desde otras skills. Eso aumenta el costo de contexto porque el agente debe cargar instrucciones largas para hacer tareas que un script podria resolver con argumentos, parsing de Markdown y salidas estructuradas.

Medición inicial antes de aplicar automatizaciones:

- 52 skills en `skills/*/SKILL.md`.
- 33.399 palabras en total.
- Skills mas pesadas por palabras: `plan-task` (2.958), `doc-generate` (1.582), `plan-init` (1.566), `plan-story` (1.473), `plan-validate` (1.303), `plan-done` (1.144), `plan-update-version` (1.123), `plan-atomize` (1.029), `release-status` (980), `plan-task-validate` (952).
- Pares con similitud alta: `doc-story` / `doc-task`, `plan-task-validate` / `plan-validate`, `plan-story` / `plan-task`, `plan-atomize` / `plan-task-validate`, `release-add` / `release-remove`.

Medición despues de automatizar validacion, generacion de documentacion, release management, inicializacion, versionado, reportes, backlog/story utilities, mutaciones de ciclo de vida, etapas deterministas de task y helpers de `plan-story` / `plan-atomize`:

- 52 skills en `skills/*/SKILL.md`.
- 18.634 palabras en total.
- `doc-generate`, `doc-task`, `doc-story`, `plan-health`, `plan-validate`, `plan-task-validate`, `us-status`, `plan-audit-docs`, `plan-doctor`, `plan-status`, `plan-report`, `plan-export`, `plan-standup`, `plan-history`, `release-init`, `release-new`, `release-add`, `release-remove`, `release-status`, `us-new`, `us-enrich`, `us-split`, `epic-enrich`, `plan-enrich-story`, `plan-enrich-epic`, `plan-split-story`, `plan-task`, `plan-story`, `plan-atomize`, `plan-init`, `plan-update-version` y las mutaciones de ciclo de vida quedaron como wrappers o coordinadores livianos sobre scripts compartidos con parametros.

## Criterio usado

Una skill es buena candidata para automatizar cuando cumple varias de estas condiciones:

- parsea argumentos, rutas o tablas Markdown de forma repetible;
- crea o actualiza archivos con plantillas estables;
- hace validaciones estructurales con reglas enumerables;
- calcula estados, dependencias, conteos o transiciones;
- es llamada desde otras skills y por eso multiplica tokens;
- contiene poco criterio abierto del agente y mucho procedimiento mecanico.

Una skill deberia quedarse como skill principal cuando requiere juicio contextual, negociacion con el usuario, priorizacion de scope o implementacion real de codigo.

## Candidatas de prioridad alta

### 1. Validadores estructurales

Skills afectadas:

- `plan-validate`
- `plan-task-validate`
- `plan-health`
- `us-status`
- `plan-audit-docs`
- `plan-doctor`

Motivo:

Estas skills describen parsers y checks deterministas: encontrar plannings, leer tablas, validar estados, detectar ciclos, revisar placeholders, verificar links, contar filas y emitir FAIL/WARN/PASS. Ese trabajo deberia vivir en un CLI, por ejemplo:

```bash
node .planning/scripts/planning-check.mjs validate [planning-id] --format markdown
node .planning/scripts/planning-check.mjs task-validate <planning-id> [story-id] [task-id] --format json
node .planning/scripts/planning-check.mjs health --format markdown
node .planning/scripts/planning-check.mjs us-status [path/to/container] --format markdown
node .planning/scripts/planning-check.mjs audit-docs <planning-id> [--docs-dir docs] --format markdown
node .planning/scripts/planning-check.mjs doctor [--plugin-root <path>] --format markdown
```

La skill quedaria reducida a:

1. ejecutar el comando;
2. leer el resultado;
3. explicar hallazgos importantes;
4. proponer la siguiente accion.

Beneficio esperado:

- Menos tokens en llamadas de validacion.
- Line references mas consistentes.
- Mismo motor para `plan-validate`, `plan-health`, `plan-task-validate` y `plan-doctor`.
- Menos drift entre reglas duplicadas.

Estado: aplicado en este checkout. `planning-template/scripts/planning-check.mjs` es el entrypoint compartido para validadores estructurales con subcomandos `health`, `validate`, `task-validate`, `us-status`, `audit-docs` y `doctor`. Las skills `plan-health`, `plan-validate`, `plan-task-validate`, `us-status`, `plan-audit-docs` y `plan-doctor` quedaron como wrappers read-only que ejecutan el script, reportan su salida y conservan solo la interpretacion humana de los hallazgos.

### 2. Generacion de documentacion

Skills afectadas:

- `doc-generate`
- `doc-task`
- `doc-story`

Motivo:

`doc-task` y `doc-story` son wrappers explicitos sobre `doc-generate`. `doc-generate` contiene una matriz Area -> documento, rutas de salida y plantillas Markdown para inline docs, ADR, changelog, user guide y release notes. Eso es una automatizacion directa.

Propuesta:

```bash
node .planning/scripts/doc-generate.mjs <planning-id> [story-id] [task-id]
```

El script debe ser un entrypoint unico por aridad, no un script por wrapper:

- `doc-generate.mjs NNN-slug` genera consolidacion de planning;
- `doc-generate.mjs NNN-slug story-NN` genera documentacion de story;
- `doc-generate.mjs NNN-slug story-NN task-NN` genera documentacion de task.

El script deberia:

- detectar nivel por cantidad de argumentos;
- leer area desde la story;
- aplicar la matriz de salida;
- crear o appendear archivos en `docs/`;
- devolver JSON o Markdown con `written`, `skipped`, `warnings`.

Las skills `doc-task` y `doc-story` podrian desaparecer como skills reales y quedar como aliases/documentacion, o reducirse a una linea que llama el mismo script con la aridad correcta.

Estado: aplicado en este checkout. `planning-template/scripts/doc-generate.mjs` centraliza la matriz de documentos, rutas de salida, append-vs-overwrite, deteccion de ADRs, consolidacion de release/user guide y salida Markdown/JSON con `written`, `skipped` y `warnings`. `doc-generate`, `doc-task` y `doc-story` quedaron como wrappers livianos sobre ese mismo entrypoint parametrizado; no hay scripts separados por skill.

### 3. Release management

Skills afectadas:

- `release-init`
- `release-new`
- `release-add`
- `release-remove`
- `release-status`

Motivo:

Todo el flujo release es CRUD sobre `.releases/*.md` mas lectura de estados desde `.planning/`. Las transiciones tambien son enumerables: `DRAFT`, `PLANNED`, `IN PROGRESS`, `BLOCKED`, `RELEASED`, `CANCELLED`.

Propuesta:

```bash
node .planning/scripts/release.mjs init
node .planning/scripts/release.mjs new v1.2.0 -- "..." --target ... --date ...
node .planning/scripts/release.mjs add v1.2.0 001-foo 002-bar
node .planning/scripts/release.mjs remove v1.2.0 001-foo
node .planning/scripts/release.mjs status [v1.2.0] [--mark-released]
```

El script debe ser un entrypoint unico por subcomando, no un script por wrapper:

- `release.mjs init` inicializa `.releases/`;
- `release.mjs new` crea el release en `DRAFT`;
- `release.mjs add` agrega plannings con resumen y estado vivo desde `.planning/`;
- `release.mjs remove` remueve plannings y renumera la tabla;
- `release.mjs status` muestra estado, sincroniza lectura viva y aplica transiciones `--mark-*`.

La skill deberia intervenir solo cuando falten datos humanos, por ejemplo target/date o aprobacion para marcar `BLOCKED` sin plannings bloqueados.

Estado: aplicado en este checkout. `planning-template/scripts/release.mjs` centraliza inicializacion, creacion, agregado, remocion, estado, lectura viva de `.planning/`, actualizacion de `.releases/README.md` y transiciones de releases. Las skills `release-init`, `release-new`, `release-add`, `release-remove` y `release-status` quedaron como wrappers livianos sobre ese mismo entrypoint parametrizado; no hay scripts separados por skill. `release-new` conserva la interaccion humana para `--target` y `--date`, y `release-remove` / `release-status --mark-blocked` requieren confirmacion explicita antes de usar `--force` en casos sensibles.

### 4. Inicializacion de `.planning/`

Skill afectada:

- `plan-init`

Motivo:

`plan-init` mezcla tareas perfectas para codigo: localizar template, copiar arboles, preservar carpetas en `--force`, detectar directorios, proponer codigos de area, actualizar placeholders en varios Markdown y escribir `config.yml`.

Propuesta:

```bash
node <planning-template>/scripts/planning-init.mjs --blank
node <planning-template>/scripts/planning-init.mjs --force
node <planning-template>/scripts/planning-init.mjs --detect-only --format markdown
```

La parte interactiva puede seguir coordinada por la skill, pero el inventario y las escrituras deberian ser scriptables. Esto tambien bajaria riesgo de errores al actualizar matrices como `TRACEABILITY-GLOBAL.md`.

Estado: aplicado en este checkout. `planning-template/scripts/planning-init.mjs` centraliza copia del template, preservacion no destructiva de archivos existentes de proyecto con `--force` (`active/`, `finished/`, `config.yml`, guias, traceability, smoke/logging, `_template/` y SDLC area guidance), deteccion de areas, generacion de AREA files, actualizacion de GUIDE/TRACEABILITY/README de areas, escritura inicial de `config.yml` y salida Markdown/JSON. La skill conserva la revision humana opcional de areas antes de escribir.

### 5. Version migration runner

Skill afectada:

- `plan-update-version`

Motivo:

La seleccion de cadena `N -> N+1`, localizacion de migraciones, preflight de git, dry-run, copia a `.planning/update-version/` y registro en `APPLIED.md` son mecanicas. El contenido de cada migracion puede seguir en Markdown, pero el runner deberia ser codigo.

Propuesta:

```bash
node .planning/scripts/update-version.mjs <from> <to> [--dry-run] [--allow-dirty]
```

La skill quedaria como wrapper que explica resultados y maneja casos ambiguos que el runner reporte.

Estado: aplicado en este checkout como corte de preflight. `.planning/scripts/update-version.mjs` centraliza parseo de versiones, seleccion de cadena major-pair, busqueda/copia de migraciones, validacion de `.planning/`, preflight git dirty y salida Markdown/JSON. La aplicacion semantica sigue en los archivos Markdown de migracion porque no son un DSL deterministico.

### 6. Test-suite generation

Skill afectada:

- `plan-test-suite`

Motivo:

Esta ya tiene la arquitectura correcta: la skill prefiere `.planning/scripts/generate-test-suite.sh`. El problema pendiente es que todavia incluye un fallback manual largo y reglas que deberian vivir en el script.

Propuesta:

- mover todo el fallback schema al script;
- hacer que el script emita `--format json|markdown`;
- dejar la skill como invocador del script y lector de warnings.

Estado: aplicado en este checkout. `.planning/scripts/generate-test-suite.sh` conserva la deteccion de tooling, la matriz de gates, el schema de artefactos, la guia de ambiente de aceptacion aislado, el inventario de dependencias y el scaffold Maven. La skill `plan-test-suite` quedo como wrapper que ejecuta el script, reporta su salida y lee los archivos generados para resumir gaps.

## Candidatas de prioridad media

### 7. Reportes de estado y comunicacion

Skills afectadas:

- `plan-report`
- `plan-export`
- `plan-standup`
- `plan-history`
- `plan-status`

Motivo:

Todas leen estado y renderizan una vista para una audiencia. Parte del contenido puede requerir sintesis, pero el inventario base, metricas, tablas y timelines pueden salir de un renderer comun.

Propuesta:

```bash
node .planning/scripts/planning-report.mjs status
node .planning/scripts/planning-report.mjs report <planning-id> [--metrics]
node .planning/scripts/planning-report.mjs standup
node .planning/scripts/planning-report.mjs export <planning-id> --format pr|tickets|markdown
node .planning/scripts/planning-report.mjs history <planning-id>
```

El script debe ser un entrypoint unico por subcomando, no un script por wrapper:

- `planning-report.mjs status` inventaria plannings iniciales, activos y finalizados;
- `planning-report.mjs report` calcula resumen ejecutivo, metricas, riesgos, PDRs, decisiones y timeline;
- `planning-report.mjs export` renderiza PR, tickets, issues externos o Markdown standalone;
- `planning-report.mjs standup` genera ayer/hoy/bloqueos desde estado actual y git reciente;
- `planning-report.mjs history` reconstruye cambios de estado desde git.

La skill conservaria el tono y la sintesis ejecutiva; el script entregaria datos normalizados.

Estado: aplicado en este checkout. `planning-template/scripts/planning-report.mjs` centraliza inventario, metricas, tablas, exportaciones, standup e historial de transiciones con salida Markdown/JSON. Las skills `plan-status`, `plan-report`, `plan-export`, `plan-standup` y `plan-history` quedaron como wrappers read-only sobre ese mismo entrypoint parametrizado; no hay scripts separados por skill.

### 8. Backlog/story utilities

Skills afectadas:

- `us-new`
- `us-enrich`
- `us-split`
- `epic-enrich`
- `plan-enrich-story`
- `plan-enrich-epic`
- `plan-split-story`

Motivo:

Estas tienen mas criterio de producto que los validadores, pero comparten operaciones mecanicas: detectar container, asignar IDs, crear filenames, actualizar indices, separar AC, registrar edge cases.

Propuesta:

- no reemplazarlas completas;
- usar un entrypoint unico por subcomando, no un script por skill:

```bash
node .planning/scripts/planning-story.mjs backlog-inspect <container-or-story>
node .planning/scripts/planning-story.mjs backlog-new <container> --title "..." --criteria "..."
node .planning/scripts/planning-story.mjs backlog-enrich <story-ref> --section "Heading::Body"
node .planning/scripts/planning-story.mjs backlog-split <story-file> --new-title "..." --move-ac 1,2
node .planning/scripts/planning-story.mjs planning-inspect <planning-id> [story-NN]
node .planning/scripts/planning-story.mjs planning-add-story <planning-id> --title "..."
node .planning/scripts/planning-story.mjs planning-enrich-story <planning-id> <story-NN> --section "Heading::Body"
node .planning/scripts/planning-story.mjs planning-split-story <planning-id> <story-NN> --new-title "..." --move-tasks 1,2
```

El script debe asumir operaciones mecanicas: detectar container, asignar IDs, crear filenames, renderizar borradores, actualizar indices simples, separar AC/task rows y registrar edge cases. La skill conserva diagnostico de gaps, contenido de producto, aprobacion humana y validacion semantica.

Estado: aplicado en este checkout. `planning-template/scripts/planning-story.mjs` centraliza `backlog-inspect`, `backlog-new`, `backlog-enrich`, `backlog-split`, `planning-inspect`, `planning-add-story`, `planning-enrich-story` y `planning-split-story`. Las skills `us-new`, `us-enrich`, `us-split`, `epic-enrich`, `plan-enrich-story`, `plan-enrich-epic` y `plan-split-story` quedaron como wrappers sobre ese mismo entrypoint parametrizado; no hay scripts separados por skill. Las mutaciones siguen siendo dry-run por defecto y requieren `--write` despues de aprobacion humana.

### 9. Lifecycle file moves

Skills afectadas:

- `plan-done`
- `plan-clone`
- `plan-merge`
- `plan-rollback`
- `plan-retry`
- `plan-story-skip`
- `plan-archive`

Motivo:

Mueven carpetas, cambian estados y actualizan indices. Hay criterio sobre si hacerlo, pero la mutacion puede ser script comun con dry-run.

Propuesta:

```bash
node .planning/scripts/planning-mutate.mjs clone ...
node .planning/scripts/planning-mutate.mjs merge ...
node .planning/scripts/planning-mutate.mjs rollback ...
node .planning/scripts/planning-mutate.mjs archive ...
```

La regla importante: siempre ofrecer `--dry-run` y emitir lista exacta de archivos a tocar.

Estado: aplicado en este checkout con un entrypoint comun: `planning-template/scripts/planning-mutate.mjs`. Las skills `plan-done`, `plan-clone`, `plan-merge`, `plan-rollback`, `plan-retry`, `plan-story-skip` y `plan-archive` invocan subcomandos (`done`, `clone`, `merge`, `rollback`, `retry`, `story-skip`, `archive`) con dry-run cuando mutan archivos. El subcomando `archive` audita closeout, mueve `active/<planning-id>/` a `finished/<planning-id>/` y actualiza indices. Las skills conservan aprobacion humana, revision del limite del dry-run, ejecucion de `/plan-story`, seguimiento de traceability/PDR, milestone feedback, retrospectiva y finalizacion git/PR segun corresponda. No hay entrypoints publicos separados por skill; los archivos internos de lifecycle se invocan solo a traves de `planning-mutate.mjs`.

## Skills que conviene mantener pesadas por ahora

### `plan-task`

Es una skill dificil de convertir completa porque ejecuta codigo real, maneja tests, smoke checks, review humano, PRs y correcciones. El corte adecuado no es reemplazarla por completo, sino separar etapas deterministas y dejar la implementacion/juicio en la skill.

Regla de interfaz: el primer argumento del script debe ser la etapa.

```bash
node .planning/scripts/planning-task.mjs inspect <planning-id> <story-id> <task-id>
node .planning/scripts/planning-task.mjs readiness <planning-id> <story-id> <task-id>
node .planning/scripts/planning-task.mjs git-setup <planning-id> <story-id> <task-id> [--execute]
node .planning/scripts/planning-task.mjs start <planning-id> <story-id> <task-id> [--write]
node .planning/scripts/planning-task.mjs publish <planning-id> <story-id> <task-id> [--file <path>] [--execute]
node .planning/scripts/planning-task.mjs correction <planning-id> <story-id> <task-id> [--file <path>] [--execute]
node .planning/scripts/planning-task.mjs closeout <planning-id> <story-id> <task-id> [--write]
```

Automatizable en el script:

- deteccion de planning/story/task paths;
- lectura de config defaults;
- branch naming y preflight git;
- generacion/ejecucion aprobada de comandos `git`/`gh`;
- derivacion de commit message;
- staging allowlist desde `Affected files / components` mas `--file`;
- actualizacion de status en task + story index;
- check de dependencias y hints de test-suite/logging/smoke.

No automatizable totalmente:

- decidir o cambiar el diseno tecnico;
- implementar codigo;
- juzgar evidencia de tests/smoke;
- resolver contradicciones con docs;
- aprobar review humano;
- decidir PDRs o excepciones de logging/test.

Estado: primer corte aplicado en este checkout. `planning-template/scripts/planning-task.mjs` centraliza las etapas `inspect`, `readiness`, `git-setup`, `start`, `publish`, `correction` y `closeout`. La skill `plan-task` quedo como coordinador liviano: ejecuta las etapas, mantiene la implementacion y la evaluacion semantica, y solo permite `git`/`gh` con `--execute` despues de aprobacion o cambios markdown con `--write`.

### `plan-story`

Debe seguir coordinando el flujo humano y PRs, pero puede apoyarse en helpers para:

- detectar siguiente task elegible;
- verificar task PR mergeado;
- actualizar story status;
- derivar story branch;
- generar reporte final.

Estado: aplicado en este checkout como helpers de ejecucion dentro del entrypoint existente `planning-template/scripts/planning-story.mjs`, sin crear un script separado por skill. Los subcomandos `execute-inspect`, `execute-start`, `execute-done` y `execute-finalize` localizan la story en `./.planning/`, validan atomizacion, derivan la rama de story con soporte para prefijo de worktree, detectan la siguiente task elegible, listan ramas locales de task DONE para limpieza post-merge, renderizan done criteria/resumenes de verificacion y actualizan status con `--write`. La skill `plan-story` queda como coordinador: ejecuta checks de contexto, verifica PRs mergeados, invoca `/plan-task`, pide review humano final, evalua smoke evidence y ejecuta git/PR.

### `plan-atomize`

Tiene criterio real para dividir trabajo, pero puede delegar:

- escritura de archivos desde template;
- actualizacion de tabla de tareas;
- validacion post-atomizacion;
- generacion de suites.

Estado: aplicado en este checkout como script dedicado `planning-template/scripts/planning-atomize.mjs`. El helper expone `inspect` para descubrir worklist, saltar stories DONE o ya atomizadas y leer configuracion; y `apply` para escribir task files desde una propuesta JSON aprobada, validar dependencias hacia tasks anteriores, reescribir la tabla `## Tasks`, reportar archivos tocados y devolver el comando deterministico de test suite. La skill `plan-atomize` queda como coordinador de juicio: lee contexto/docs, propone tasks, aplica `[CHECK-ATOMICITY]`, agrega la task explicita de DB/ORM cuando corresponde, pide aprobacion humana, invoca el helper y ejecuta `[CHECK-TRACEABILITY]`.

## Refactor sugerido

1. Crear un paquete de scripts bajo `planning-template/scripts/` para que llegue a cada workspace via `/plan-init`.
2. Usar Node.js si se prioriza parsing Markdown/YAML portable; usar Bash solo para wrappers muy simples.
3. Exponer salida estable en JSON y Markdown:
   - JSON para que otras skills consuman resultados sin releer archivos grandes;
   - Markdown para uso humano directo.
4. Reducir cada skill automatizable a:
   - argumento esperado;
   - comando a ejecutar;
   - como interpretar exit codes;
   - cuando pedir aprobacion humana.
5. Mantener los documentos `planning-template/WORKFLOWS/` como reglas de negocio, pero evitar que las skills los repliquen textualmente.

## Cortes aplicados

Cortes aplicados en este checkout:

- `planning-check.mjs` centraliza validadores estructurales.
- `doc-generate.mjs` centraliza generacion de documentacion.
- `release.mjs` centraliza release management.
- `planning-report.mjs` centraliza reportes y comunicacion.
- `planning-atomize.mjs` centraliza escritura y validaciones mecanicas de `/plan-atomize`.
- `planning-story.mjs` centraliza backlog/story utilities y helpers deterministas de `/plan-story`.
- `planning-mutate.mjs` centraliza mutaciones de ciclo de vida.
- `planning-task.mjs` centraliza etapas deterministas de `/plan-task`.

Los scripts mantienen salida Markdown para uso humano y JSON cuando otras skills necesiten consumir resultados. `scripts/verify-plugin.sh` exige los scripts compartidos y valida su sintaxis con `node --check` cuando Node esta disponible.
