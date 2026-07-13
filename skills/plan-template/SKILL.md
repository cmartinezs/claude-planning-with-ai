---
name: plan-template
description: Generate an idea document that captures a planning initiative in enough detail to feed directly into `/plan-new`. The document is saved to `.planning/ideas/` and can be filled interactively (Claude as
argument-hint: [slug] [--interactive | --blank]
allowed-tools: [Read, Write, Bash, Glob, WebFetch]
---

Generate an idea document that captures a planning initiative in enough detail to feed directly into `/plan-new`. The document is saved to `.planning/ideas/` and can be filled interactively (Claude asks questions) or left as a blank template to fill manually.

## Arguments

`$ARGUMENTS` — format: `[slug] [--interactive | --blank]`

- `slug` — optional kebab-case name for the idea (e.g. `user-auth-api`). If omitted, Claude prompts for one.
- `--interactive` — Claude asks questions one by one and fills the template from your answers. **(default)**
- `--blank` — creates an empty template and exits immediately for manual editing.

Examples:
```
/plan-template user-auth-api
/plan-template user-auth-api --blank
/plan-template --interactive
```

## Steps

0. **Workspace boundary.** Use only `./.planning/` in the current working directory. Do not search parent directories for `.planning/`. If `./.planning/` does not exist, stop and ask the user to run `/plan-init` in the current directory.

1. Parse `$ARGUMENTS`:
   - Extract slug if provided (any token without `--`).
   - Determine mode: `--blank` → blank mode; `--interactive` or no flag → interactive mode.
   - If no slug given: ask "¿Cómo quieres llamar esta idea? (kebab-case, ej: `user-auth-api`)" and wait for input.

2. Determine output path: `./.planning/ideas/<slug>.md`. Create the `.planning/ideas/` directory in the current directory if it doesn't exist.

3. **Blank mode:** write the template below with all placeholders intact. Report the file path and exit.

4. **Interactive mode:** ask the following questions **one at a time**, waiting for each answer before proceeding. Skip a question if the user says "skip" or leaves it blank.

   | # | Question | Maps to section |
   |---|----------|----------------|
   | 1 | ¿Qué necesita hacerse? Descríbelo en una sola oración. | `Intent` |
   | 2 | ¿Por qué existe esta iniciativa? ¿Qué problema resuelve o qué valor entrega? | `Why` |
   | 3 | ¿Cuál es el resultado concreto que debería existir cuando esto esté listo? | `Desired Outcome` |
   | 4 | ¿Qué áreas o repos se ven afectados? (docs / web / api / agents / infra — puede ser más de uno) | `Approximate Scope` |
   | 5 | ¿Hay restricciones conocidas? (fecha límite, decisiones ya tomadas, dependencias externas) | `Constraints` |
   | 6 | ¿Qué no sabes todavía o qué necesita más investigación antes de poder ejecutar esto? | `Open Questions` |

5. Write the populated template to `.planning/ideas/<slug>.md` using the structure below. For skipped questions, keep the placeholder text.

6. Report:
   - File created at `.planning/ideas/<slug>.md`
   - Which sections were filled vs. left as placeholders.
   - Suggest the command to use next: `/plan-new NNN-<slug> @.planning/ideas/<slug>.md`

---

## Template structure to write

```markdown
# Idea: <slug>

> Documento de captura de idea pre-planning. Úsalo con:
> `/plan-new NNN-<slug> @.planning/ideas/<slug>.md`

---

## Intent

> *Qué necesita hacerse, en una sola oración.*
> Ejemplo: `Agregar recuperación de contraseña por email para API y web.`

[Describe the intent here.]

---

## Why

> *Por qué existe esta iniciativa. Qué problema resuelve o qué valor entrega.*
> Ejemplo: `Hoy soporte debe resetear cuentas manualmente. Esto reduce carga operativa y mejora la autonomía del usuario.`

[Describe motivation and context.]

---

## Desired Outcome

> *Qué resultado concreto debería existir cuando esto esté listo.*
> Ejemplo: `Un usuario puede solicitar un link, recibirlo, definir una nueva contraseña y volver a iniciar sesión sin intervención manual.`

[Describe the expected outcome.]

---

## Approximate Scope

> *Qué áreas o repos se ven afectados. No necesita ser exhaustivo.*
> Ejemplo: marca `api/` si hay endpoints, `web/` si hay pantallas, `docs/` si hay runbook o guía de soporte.

- [ ] `docs/` — [brief note]
- [ ] `web/` — [brief note]
- [ ] `api/` — [brief note]
- [ ] `agents/` — [brief note]
- [ ] `infra/` — [brief note]

---

## Constraints

> *Restricciones conocidas: fechas límite, decisiones ya tomadas, dependencias externas.*
> Ejemplo: `Debe usar el proveedor de email existente; no se agregan cambios de infraestructura en este planning.`

[None identified yet.]

---

## Open Questions

> *Qué no se sabe todavía o necesita investigación antes de ejecutar.*

- [ ] [Example: Should reset links expire after 15 minutes or 1 hour?]
- [ ] [Question 1]

---

## Metadata

- **Captured by:** [human / AI agent]
- **Date:** YYYY-MM-DD
- **Related planning (if continuation):** none

Example:

- **Captured by:** human
- **Date:** 2026-07-12
- **Related planning (if continuation):** 004-auth-cleanup
```
