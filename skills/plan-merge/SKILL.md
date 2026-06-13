---
name: plan-merge
description: Move a scope from one active planning to another — updates both 01-expansion.md files, relocates the scope file, and preserves atomized task folders.
argument-hint: <NNN-source> <scope-NN> <NNN-target>
allowed-tools: [Read, Write, Bash, Glob]
---

Move a scope from one planning to another. Useful when reorganizing work reveals a scope belongs to a different initiative.

## Arguments

`$ARGUMENTS` — format: `NNN-source scope-NN NNN-target`
- `NNN-source` — planning ID that currently owns the scope (e.g. `001-jwt-auth-api`)
- `scope-NN` — the scope to move (e.g. `scope-03`)
- `NNN-target` — planning ID to receive the scope (e.g. `002-api-platform`)

## Steps

1. Parse `$ARGUMENTS` into source ID, scope ID, and target ID.

2. Verify both plannings exist in `.planning/active/`. If either is not in `active/`, stop and report which one is missing or not in active state.

3. Locate the scope file: `.planning/active/<source-id>/02-deepening/<scope-id>-*.md`. If not found, stop and report.

4. Read the scope file and verify its status is not `DONE`. If DONE, stop: "cannot move a DONE scope — it is already part of the source planning's history".

5. Determine the new scope number in the target planning: read the existing scope files in `.planning/active/<target-id>/02-deepening/` to find the highest existing scope-NN number, then assign the next one (e.g., if scope-03 is highest, the moved scope becomes scope-04).

6. **Confirm before proceeding:**
   "Move `<scope-id>` from `<source-id>` to `<target-id>` as `<new-scope-id>`? (yes/no)"
   Wait for confirmation.

7. **Execute the move:**
   a. Rename the scope file from `<scope-id>-<name>.md` to `<new-scope-id>-<name>.md` and move it to `.planning/active/<target-id>/02-deepening/`.
   b. Update the scope number reference inside the moved file (header fields, any self-referencing links).
   c. If a task folder exists (`02-deepening/<scope-id>-<name>/`): move it to the target as `02-deepening/<new-scope-id>-<name>/` and update internal task file references to the new scope ID.

8. **Update source planning:**
   a. Remove the scope row from `.planning/active/<source-id>/01-expansion.md`.
   b. Update `.planning/active/<source-id>/README.md` to remove the scope entry.
   c. Check if the source planning now has all remaining scopes DONE/SKIPPED. If yes, suggest `/plan-archive <source-id>`.

9. **Update target planning:**
   a. Add a new row for the moved scope in `.planning/active/<target-id>/01-expansion.md`.
   b. Update `.planning/active/<target-id>/README.md` to add the scope entry.

10. Report: scope moved from `<source-id>/<old-scope-id>` to `<target-id>/<new-scope-id>`. If task folder was moved, confirm that too. List any follow-up actions needed (e.g., dependency updates if the scope depended on other scopes in the source planning).

> Dependency references in `Depends On` fields are not automatically updated. Review them manually after the move.
