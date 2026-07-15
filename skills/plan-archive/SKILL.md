---
name: plan-archive
description: Audit a completed planning and archive it to finished/ by delegating deterministic file moves and index updates to the shared planning-mutate lifecycle script.
argument-hint: <NNN-slug>
allowed-tools: [Bash, Read]
---

Archive a completed active planning after auditing closeout conditions.

## Arguments

`$ARGUMENTS` — planning ID, for example `001-user-auth-api`.

## Steps

1. Parse `$ARGUMENTS` as the planning ID.
2. Use only `./.planning/` in the current working directory. Do not search parent directories.
3. Verify `.planning/scripts/planning-mutate.mjs` exists. If missing, stop:
   > This workspace needs the latest planning scripts. Re-run `/plan-init --force` from the project root or copy the current planning template scripts into `.planning/scripts/`.
4. Run the dry-run archive audit:
   ```bash
   node .planning/scripts/planning-mutate.mjs archive <planning-id> --dry-run
   ```
5. Report blockers verbatim. If the retrospective is missing or placeholder-only and raw notes exist, invoke `/plan-retrospective <planning-id>`, then rerun the dry-run.
6. Before applying, execute the human-maintained closeout checks:
   - Run MILESTONE-FEEDBACK if it has not been captured.
   - Invoke `/plan-decision` for accepted cross-cutting decisions that still lack a PDR.
   - Review warnings about traceability, open inconsistencies, or weak task output evidence.
7. Verify the dry-run touched paths are limited to:
   - `.planning/active/<planning-id>/`
   - `.planning/finished/<planning-id>/`
   - `.planning/active/README.md`
   - `.planning/finished/README.md`
   - `.planning/README.md`
8. Ask for approval to archive. Do not proceed without confirmation.
9. Apply the archive:
   ```bash
   node .planning/scripts/planning-mutate.mjs archive <planning-id>
   ```
10. Report the archive path and updated indexes.

The script owns deterministic audit checks, folder move from `active/` to `finished/`, planning README completion metadata, and index updates. The skill owns milestone feedback, PDR decisions, warning interpretation, and approval.
