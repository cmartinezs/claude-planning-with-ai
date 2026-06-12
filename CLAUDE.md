# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A Claude Code plugin that provides structured lifecycle planning for software projects. It ships as:
- **Skills** (`skills/<command>/SKILL.md`) — the Claude Code commands the plugin exposes
- **Planning template** (`planning-template/`) — the directory tree copied into user projects by `/plan-init`
- **Landing page** (`.page/`) — a Next.js/Tailwind static marketing site
- **Plugin manifest** (`.claude-plugin/plugin.json`) — name, version, author metadata

## Commands

All landing-page commands must be run from `.page/`:

```bash
cd .page
npm run dev      # Local dev server
npm run build    # Type-check + static export (run before handing off)
npm run lint     # Next.js ESLint
```

There is **no automated test suite** for the plugin itself. Validate skill or workflow changes by reading the affected `SKILL.md` and checking related files in `planning-template/`.

## Architecture

### Plugin skills

Each directory under `skills/` maps to one slash command. The `SKILL.md` in each directory is the command implementation — it defines the `name`, `description`, `allowed-tools`, and step-by-step instructions Claude follows. Skill directory names use kebab-case matching the command name (e.g. `plan-from-epic/`).

### Planning template

`planning-template/` is the scaffold copied verbatim into `.planning/` of user projects. It contains:

| Path | Purpose |
|------|---------|
| `_template/` | Blueprint for each new planning (`00-initial.md`, `01-expansion.md`, `02-deepening/`, `TRACEABILITY.md`) |
| `WORKFLOWS/` | Workflow definitions referenced by task steps (5 groups: Planning, Execution, Maintenance, Sub-workflows, SDLC Guidance) |
| `TUTORIAL/` | Flow guides for new users |
| `GLOSSARY.md` | Operational vocabulary — the authoritative definition of all system terms |
| `GUIDE.md` | Lifecycle reference and naming conventions |

### Planning lifecycle

```
INITIAL → EXPANSION → DEEPENING → COMPLETED
```

- **INITIAL** (`00-initial.md`) — Undimensioned idea, intent only
- **EXPANSION** (`01-expansion.md`) — Transversal scopes identified, dependencies mapped
- **DEEPENING** (`02-deepening/scope-NN-*.md`) — One file per scope with tasks and done criteria
- **COMPLETED** — Archived to `finished/`; documents are read-only after this

Plannings in INITIAL live at `planning/NNN-name/`. They move to `planning/active/NNN-name/` on EXPANSION and to `planning/finished/NNN-name/` on COMPLETED.

### Workflows

Every task in every scope must reference a workflow ID from `WORKFLOWS/`. The four main groups are:

- `01-PLANNING-WORKFLOWS/` — CREATE-PLANNING, ADVANCE-PLANNING
- `02-EXECUTION-WORKFLOWS/` — GENERATE-DOCUMENT, REVIEW-COHERENCE, EXPAND-ELEMENT, INTEGRATE-MILESTONE
- `03-MAINTENANCE-WORKFLOWS/` — UPDATE-TRACEABILITY, RECORD-INCONSISTENCY, CASCADE-CHANGE, AUDIT-PLANNING, etc.
- `04-SUB-WORKFLOWS/` — Reusable step sequences embedded via `[SUB-WORKFLOW-NAME]`

### Validation

There is no compiler or schema engine — the markdown files are the only representation. Structural integrity is checked by the `/plan-validate` skill, which verifies planning structure (file locations per state, scope table ↔ scope file consistency, workflow IDs against the `WORKFLOWS/` catalog, dependency references) directly from the markdown.

## Coding conventions

**Plugin content (Markdown):** Keep headings descriptive, command examples in fenced blocks, terminology aligned with `planning-template/GLOSSARY.md`.

**Landing page (TypeScript/React):** PascalCase component filenames, two-space indentation, Tailwind utility classes, concise component-local data structures. Do not edit generated output in `.page/.next/`.

## Key constraint

When changing a skill command, update all related references in `planning-template/` (README, TUTORIAL, workflow docs) in the same pass.
