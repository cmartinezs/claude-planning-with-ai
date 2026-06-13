# Planning with AI — Developer Guide

Architecture, internals, and contribution reference for the `planning-system` plugin.

---

## Local development setup

Claude Code's `/plugin install --local` flag is not yet functional. The working approach is a symlink that points Claude's plugin directory at your local clone:

```bash
# 1. Clone the repo wherever you keep your projects
git clone git@github.com:cmartinezs/claude-planning-with-ai.git ~/dev/claude-planning-with-ai

# 2. Link it into Claude's user plugin directory
mkdir -p ~/.claude/plugins
ln -s ~/dev/claude-planning-with-ai ~/.claude/plugins/claude-planning-with-ai
```

Claude Code looks for plugins in `~/.claude/plugins/` and reads `<plugin-dir>/.claude-plugin/plugin.json` to discover each one. The symlink makes any change to the local repo immediately visible to Claude — no reinstall or restart needed.

**If you move the repo,** remove the old symlink and recreate it:
```bash
rm ~/.claude/plugins/claude-planning-with-ai
ln -s /new/absolute/path/to/claude-planning-with-ai ~/.claude/plugins/claude-planning-with-ai
```

**To uninstall:**
```bash
rm ~/.claude/plugins/claude-planning-with-ai
```

---

## Repository structure

```
planning-system/
├── .claude-plugin/
│   └── plugin.json          ← plugin manifest (name, version, author)
├── skills/
│   └── <command>/
│       └── SKILL.md         ← one skill = one slash command
├── planning-template/       ← installed into user projects by /plan-init
│   ├── _template/           ← blueprint for each new planning
│   ├── WORKFLOWS/           ← workflow and sub-workflow definitions
│   ├── TUTORIAL/            ← end-user flow guides
│   ├── active/              ← stub for active plannings
│   ├── finished/            ← stub for finished plannings
│   └── *.md                 ← GUIDE, GLOSSARY, PROMPTING, etc.
├── scripts/
│   └── migrate-commands.sh  ← one-off migration from legacy .claude/commands/ format
├── .page/                   ← Next.js/Tailwind static landing page
│   ├── components/
│   ├── pages/
│   └── styles/
├── docs/
│   ├── user-guide.md        ← this project's functional documentation
│   └── developer-guide.md   ← this file
├── CLAUDE.md                ← instructions for Claude Code when working in this repo
├── AGENTS.md                ← instructions for other AI agents (Codex, etc.)
└── README.md
```

---

## Plugin manifest

`.claude-plugin/plugin.json` is read by Claude Code at install time:

```json
{
  "name": "planning-system",
  "description": "...",
  "version": "1.0.0",
  "author": {
    "name": "cmartinezs",
    "email": "...",
    "url": "https://cmartinezs.github.io"
  }
}
```

The `name` field becomes the plugin identifier. The `version` follows semver.

---

## SKILL.md format

Each directory under `skills/` maps to one slash command. The directory name is the command name (kebab-case). The `SKILL.md` inside has a YAML frontmatter block followed by the command implementation in plain markdown.

### Frontmatter fields

```yaml
---
name: plan-new                     # command name (matches directory name)
description: >                     # shown in /help and used by the model
  One or two sentences describing when this command should be invoked.
argument-hint: <NNN-slug> -- <intent>   # shown to the user when typing the command
allowed-tools: [Read, Write, Bash, Glob]  # tools Claude may use during execution
---
```

**`allowed-tools` values:** `Read`, `Write`, `Edit`, `Bash`, `Glob`, `WebFetch`, `WebSearch`. Only list tools the skill actually needs — fewer tools = narrower blast radius.

### Body

The body is a markdown document that Claude follows as step-by-step instructions. It has access to `$ARGUMENTS` (the raw string the user typed after the command name).

Conventions used across all skills:
- Numbered steps, with sub-steps labeled `a`, `b`, `c`
- Bash commands in fenced blocks when a specific command must be run
- `[SUB-WORKFLOW-NAME]` notation to invoke a sub-workflow by name
- Language: steps are in English; user-facing messages (prompts, reports) can be in Spanish to match the project's target audience

### Example

```markdown
---
name: plan-status
description: Show the current state of all plannings in the `.planning/` system.
allowed-tools: [Read, Bash, Glob]
---

Show the current state of all plannings.

## Steps

1. Read `.planning/README.md` to get plannings in INITIAL state.
2. Read `.planning/active/README.md` to get active plannings.
3. ...
```

---

## Adding a new skill

1. Create `skills/<command-name>/SKILL.md` with the frontmatter and step instructions.
2. Test the skill by invoking `/<command-name>` in a Claude Code session.
3. If the skill references workflows, check that the workflow files exist in `planning-template/WORKFLOWS/`.
4. Update `README.md` command tables and `planning-template/TUTORIAL/reference.md`.
5. Update the landing page `Commands.tsx` if the command is user-facing.

### Naming conventions

- Command names: `kebab-case`, verb-first (`plan-new`, `us-enrich`, `epic-enrich`)
- Planning lifecycle commands: prefixed `plan-`
- Backlog commands: prefixed `us-` (user story) or `epic-`

---

## planning-template/ — what gets installed

`/plan-init` copies the entire `planning-template/` directory tree to `.planning/` in the user's project. This means:

- **Everything in `planning-template/` ships to the user.** Be careful about what you add.
- Files are copied verbatim — no templating engine, no variable substitution at copy time.
- After copying, `plan-init` runs post-processing steps (project name, date, area discovery) to fill in the placeholders.

### Marker comments

Several files contain HTML comment markers that `plan-init` uses as injection points:

| Marker | File | What plan-init injects |
|--------|------|----------------------|
| `<!-- AREAS-TABLE -->` | `GUIDE.md` | Area code + description table |
| `<!-- AREAS-REF -->` | `TRACEABILITY-GLOBAL.md`, `_template/TRACEABILITY.md` | Area code reference table |
| `<!-- MATRIX-HEADER -->` | `TRACEABILITY-GLOBAL.md`, `_template/TRACEABILITY.md` | Matrix header row with one column per area |

If you add a new file to `planning-template/` that needs area-aware content, use the same markers and document the injection in `plan-init/SKILL.md` step 7.

---

## Area discovery (plan-init step 7)

The discovery algorithm runs once, on fresh init (not on `--force` or `--blank`).

### Detection logic

For each top-level directory (excluding hidden, `node_modules`, build outputs):

1. Check for indicator files to determine the stack:
   - `package.json` → JavaScript/TypeScript; inspect for framework (Next.js, Express, Vite…)
   - `pom.xml` / `build.gradle*` → Java/JVM
   - `pyproject.toml` / `requirements.txt` → Python
   - `go.mod` → Go
   - `*.tf` files or `terraform/` subdirectory → Terraform
   - Only `*.md`/`*.rst` files, no code → Documentation
   - No match → Generic

2. Propose a code using the mapping table in `plan-init/SKILL.md` step 7c. If two directories collide, append a digit.

3. Append `W | .planning/ — planning system` as the last area always.

### Post-confirmation writes

After the user confirms the area mapping, plan-init writes:

- `WORKFLOWS/05-SDLC-PHASE-GUIDANCE/AREA-<CODE>-<dir>.md` per area (from the template in SKILL.md step 7e)
- Updates `GUIDE.md` replacing the `<!-- AREAS-TABLE -->` section
- Updates `TRACEABILITY-GLOBAL.md` replacing `<!-- AREAS-REF -->` and `<!-- MATRIX-HEADER -->`
- Updates `_template/TRACEABILITY.md` replacing the same markers

---

## Workflows and sub-workflows

Workflows live in `planning-template/WORKFLOWS/`. They are markdown documents that Claude reads during skill execution — they're not code, they're structured instructions.

### Groups

| Group | Folder | Purpose |
|-------|--------|---------|
| Planning | `01-PLANNING-WORKFLOWS/` | CREATE-PLANNING, ADVANCE-PLANNING |
| Execution | `02-EXECUTION-WORKFLOWS/` | ATOMIZE-SCOPE, GENERATE-DOCUMENT, REVIEW-COHERENCE, EXPAND-ELEMENT, INTEGRATE-MILESTONE |
| Maintenance | `03-MAINTENANCE-WORKFLOWS/` | Traceability, inconsistencies, audits, cascade changes |
| Sub-workflows | `04-SUB-WORKFLOWS/` | Reusable step sequences embedded in other workflows |
| Area guidance | `05-SDLC-PHASE-GUIDANCE/` | Per-area GENERATE-DOCUMENT reference (generated by plan-init) |

### Sub-workflow invocation

Skills and workflows invoke sub-workflows by name using bracket notation:

```
Execute [CHECK-AGNOSTIC-BOUNDARY] — verify output is consistent with docs/ contracts.
```

Claude resolves `[CHECK-AGNOSTIC-BOUNDARY]` by reading `04-SUB-WORKFLOWS/CHECK-AGNOSTIC-BOUNDARY.md` and following its steps.

### Adding a workflow

1. Create the `.md` file in the appropriate group folder.
2. Add it to `WORKFLOWS/README.md` — both the main table and the diagram.
3. If it's a sub-workflow, add it to `04-SUB-WORKFLOWS/README.md`.
4. Update any skill that should invoke it.

---

## Structural validation

There is no compiler, schema engine, or alternative authoring format — the markdown files in `.planning/` are the only representation of a planning. The `/plan-validate` skill provides structural integrity checking: it reads the planning markdown directly and verifies file locations per lifecycle state, scope table ↔ scope file consistency, workflow IDs against the `WORKFLOWS/` catalog, dependency references, and atomized task folders (index ↔ file consistency, required sections, dependency cycles). For deep auditing of atomic tasks against the `[CHECK-ATOMICITY]` requirements, `/plan-task-validate` covers the task level. Both are read-only and report findings without modifying files.

---

## Landing page

The landing page lives in `.page/` and is a Next.js static export.

### Development

```bash
cd .page
npm run dev      # local dev server at localhost:3000
npm run build    # type-check + static export to .page/out/
npm run lint     # ESLint
```

### Component structure

| Component | Section | Content |
|-----------|---------|---------|
| `SplashScreen.tsx` | Intro overlay | Animated intro dismissed on click |
| `Header.tsx` | Fixed nav | Logo + nav links + GitHub CTA |
| `Hero.tsx` | Above fold | Headline, stats (5 lifecycle states, 16 commands…) |
| `Installation.tsx` | `#instalacion` | Two install methods + interactive 4-step demo |
| `WhatItDoes.tsx` | `#que-hace` | 6-feature grid |
| `Lifecycle.tsx` | `#ciclo` | 5-state visual pipeline (INITIAL → ARCHIVE) |
| `Commands.tsx` | `#comandos` | Command cards grouped by category |
| `CTA.tsx` | Bottom CTA | Install + GitHub buttons |
| `Footer.tsx` | Footer | Links + version |

### Conventions

- PascalCase component filenames
- Two-space indentation
- Tailwind utility classes only — no custom CSS except `styles/globals.css`
- Data arrays defined at module level (not inline in JSX) for readability
- No external dependencies beyond Next.js, React, and Tailwind

### Deploying

The static export in `.page/out/` can be served from any static host. The site is configured to deploy to GitHub Pages at `https://cmartinezs.github.io/claude-planning-with-ai`.

---

## Contribution guidelines

### When changing a skill

- Update `README.md` command tables
- Update `planning-template/TUTORIAL/reference.md`
- Update `planning-template/TUTORIAL/` flow guides if the skill affects a user flow
- Update `.page/components/Commands.tsx` if the command is user-facing
- Keep `CLAUDE.md` in sync if the architectural constraint changes

### When changing a workflow

- Update `planning-template/WORKFLOWS/README.md` (table + Mermaid diagram)
- Update any skills that invoke the workflow
- If the workflow is new, add it to the `WORKFLOWS/04-SUB-WORKFLOWS/README.md` (if sub-workflow)

### When changing planning-template/

- Test by running `/plan-init` in a scratch directory
- Verify that all marker comments resolve correctly after plan-init
- Verify that `plan-new` + `plan-expand` produce valid files using the updated templates

### Commit style

Imperative present tense, concise:

```
Add plan-template skill with interactive and blank modes
Fix area discovery collision on identically-named directories
Update Installation.tsx to show area detection step
```

### No automated test suite

There is no test runner for the plugin content. Validation is done by:
1. Reading the affected `SKILL.md` and checking its references
2. Running the command in a Claude Code session against a real project
3. Running `npm run build` in `.page/` before any landing page change
