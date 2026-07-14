# Skills candidatas para automatización

## Resumen

El problema principal no es solo la cantidad de comandos, sino que varias skills contienen lógica determinista que se repite o que es llamada desde otras skills. Eso aumenta el costo de contexto porque el agente debe cargar instrucciones largas para hacer tareas que un script podria resolver con argumentos, parsing de Markdown y salidas estructuradas.

Medición inicial antes de aplicar automatizaciones:

- 52 skills en `skills/*/SKILL.md`.
- 33.399 palabras en total.
- Skills mas pesadas por palabras: `plan-task` (2.958), `doc-generate` (1.582), `plan-init` (1.566), `plan-story` (1.473), `plan-validate` (1.303), `plan-done` (1.144), `plan-update-version` (1.123), `plan-atomize` (1.029), `release-status` (980), `plan-task-validate` (952).
- Pares con similitud alta: `doc-story` / `doc-task`, `plan-task-validate` / `plan-validate`, `plan-story` / `plan-task`, `plan-atomize` / `plan-task-validate`, `release-add` / `release-remove`.

Medición despues de automatizar validacion, generacion de documentacion y release management:

- 52 skills en `skills/*/SKILL.md`.
- 27.974 palabras en total.
- `doc-generate`, `doc-task`, `doc-story`, `plan-health`, `plan-validate`, `plan-task-validate`, `release-init`, `release-new`, `release-add`, `release-remove` y `release-status` quedaron como wrappers.

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

El script deberia:

- detectar nivel por cantidad de argumentos;
- leer area desde la story;
- aplicar la matriz de salida;
- crear o appendear archivos en `docs/`;
- devolver JSON o Markdown con `written`, `skipped`, `warnings`.

Las skills `doc-task` y `doc-story` podrian desaparecer como skills reales y quedar como aliases/documentacion, o reducirse a una linea que llama el script con el arity correcto.

Estado: aplicado en este checkout. `planning-template/scripts/doc-generate.mjs` centraliza la matriz de documentos, rutas de salida, append-vs-overwrite, deteccion de ADRs y consolidacion de release/user guide. `doc-generate`, `doc-task` y `doc-story` quedaron como wrappers livianos.

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
node .planning/scripts/release.mjs new v1.2.0 --purpose "..." --target ... --date ...
node .planning/scripts/release.mjs add v1.2.0 001-foo 002-bar
node .planning/scripts/release.mjs status [v1.2.0] [--mark-released]
```

La skill deberia intervenir solo cuando falten datos humanos, por ejemplo target/date o aprobacion para marcar `BLOCKED` sin plannings bloqueados.

Estado: aplicado en este checkout. `planning-template/scripts/release.mjs` centraliza inicializacion, creacion, agregado, remocion, estado y transiciones de releases. Las skills `release-*` quedaron como wrappers livianos; `release-new` conserva la interaccion humana para `--target` y `--date`, y `release-remove` / `release-status --mark-blocked` requieren confirmacion explicita antes de usar `--force` en casos sensibles.

### 4. Inicializacion de `.planning/`

Skill afectada:

- `plan-init`

Motivo:

`plan-init` mezcla tareas perfectas para codigo: localizar template, copiar arboles, preservar carpetas en `--force`, detectar directorios, proponer codigos de area, actualizar placeholders en varios Markdown y escribir `config.yml`.

Propuesta:

```bash
node scripts/planning-init.mjs --blank
node scripts/planning-init.mjs --force
node scripts/planning-init.mjs --detect --format markdown
```

La parte interactiva puede seguir coordinada por la skill, pero el inventario y las escrituras deberian ser scriptables. Esto tambien bajaria riesgo de errores al actualizar matrices como `TRACEABILITY-GLOBAL.md`.

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

### 6. Test-suite generation

Skill afectada:

- `plan-test-suite`

Motivo:

Esta ya tiene la arquitectura correcta: la skill prefiere `.planning/scripts/generate-test-suite.sh`. El problema pendiente es que todavia incluye un fallback manual largo y reglas que deberian vivir en el script.

Propuesta:

- mover todo el fallback schema al script;
- hacer que el script emita `--format json|markdown`;
- dejar la skill como invocador del script y lector de warnings.

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
node .planning/scripts/planning-report.mjs standup
node .planning/scripts/planning-report.mjs export <planning-id> --format pr|tickets|markdown
```

La skill conservaria el tono y la sintesis ejecutiva; el script entregaria datos normalizados.

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

- no reemplazarlas completas al inicio;
- extraer helpers de bajo nivel: `next-story-id`, `story-path`, `update-index`, `split-acceptance-criteria`, `append-edge-case`;
- dejar a la skill el diagnostico de gaps y la decision de contenido.

### 9. Lifecycle file moves

Skills afectadas:

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

## Skills que conviene mantener pesadas por ahora

### `plan-task`

Es la skill mas grande y tambien la mas dificil de convertir completa. Tiene mucha automatizacion posible, pero ejecuta codigo real, maneja git, tests, smoke checks, review humano, PRs y correcciones. Conviene extraer subrutinas, no reemplazarla de golpe.

Extracciones recomendadas:

- branch naming y preflight git;
- deteccion de task/story/planning paths;
- actualizacion de status en task + story index;
- derivacion de commit message;
- staging allowlist desde `Affected files`;
- lectura de config defaults;
- ejecucion de test-suite gates.

### `plan-story`

Debe seguir coordinando el flujo humano y PRs, pero puede apoyarse en helpers para:

- detectar siguiente task elegible;
- verificar task PR mergeado;
- actualizar story status;
- derivar story branch;
- generar reporte final.

### `plan-atomize`

Tiene criterio real para dividir trabajo, pero puede delegar:

- escritura de archivos desde template;
- actualizacion de tabla de tareas;
- validacion post-atomizacion;
- generacion de suites.

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

## Primer corte aplicado

Primer corte aplicado en este checkout:

- `planning-template/scripts/planning-check.mjs` centraliza `health`, `validate` y `task-validate`.
- `plan-health`, `plan-validate` y `plan-task-validate` quedaron como wrappers read-only del script.
- La salida Markdown se mantiene para uso humano y el script tambien soporta `--format json`.
- `scripts/verify-plugin.sh` ahora exige el script y valida su sintaxis con `node --check` cuando Node esta disponible.

Este corte reduce bastante contexto, baja drift entre tres skills grandes y no cambia el flujo creativo del plugin.
