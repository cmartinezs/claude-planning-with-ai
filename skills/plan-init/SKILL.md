---
name: plan-init
description: Initialize the planning system in the current project. Creates the .planning/ directory structure (workflows, templates, tutorial, glossary) from the plugin's planning-template/, then discovers the project structure to configure area codes. Run once per project before using any other plan-* commands.
argument-hint: [--blank] [--force]
allowed-tools: [Read, Write, Bash]
---

# plan-init

Initialize the `.planning/` directory structure in the current project.

## Arguments

`$ARGUMENTS` — format: `[--blank] [--force]`

- *(no arguments)* — initialize `.planning/` and run interactive area discovery
- `--blank` — initialize without area discovery; area tables left as placeholders for manual editing
- `--force` — refresh system files even if `.planning/` already exists. It preserves project-specific workspace files such as `active/`, `finished/`, `config.yml`, `GUIDE.md`, `TRACEABILITY-GLOBAL.md`, `SMOKE-TESTS.md`, `LOGGING.md`, `_template/`, and SDLC area guidance.

## Steps

### 1 — Workspace boundary

Use the current directory as the only initialization target:

- Create or reinitialize only `./.planning/`.
- Do not search parent directories for an existing `.planning/`.
- Do not reuse a parent `.planning/` when the current directory is a monorepo child artifact.
- If a parent directory also has `.planning/`, treat it as a separate coordinating workspace.

### 2 — Locate the init script

Find the plugin template directory, then use its init script:

```bash
node <planning-template>/scripts/planning-init.mjs $ARGUMENTS --format markdown
```

When developing this plugin repo directly, `<planning-template>` is `./planning-template`.
When installed, locate it from the installed plugin path or fall back to a `~/.claude` search for `claude-planning-with-ai/.../planning-template`.

### 3 — Review areas before writing

If neither `--blank` nor `--force` was passed, first run:

```bash
node <planning-template>/scripts/planning-init.mjs --detect-only --format markdown
```

Show the proposed area mapping to the user. If the user accepts it, continue with the normal init command.

If the user asks for changes, write a temporary JSON array with the confirmed areas and pass it as `--areas-file <path>`. Each item must have:

```json
{ "code": "AP", "dir": "api", "stack": "Java / Maven", "description": "backend service" }
```

### 4 — Run initialization

Run the script with the original arguments and any confirmed options:

```bash
node <planning-template>/scripts/planning-init.mjs $ARGUMENTS [--areas-file <path>] [--project-mode <mode>] [--base-branch <branch>] --format markdown
```

The script owns:

- `.planning/` existence checks
- template copying
- `--force` preservation of existing project-specific files, including `active/`, `finished/`, `config.yml`, `GUIDE.md`, `TRACEABILITY-GLOBAL.md`, `SMOKE-TESTS.md`, `LOGGING.md`, `_template/`, and SDLC area guidance
- top-level directory scan and area code proposal
- AREA file generation
- GUIDE, TRACEABILITY-GLOBAL, local TRACEABILITY template, and SDLC area README table updates
- `.planning/config.yml` generation
- active/finished index initialization

If the script fails, report its error verbatim and stop. Do not manually recreate partial initialization steps after a failed script run.

### 5 — Report

Report the script output verbatim, then add:

- `.planning/` path initialized
- configured areas, or that area configuration was skipped
- base branch and project mode from `.planning/config.yml`
- next suggested command:
  - `/plan-new NNN-slug -- intent`
  - `/plan-from-epic NNN path/to/epic/`
