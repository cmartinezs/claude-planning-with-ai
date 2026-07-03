---
name: plan-rollback
description: Revert a story from DONE back to TODO, removing its atomized task folder if present. Use when an execution left the code in bad state and the story must be re-run.
argument-hint: <NNN-slug> <story-NN>
allowed-tools: [Read, Write, Bash, Glob]
---

Revert a DONE story to TODO so it can be re-executed. Removes the atomized task folder if one exists.

## Arguments

`$ARGUMENTS` — format: `NNN-slug story-NN`
- `NNN-slug` — planning id (e.g. `001-jwt-auth-api`)
- `story-NN` — story to roll back (e.g. `story-03`)

## Steps

1. Parse `$ARGUMENTS`.
2. Locate `.planning/active/<planning-id>/02-deepening/<story-id>-*.md`. If not found, stop and report.
3. Read the story file and verify its status is `DONE`. If not DONE, stop: "story is not DONE — nothing to roll back".
4. **Confirm before proceeding** (this is destructive):
   - Report: "This will reset story `<story-id>` to TODO and delete its task folder if atomized. The generated code/files are NOT reverted — you must undo those changes manually. Continue? (yes/no)"
   - Wait for user confirmation. If no, stop.
5. If the atomized task folder `.planning/active/<planning-id>/02-deepening/<story-id>-*/` exists and contains task files: delete it entirely.
6. In the story file:
   - Set status to `TODO`.
   - Uncheck all task checkboxes (change `[x]` to `[ ]`).
   - If the `## Tasks` table was an atomized index (links to task files), revert it to a plain task list (remove the file links, keep the task names).
7. Update the story's row in `01-expansion.md` — set status to `TODO`.
8. Update `.planning/active/README.md`.
9. Execute `[RECORD-EDGE-CASE]` with source `/plan-rollback`, related story, reason from user/context if available, task folder deletion result, and reminder that generated code was not reverted by this command.
10. Report: story reverted to TODO, task folder deleted (yes/no), reminder that generated code must be reverted manually.

> Does NOT revert code changes made during the story's execution. You must undo those separately (e.g., `git checkout` or `git revert`).
