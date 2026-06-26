# Priorización

## Orden sugerido de implementación

1. Corregir referencias a comandos inexistentes y `scope/story` en docs activos.
2. Actualizar `docs/reference.md` con los 44 comandos reales.
3. Corregir `skills/plan-story/SKILL.md` por `/plan-advance`.
4. Alinear estados válidos entre glossary, validate, done, skip, standby y releases.
5. Reducir y actualizar metadata de plugin y marketplace.
6. Agregar modo de proyecto general en `config.yml` y adaptar templates de verificación.
7. Crear fuente única de comandos o script de validación.
8. Revisar workflows huérfanos y decidir si completar, conectar o archivar.

## Archivos con mayor prioridad

1. `docs/user-guide.md` — guía principal desactualizada por `scope`.
2. `docs/reference.md` — referencia de comandos incompleta y con comando inexistente.
3. `.claude-plugin/marketplace.json` — metadata pública con `plan-scope`.
4. `skills/plan-story/SKILL.md` — sugiere `/plan-advance`, inexistente.
5. `skills/plan-validate/SKILL.md` — no reconoce todos los estados actuales.
6. `docs/developer-guide.md` — mantiene términos antiguos y nombre antiguo del plugin.
7. `CHANGELOG.md` — enlaces de versión incompletos.
8. `planning-template/_template/02-deepening/task-NN-name.md` — demasiado software-first para proyectos generales.
9. `planning-template/config.yml` — buen punto para configurar modos.
10. `README.md` — tabla resumida no refleja toda la superficie actual.
