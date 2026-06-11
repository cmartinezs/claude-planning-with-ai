---
name: plan-init
description: Initialize the planning system in the current project. Creates the .planning/ directory structure (workflows, templates, tutorial, glossary) from the plugin's planning-template/, then discovers the project structure to configure area codes. Run once per project before using any other plan-* commands.
argument-hint: [--blank] [--force]
allowed-tools: [Read, Write, Bash, Glob]
---

# plan-init

Initialize the `.planning/` directory structure in the current project.

## Arguments

`$ARGUMENTS`
- *(no arguments)* — initialize `.planning/` and run interactive area discovery
- `--blank` — initialize without area discovery; area tables left as placeholders for manual editing
- `--force` — reinitialize system files even if `.planning/` already exists (preserves `active/`, `finished/`, and existing area configuration)

## Steps

### 1 — Determine context

Determine the current working directory. Note the project name (last segment of the path).

### 2 — Check existing state

- If `.planning/` already exists and `--force` was NOT passed → stop and report: "`.planning/` already exists. Use `--force` to reinitialize system files without touching active plannings or area configuration."
- If `.planning/` already exists and `--force` was passed → proceed, but do NOT touch `.planning/active/`, `.planning/finished/`, or any `AREA-*.md` files in `WORKFLOWS/05-SDLC-PHASE-GUIDANCE/`.

### 3 — Locate the plugin template

Find the plugin's `planning-template/` directory:
```bash
cat ~/.claude/plugins/installed_plugins.json \
  | python3 -c "import json,sys; d=json.load(sys.stdin)['plugins']; \
    matches=[p['installPath'] for k,v in d.items() for p in v if 'claude-planning-with-ai' in k]; \
    print(matches[0] if matches else '')"
```
If not found, fall back to:
```bash
find ~/.claude -name "planning-template" -type d 2>/dev/null | grep claude-planning-with-ai | head -1
```

### 4 — Copy template files

Copy all files from `planning-template/` to `.planning/` in the current project:
- Use `cp -r` for the full directory tree.
- If `--force`: skip `active/`, `finished/`, and `WORKFLOWS/05-SDLC-PHASE-GUIDANCE/AREA-*.md` during copy (preserve existing user configuration).
- Preserve directory structure exactly.

### 5 — Initialize index files

Create `.planning/active/README.md` and `.planning/finished/README.md` if they don't exist (do not overwrite if they do).

### 6 — Set project metadata

Update `.planning/README.md`: set the project name to the current directory name, set the date to today.

### 7 — Project area discovery

**Skip this step if:**
- `--blank` was passed, OR
- `--force` was passed (area config already exists from original init)

Otherwise, run the interactive area discovery:

#### 7a — Scan top-level directories

```bash
find . -maxdepth 1 -mindepth 1 -type d \
  ! -name '.*' \
  ! -name '.planning' \
  ! -name 'node_modules' \
  ! -name '__pycache__' \
  ! -name 'target' \
  ! -name 'build' \
  ! -name 'dist' \
  ! -name 'out' \
  ! -name '.next' \
  | sed 's|^\./||' \
  | sort
```

#### 7b — Detect technology context per directory

For each directory found, check for indicator files:

| Indicator | Detected stack |
|-----------|---------------|
| `package.json` | JavaScript / TypeScript — check `package.json` for Next.js, Express, Vite, etc. |
| `pom.xml` or `build.gradle*` | Java / JVM |
| `pyproject.toml` or `requirements.txt` | Python |
| `go.mod` | Go |
| `*.tf` files or a `terraform/` subdirectory | Infrastructure (Terraform) |
| Only `*.md` or `*.rst` files, no code | Documentation |
| None of the above | Generic code area |

#### 7c — Propose area codes

Derive a 2–4 uppercase letter code for each directory using these default mappings (first match wins):

| Directory name contains | Proposed code |
|------------------------|--------------|
| `api`, `backend`, `server` | `AP` |
| `web`, `frontend`, `ui`, `client` | `WB` |
| `docs`, `documentation`, `doc` | `DO` |
| `infra`, `infrastructure`, `terraform`, `deploy` | `IN` |
| `agent`, `agents`, `ai`, `ml` | `AG` |
| `mobile`, `ios`, `android` | `MB` |
| `lib`, `shared`, `common`, `core` | `LB` |
| `services`, `svc` | `SV` |
| `packages` (monorepo root) | scan subdirectories and propose one code per package |
| (no match) | first 2 letters of directory name, uppercased |

If two directories would get the same code, append a digit to disambiguate (e.g. `AP1`, `AP2`).

Always append `W | .planning/ — planning system (this directory)` as the last area.

#### 7d — Present and confirm

Display the proposed mapping:

```
Estructura del proyecto detectada:

  DO | docs/        — documentación (markdown)
  AP | api/         — Java / Spring Boot backend
  WB | web/         — Next.js frontend
  IN | infra/       — Terraform infrastructure
  W  | .planning/   — planning system (este directorio)

¿Es correcta esta configuración? (Enter para confirmar, o describe los cambios)
Ejemplos: "renombra AP a BE", "elimina IN", "agrega SV para services/", "los codes están bien pero web/ es React no Next.js"
```

Apply any adjustments the user requests. Wait for final confirmation before proceeding.

#### 7e — Generate AREA files

For each confirmed area (all except `W`), create `.planning/WORKFLOWS/05-SDLC-PHASE-GUIDANCE/AREA-<CODE>-<dirname>.md`:

```markdown
# Area <CODE> — <dirname>/

> [← README](README.md)
>
> **Generated by plan-init.** Update the stack details, doc references, and rules to match your project.

**What This Area Is**: <one-line description based on detected stack and directory name>

---

| Item | Value |
|------|-------|
| Area code | `<CODE>` |
| Directory | `<dirname>/` |
| Stack | <detected stack, or "[fill in your stack]"> |
| Key doc references | [Which docs govern contracts for this area? Fill in.] |

**Key Checks**: [`[CHECK-AGNOSTIC-BOUNDARY]`](../04-SUB-WORKFLOWS/CHECK-AGNOSTIC-BOUNDARY.md)

---

## Done Criteria

- [ ] Output placed in the correct directory under `<dirname>/`
- [ ] Follows the naming and structure conventions of `<dirname>/`
- [ ] No contradictions introduced with existing documentation
- [ ] TRACEABILITY.md updated with any new terms introduced

---

## Key Rules

- [Add the architectural rules and constraints that govern this area]

---

> [← README](README.md)
```

#### 7f — Update WORKFLOWS/05-SDLC-PHASE-GUIDANCE/README.md

Replace the "Area Quick Reference" placeholder table with the project's actual areas:

```markdown
| Code | Area | Key Doc References | File |
|------|------|--------------------|------|
| DO  | `docs/` — documentation          | [fill in] | [AREA-DO-docs.md](AREA-DO-docs.md) |
| AP  | `api/` — backend service          | [fill in] | [AREA-AP-api.md](AREA-AP-api.md)   |
| ...  | ...                              | ...       | ...                                |
| W   | `.planning/` — meta-workflow      | *(built-in)* | *(built-in)*                    |
```

#### 7g — Update .planning/GUIDE.md

Replace the `<!-- AREAS-TABLE -->` placeholder table with the project's actual area codes and descriptions.

#### 7h — Update .planning/TRACEABILITY-GLOBAL.md

- Replace the `<!-- AREAS-REF -->` placeholder table with the project's actual area codes.
- Replace the `<!-- MATRIX-HEADER -->` placeholder matrix header with actual area columns — insert one column per area (in the same order as GUIDE.md) between `Source Planning` and the `W` column.
- Update any existing rows (bootstrap rows) to add `N/A` in the new area columns.

#### 7i — Update .planning/_template/TRACEABILITY.md

- Replace the `<!-- AREAS-REF -->` placeholder table with the project's actual area codes.
- Replace the `<!-- MATRIX-HEADER -->` placeholder matrix header to include one column per area between `Term / Concept` and `Notes`.

### 8 — Report

```
.planning/ initialized in [project path]

Areas configured:
  <CODE> | <dirname>/  — <description>
  <CODE> | <dirname>/  — <description>
  W      | .planning/  — planning system

Structure created:
  .planning/
  ├── _template/
  ├── WORKFLOWS/
  │   └── 05-SDLC-PHASE-GUIDANCE/
  │       ├── AREA-<CODE>-<dirname>.md   ← one per area
  │       └── ...
  ├── TUTORIAL/
  ├── active/          (empty — ready for plannings)
  ├── finished/        (empty)
  ├── GUIDE.md         ← area table filled in
  ├── GLOSSARY.md
  └── README.md

Next steps:
  /plan-new NNN-slug -- intent          Start a planning from scratch
  /plan-from-epic NNN path/to/epic/     Generate planning from existing stories
```

If `--blank` was passed, omit the "Areas configured" section and add:
```
  Area configuration skipped (--blank). Edit GUIDE.md and WORKFLOWS/05-SDLC-PHASE-GUIDANCE/ manually,
  or delete .planning/ and run /plan-init again without --blank.
```
