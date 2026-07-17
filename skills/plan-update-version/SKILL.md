---
name: plan-update-version
description: Apply cumulative major-pair planning-system migrations from update-version/<N>-<N+1>.md so older .planning workspaces can be brought up to the current major-version conventions.
argument-hint: <from> <to> [--dry-run] [--allow-dirty]
allowed-tools: [Read, Write, Edit, Bash]
---

# plan-update-version

Update an existing `.planning/` workspace from one planning-system version to another by applying one or more major-pair migration files in order.

## Arguments

`$ARGUMENTS` — format: `<from> <to> [--dry-run] [--allow-dirty]`

- `<from> <to>` — required version labels. The command resolves them to an ordered chain of major-pair migration files, such as `update-version/2-3.md` then `update-version/3-4.md`.
- `--dry-run` — inspect what would change and report findings, but do not write or rename files.
- `--allow-dirty` — allow migration when the git worktree has existing changes.

Examples:

```bash
/plan-update-version 1.4.0 2.0.0
/plan-update-version 2.1.0 3.10.10
/plan-update-version 2.1.0 4.0.0
/plan-update-version 2.4.0 3.10.10 --dry-run
```

## Steps

### 1 — Run deterministic preflight

1. Use only `./.planning/` in the current working directory. Do not search parent directories.
2. If `.planning/scripts/update-version.mjs` is missing, stop and report:
   - "This workspace needs the latest planning scripts. Re-run `/plan-init --force` from the project root or copy the current planning template scripts into `.planning/scripts/`."
3. Run:

```bash
node .planning/scripts/update-version.mjs $ARGUMENTS --format markdown
```

4. If the script fails, report its error verbatim and stop. Do not apply a migration manually after a failed preflight.
5. If `--dry-run` was passed, do not write any files yourself. Read the listed migration files and report discovery findings only.

> The script owns version parsing, adjacent major-pair chain selection, migration-file lookup/copying, `.planning/` boundary checks, git dirty preflight, and Markdown/JSON reporting.

### 2 — Read and apply migration instructions

Read every migration file listed by the script from top to bottom, in order, before changing anything.

Each migration file is authoritative for its major step:

- scope of files to inspect
- exact terminology or structural changes
- special cases that must not be changed
- verification patterns
- manual follow-up conditions

Apply one migration completely before starting the next.

Safety rules:

- never edit outside the current project
- never edit dependency folders, generated outputs, or `.git/`
- never rewrite product/code files unless the migration explicitly requires it and the user confirms it
- preserve planning history, statuses, decisions, retrospective notes, traceability entries, and user-authored context
- prefer structured Markdown edits over broad blind replacements
- include `.releases/` only when the migration file explicitly says release files can contain old planning references
- do not change unrelated terms that only happen to match old vocabulary, such as OAuth/API permission "scopes"

### 3 — Record the applied migrations

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

### 4 — Verify

Run the verification steps defined by each migration file after applying that migration.

At minimum:

1. Re-run the migration's residual search patterns.
2. Run `/plan-validate` for affected active plannings when possible.
3. If the migration updated finished plannings, verify their README and traceability files still render coherently.
4. Report any remaining legacy references with file paths and why they were left unchanged.

### 5 — Report

Finish with a concise report:

- migration chain applied
- files renamed
- files edited
- validation checks run
- remaining warnings or manual follow-up

If unexpected migration issues appear, execute `[RECORD-EDGE-CASE]` when a planning target can be identified; otherwise mention the issue in `.planning/update-version/APPLIED.md`.
