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
- `02-EXECUTION-WORKFLOWS/` — ATOMIZE-SCOPE, GENERATE-DOCUMENT, REVIEW-COHERENCE, EXPAND-ELEMENT, INTEGRATE-MILESTONE
- `03-MAINTENANCE-WORKFLOWS/` — UPDATE-TRACEABILITY, RECORD-INCONSISTENCY, CASCADE-CHANGE, AUDIT-PLANNING, etc.
- `04-SUB-WORKFLOWS/` — Reusable step sequences embedded via `[SUB-WORKFLOW-NAME]`

### Validation

There is no compiler or schema engine — the markdown files are the only representation. Structural integrity is checked by the `/plan-validate` skill, which verifies planning structure (file locations per state, scope table ↔ scope file consistency, workflow IDs against the `WORKFLOWS/` catalog, dependency references, atomized task folders) directly from the markdown. The `/plan-task-validate` skill audits atomic task files against the `[CHECK-ATOMICITY]` requirements.

## Coding conventions

**Plugin content (Markdown):** Keep headings descriptive, command examples in fenced blocks, terminology aligned with `planning-template/GLOSSARY.md`.

**Landing page (TypeScript/React):** PascalCase component filenames, two-space indentation, Tailwind utility classes, concise component-local data structures. Do not edit generated output in `.page/.next/`.

## Key constraint

When changing a skill command, update all related references in `planning-template/` (README, TUTORIAL, workflow docs) in the same pass.

When bumping the plugin version with a patch or minor release, update the existing `planning-template/update-version/<previous-major>-<current-major>.md` migration so the current major migration remains cumulative. Only a new major version should add a new adjacent update-version migration file. Do not create skip migrations such as `2-4.md`; `/plan-update-version 2.x 4.x` applies `2-3.md` and then `3-4.md`.

Planning commands must use the current working directory's `./.planning/` only. Never search parent directories for `.planning/`. In monorepos, parent and child artifact planning workspaces are independent; a parent planning may coordinate linked child plannings, but child implementation must be planned in the child artifact's own `.planning/`.

When a parent planning creates or coordinates child plannings under git, each child planning must run from its own sibling worktree, created with the planning branch that belongs to that child. Use `git worktree add ../<worktree-prefix> <branch>` for existing branches or `git worktree add -b <branch> ../<worktree-prefix> <base_branch>` for new ones. Preserve the worktree prefix at the start of every child branch name, before the story/task portion, for example `<worktree-prefix>/story-NN-<slug>` and `<worktree-prefix>/story-NN-<slug>/task-NN-<slug>`.

For the layered git workflow, task branches are local working branches only until their PR is merged into the story branch. After a task PR is merged, delete the local task branch with `git branch -d <task-branch>` from an updated story branch checkout. After the final story PR is merged into `git.base_branch` (for example `develop`), delete the local story branch with `git branch -d <story-branch>` from an updated base branch checkout. Do not force-delete branches, and leave remote branch deletion to the PR/repository workflow.
