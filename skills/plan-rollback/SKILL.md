---
name: plan-rollback
description: Revert a scope from DONE back to TODO, removing its atomized task folder if present. Use when an execution left the code in bad state and the scope must be re-run.
argument-hint: <NNN-slug> <scope-NN>
allowed-tools: [Read, Write, Bash, Glob]
---

Revert a DONE scope to TODO so it can be re-executed. Removes the atomized task folder if one exists.

## Arguments

`$ARGUMENTS` — format: `NNN-slug scope-NN`
- `NNN-slug` — planning id (e.g. `001-jwt-auth-api`)
- `scope-NN` — scope to roll back (e.g. `scope-03`)

## Steps

1. Parse `$ARGUMENTS`.
2. Locate `.planning/active/<planning-id>/02-deepening/<scope-id>-*.md`. If not found, stop and report.
3. Read the scope file and verify its status is `DONE`. If not DONE, stop: "scope is not DONE — nothing to roll back".
4. **Confirm before proceeding** (this is destructive):
   - Report: "This will reset scope `<scope-id>` to TODO and delete its task folder if atomized. The generated code/files are NOT reverted — you must undo those changes manually. Continue? (yes/no)"
   - Wait for user confirmation. If no, stop.
5. If the atomized task folder `.planning/active/<planning-id>/02-deepening/<scope-id>-*/` exists and contains task files: delete it entirely.
6. In the scope file:
   - Set status to `TODO`.
   - Uncheck all task checkboxes (change `[x]` to `[ ]`).
   - If the `## Tasks` table was an atomized index (links to task files), revert it to a plain task list (remove the file links, keep the task names).
7. Update the scope's row in `01-expansion.md` — set status to `TODO`.
8. Update `.planning/active/README.md`.
9. Report: scope reverted to TODO, task folder deleted (yes/no), reminder that generated code must be reverted manually.

> Does NOT revert code changes made during the scope's execution. You must undo those separately (e.g., `git checkout` or `git revert`).
