# Nuevas ideas

## 1. `commands.yml` como fuente única

1. Crear `commands.yml` con `name`, `category`, `usage`, `description`, `source`, `audience` y `project modes`.
2. Generar desde ahí README summary, `docs/reference.md` y landing commands page.
3. Reduciría drift entre docs y skills.

## 2. Modo de proyecto configurable

1. Ejemplo para software:
   ```yaml
   project:
     type: software
   execution:
     requires_git: true
     requires_tests: true
   terminology:
     planning_item: story
     verification_label: Unit Tests
   ```
2. Ejemplo para proyectos generales:
   ```yaml
   project:
     type: general
   execution:
     requires_git: false
     requires_tests: false
   terminology:
     planning_item: deliverable
     verification_label: Verification Evidence
   ```

## 3. Comando `/plan-doctor`

1. Combinar chequeos de comandos inexistentes, drift `scope/story`, estados no reconocidos, archivos faltantes y changelog links.
2. Podría vivir como skill o script de mantenimiento del repo.
3. Diferente de `/plan-health`, porque revisaría el plugin instalado o el repo del plugin, no una `.planning/` de usuario.

## 4. Comando `/plan-next`

1. Mostrar la siguiente acción recomendada.
2. Resolvería la necesidad que hoy aparece como `/plan-advance` inexistente.
3. Ejemplos:
   - planning en INITIAL -> `/plan-expand`
   - story TODO con tareas faltantes -> `/plan-atomize`
   - task pendiente -> `/plan-task`
   - todas DONE -> `/plan-validate` y `/plan-archive`

## 5. Comando `/plan-audit-docs`

1. Revisar docs generados por `doc-*`.
2. Detectar docs faltantes por story/task.
3. Detectar stale docs después de cambios.
4. Útil para proyectos software y documentación.

## 6. Plantilla de proyecto general

1. Agregar `planning-template/WORKFLOWS/05-PROJECT-GUIDANCE/`.
2. Incluir ejemplos por tipo: investigación, evento, documentación, operación interna y producto sin código.
3. Evitar que el usuario no técnico vea SDLC como único camino.

## 7. Niveles de autonomía

1. Agregar política:
   - `manual`: cada done criteria requiere confirmación
   - `assisted`: confirma por story
   - `autonomous`: confirma solo al inicio y al cierre
2. Integrar con `/plan-run`.
3. Registrar el modo usado en reportes.

## 8. Sistema de riesgos

1. Agregar campos de riesgo en story y task.
2. Usar riesgo para decidir atomización obligatoria, revisión manual, evidencia más fuerte y bloqueo de archive.

## 9. Integración con issues externos

1. Exportar planning a GitHub Issues, Jira o Linear mediante formatos.
2. Mantener el core markdown-first.
3. Agregar IDs externos en `01-expansion.md`.

## 10. Métricas de planning

1. Medir stories por planning, tareas por story, tiempo en estados, blockers frecuentes y residuals.
2. Generar reporte con `/plan-report --metrics`.

## 11. Librería de snippets de prompts

1. Extender `planning-template/PROMPTING.md`.
2. Incluir prompts para crear planning, dividir story, validar done criteria, escribir ADR, revisar riesgo y adaptar a proyecto no software.

## 12. Validación de compatibilidad del plugin

1. Agregar script local para revisar frontmatter de skills, comandos documentados, workflows referenciados y comandos legacy en docs activos.
2. Ejecutarlo en CI.
