---
name: plan-update-version
description: Apply cumulative major-pair planning-system migrations from update-version/<N>-<N+1>.md so older .planning workspaces can be brought up to the current major-version conventions.
argument-hint: <from> <to> [--dry-run] [--allow-dirty]
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
---

# plan-update-version

Update an existing `.planning/` workspace from one planning-system version to another by applying one or more major-pair migration files in order.

## Arguments

`$ARGUMENTS`

- `<from> <to>` — required version labels. The command resolves them to an ordered chain of major-pair migration files, such as `update-version/2-3.md` then `update-version/3-4.md`.
- `--dry-run` — inspect what would change and report findings, but do not write or rename files.
- `--allow-dirty` — allow migration when the git worktree has existing changes.

Examples:

```bash
/plan-update-version 1.4.0 2.0.0
/plan-update-version 2.1.0 3.5.0
/plan-update-version 2.1.0 4.0.0
/plan-update-version 2.4.0 3.5.0 --dry-run
```

## Steps

### 1 — Parse and validate arguments

1. Extract `<from>` and `<to>`.
2. Detect flags:
   - `--dry-run`
   - `--allow-dirty`
3. If either version label is missing, stop and show the expected usage.
4. Normalize both labels by stripping a leading `v` or `V`.
5. Extract the major number from each normalized label. `1.4.0` becomes `1`, `2.0.0` becomes `2`, and `2` remains `2`.
6. If `<to-major>` is lower than `<from-major>`, stop: downgrades are not supported.
7. If `<to-major>` equals `<from-major>`, stop: patch and minor updates do not require an update-version migration.
8. Build an ordered migration chain from the source major to the target major, one major step at a time:
   - `1 -> 2` uses `1-2.md`
   - `2 -> 4` uses `2-3.md`, then `3-4.md`
   - `1 -> 4` uses `1-2.md`, then `2-3.md`, then `3-4.md`
9. For migrations that remove legacy planning terminology, read `CHANGELOG.md` and use the release entry that actually introduced the rename. In this repository, the `Scope → User Story rename` is recorded at `2.0.0`, with the previous compatible release at `1.4.0`; those exact labels resolve to `1-2.md`.
10. For any `2.x` workspace that needs the current `3.5.0` baseline, the chain contains only `2-3.md`.

### 2 — Locate the planning workspace

1. Confirm `.planning/` exists in the current project.
2. If it does not exist, stop and ask the user to run `/plan-init` or move to the project root that contains `.planning/`.

### 3 — Locate the migration files

For each migration file in the ordered chain, look for the file in this order:

1. `.planning/update-version/<migration-file>`
2. The plugin template's `planning-template/update-version/<migration-file>`

Find the plugin template using the same strategy as `/plan-init`:

```bash
cat ~/.claude/plugins/installed_plugins.json \
  | python3 -c "import json,sys; d=json.load(sys.stdin)['plugins']; \
    matches=[p['installPath'] for k,v in d.items() for p in v if 'claude-planning-with-ai' in k]; \
    print(matches[0] if matches else '')"
```

If that fails, search under `~/.claude` for `planning-template`.

If a migration exists only in the plugin template and `--dry-run` was not passed, create `.planning/update-version/` if needed and copy that migration file into it before applying. This makes the applied instruction set auditable in the target workspace.

If `--dry-run` was passed, do not copy files; report which migrations would be copied before a real apply.

If any migration in the chain is missing, stop before applying anything and report:

- the migration chain
- the missing migration files
- the directories checked
- how to add the missing migration: create the missing adjacent file, such as `.planning/update-version/<N>-<N+1>.md`, or update the plugin template
- the changelog release that should be used when the user asked for a terminology migration but supplied the wrong version pair

### 4 — Read each migration fully

Read every migration markdown file in chain order from top to bottom before changing anything.

Each migration file is authoritative for its major step:

- scope of files to inspect
- exact terminology or structural changes
- special cases that must not be changed
- verification patterns
- manual follow-up conditions

If the migration instructions conflict with this command, prefer the safer instruction:

- never edit outside the current project
- never edit dependency folders, generated outputs, or `.git/`
- never rewrite product/code files unless the migration explicitly requires it
- preserve user-authored content and planning decisions

### 5 — Git safety pre-flight

If the project is a git repository:

1. Run `git status --porcelain`.
2. If there are existing changes and neither `--dry-run` nor `--allow-dirty` was passed, stop before writing anything.
3. Report the dirty files and tell the user to commit/stash them or re-run with `--allow-dirty`.

This command can rename many planning files, so the default is to require a clean worktree.

### 6 — Dry run mode

If `--dry-run` was passed:

1. Read each migration's discovery and verification sections.
2. Run the discovery searches in chain order without writing files.
3. Report:
   - migration chain selected
   - files that appear affected
   - planned renames
   - planned text replacements
   - residual items that look ambiguous and require review
4. Do not create, edit, move, or delete files.

### 7 — Apply the migration

Apply the migration instructions carefully, one file at a time in chain order. Complete the apply and verification steps for `2-3.md` before starting `3-4.md`.

General rules:

- Default scope is `.planning/`, including `active/`, `finished/`, root INITIAL plannings, templates, workflows, tutorials, guide files, and indexes.
- Include `.releases/` only when the migration file explicitly says release files can contain old planning references.
- Prefer structured Markdown edits over broad blind replacements.
- Rename files and folders before updating links that point to them.
- Preserve planning history, statuses, decisions, retrospective notes, traceability entries, and user-authored context.
- Do not change unrelated terms that only happen to match old vocabulary. For example, leave OAuth/API permission "scopes" alone unless the migration explicitly says they are planning-system units.

### 8 — Record the applied migrations

Create or append `.planning/update-version/APPLIED.md` with an entry:

```markdown
## YYYY-MM-DD — <from> -> <to>

- Migration chain:
  - `.planning/update-version/<from-major>-<next-major>.md`
  - `.planning/update-version/<next-major>-<to-major>.md`
- Mode: applied | dry-run
- Summary:
  - <high-level change 1>
  - <high-level change 2>
- Verification:
  - <checks run>
- Residual follow-up:
  - <none, or remaining intentional/ambiguous references>
```

For `--dry-run`, write nothing; include the same information in the command response only.

### 9 — Verify

Run the verification steps defined by each migration file after applying that migration.

At minimum:

1. Re-run the migration's residual search patterns.
2. Run `/plan-validate` for affected active plannings when possible.
3. If the migration updated finished plannings, verify their README and traceability files still render coherently.
4. Report any remaining legacy references with file paths and why they were left unchanged.

### 10 — Report

Finish with a concise report:

- migration chain applied
- files renamed
- files edited
- validation checks run
- remaining warnings or manual follow-up

If unexpected migration issues appear, execute `[RECORD-EDGE-CASE]` when a planning target can be identified; otherwise mention the issue in `.planning/update-version/APPLIED.md`.
