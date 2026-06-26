# Redundancias detectadas

## 1. `/us-enrich` vs `/plan-enrich-story`

1. `us-enrich` trabaja sobre backlog o story-shaped documents externos.
2. `plan-enrich-story` trabaja sobre story ya creada dentro de `.planning/active/`.
3. Redundancia aceptable, pero debe documentarse mejor.
4. Mejora: compartir checklist de enriquecimiento para no divergir.

## 2. `/epic-enrich` vs `/plan-enrich-epic`

1. `epic-enrich` agrega stories al container de producto.
2. `plan-enrich-epic` agrega stories al planning activo.
3. El nombre `plan-enrich-epic` es confuso porque no modifica un epic real.
4. Mejora: mantener comando por compatibilidad, pero documentar alias conceptual `/plan-add-story`.

## 3. `/us-split` vs `/plan-split-story`

1. `us-split` divide backlog antes de planificar.
2. `plan-split-story` divide una story de ejecución durante el planning.
3. Redundancia necesaria por capas.
4. Mejora: agregar una matriz "si la story está en backlog usa X; si ya está en planning usa Y".

## 4. `/plan-health` vs `/plan-validate`

1. `plan-health` es global.
2. `plan-validate` es por planning.
3. Redundancia útil pero nombres podrían confundirse.
4. Mejora: README debe decir "health = sistema completo; validate = planning específico".

## 5. `/doc-task`, `/doc-story` y `/doc-generate`

1. `doc-generate` contiene la lógica real.
2. `doc-task` y `doc-story` son wrappers.
3. Redundancia útil para invocación explícita y automatización.
4. Mejora: documentar que wrappers existen por ergonomía, no por lógica distinta.

## 6. `/plan-report`, `/plan-export`, `/plan-standup`, `/release-status`

1. Todos producen vistas de estado o comunicación.
2. Se diferencian por audiencia:
   - standup: daily update
   - report: resumen ejecutivo
   - export: artefacto externo
   - release-status: entrega/versionado
3. Mejora: agregar tabla "qué salida necesito".

## 7. `README.md`, `docs/reference.md`, `.page/locales/commandsPage.*`

1. Hay tres inventarios de comandos con niveles de actualización distintos.
2. Riesgo alto de drift.
3. Mejora: generar al menos parte de la referencia desde `skills/*/SKILL.md`, o crear un `commands.yml` canónico.
