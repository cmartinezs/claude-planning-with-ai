# Cambios concretos recomendados

## 1. Completar migración `scope` -> `story`

1. Archivos a modificar:
   - `.claude-plugin/marketplace.json`
   - `docs/reference.md`
   - `docs/user-guide.md`
   - `docs/developer-guide.md`
   - `skills/plan-story/SKILL.md`
   - `skills/plan-agent-plan/SKILL.md`
   - `planning-template/TUTORIAL/reference.md`
   - `planning-template/_template/02-deepening/task-NN-name.md`
2. No cambiar usos válidos de "scope" como alcance general:
   - `Approximate Scope`
   - `## Scope` en releases
   - "in scope / out of scope"
3. Sí cambiar usos que representan el concepto antiguo:
   - `scope-NN`
   - `/plan-scope`
   - `scope file`
   - `scope table`
   - `scope status`
   - `doc-scope`

## 2. Corregir comando inexistente

1. Archivo: `skills/plan-story/SKILL.md`.
2. Problema: recomienda `/plan-advance <planning-id>`, pero no existe `skills/plan-advance/`.
3. Reemplazo recomendado: sugerir `/plan-status` y luego `/plan-story <planning-id> <next-story-id>`.

## 3. Alinear estados válidos

1. Archivos:
   - `skills/plan-validate/SKILL.md`
   - `skills/plan-agent-validate/SKILL.md`
   - `skills/plan-done/SKILL.md`
   - `skills/plan-story-skip/SKILL.md`
   - `planning-template/GLOSSARY.md`
2. Estados a documentar con política clara:
   - `TODO`
   - `IN PROGRESS`
   - `DONE`
   - `BLOCKED`
   - `SKIPPED`
   - `STANDBY`
   - `SUPERSEDED` si aplica a planning, no necesariamente story.

## 4. Completar referencia de comandos

1. Archivo principal: `docs/reference.md`.
2. Fuente de verdad: directorios bajo `skills/`.
3. Debe incluir 44 comandos actuales:
   - 3 `doc-*`
   - 1 `epic-*`
   - 31 `plan-*`
   - 5 `release-*`
   - 4 `us-*`
4. Actualizar `README.md` con una tabla resumida y enlazar a la referencia completa.

## 5. Agregar soporte explícito para proyectos generales

1. Archivos:
   - `planning-template/config.yml`
   - `skills/plan-init/SKILL.md`
   - `planning-template/GLOSSARY.md`
   - `planning-template/_template/02-deepening/task-NN-name.md`
   - `skills/plan-task/SKILL.md`
   - `skills/plan-atomize/SKILL.md`
2. Agregar modo de proyecto para ajustar lenguaje y verificaciones.
3. Evitar que todos los proyectos requieran tests unitarios, PRs, git o ADRs.
