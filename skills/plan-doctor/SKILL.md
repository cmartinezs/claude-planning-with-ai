---
name: plan-doctor
description: Audit a plugin checkout or installed planning template for command inventory, skill metadata, copied template integrity, and legacy reference drift.
argument-hint: [--plugin-root <path>]
allowed-tools: [Read, Bash, Glob, Grep]
---

# plan-doctor

Run a compatibility and consistency audit for this planning plugin. This command is read-only.

## Arguments

`$ARGUMENTS`
- *(empty)* — audit the current repository or installed plugin root
- `--plugin-root <path>` — audit a specific plugin checkout

## Steps

1. Resolve the plugin root:
   - If `--plugin-root` is provided, use that path.
   - Otherwise, use the current working directory if it contains `skills/`, `planning-template/`, and `.claude-plugin/plugin.json`.
   - If the current directory is a project using `.planning/`, locate the installed plugin root from `~/.claude/plugins/installed_plugins.json`.

2. Verify required top-level plugin files:
   - `.claude-plugin/plugin.json`
   - `README.md`
   - `docs/reference.md`
   - `docs/commands.yml`
   - `planning-template/README.md`
   - `planning-template/config.yml`

3. Verify skills:
   - Every `skills/*/` directory has `SKILL.md`.
   - Each `SKILL.md` frontmatter has `name`, `description`, `argument-hint`, and `allowed-tools`.
   - The `name` value matches the directory name.
   - Each skill directory is represented in `docs/commands.yml`.
   - Each `docs/commands.yml` `source` file exists.

4. Verify documentation drift:
   - Active docs should use current command names and planning terminology.
   - Scan `README.md`, `docs/reference.md`, and `planning-template/TUTORIAL/` for commands that are not present in `docs/commands.yml`.
   - Legacy workflow names are allowed only in `docs/design-history/`, `docs/superpowers/`, and `docs/plugin-review/`.

5. Verify template integrity:
   - `.planning` template files referenced by `/plan-init` exist.
   - `planning-template/WORKFLOWS/README.md` links to each workflow group directory.
   - `planning-template/update-version/README.md` exists and lists available major-version migrations.
   - `planning-template/PDR-TEMPLATE.md` exists.
   - `planning-template/_template/` does not include a default `pdr-NNN-title.md`; PDRs are optional and should be created through `/plan-decision`.
   - `planning-template/_template/01-expansion.md` includes status, dependency, risk, and external issue fields.
   - `planning-template/_template/02-deepening/story-NN-name.md` includes risk and residual sections.
   - `planning-template/_template/02-deepening/task-NN-name.md` includes verification and risk fields.

6. If `scripts/verify-plugin.sh` exists, run:

```bash
bash scripts/verify-plugin.sh
```

Treat a non-zero exit as FAIL and include the script output in the report.

7. Output:

```markdown
# Plugin Doctor Report

## Result
PASS / WARN / FAIL

## Checks
| Check | Result | Notes |
|-------|--------|-------|
| Required files | PASS | — |
| Skill metadata | PASS | — |
| Command inventory | WARN | <details> |
| Template integrity | PASS | — |
| Legacy drift | PASS | — |

## Required Fixes
1. <blocking inconsistency, if any>

## Recommended Improvements
1. <non-blocking improvement, if any>
```

Do not modify files.
