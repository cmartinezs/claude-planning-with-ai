---
name: plan-story-skip
description: Mark a story as SKIPPED — no longer applicable, will not be executed. Allows closing a planning when requirements changed mid-execution.
argument-hint: <NNN-slug> <story-NN> [-- reason]
allowed-tools: [Read, Write, Bash, Glob]
---

Mark a story as SKIPPED when it is no longer applicable. SKIPPED stories do not block planning closure.

## Arguments

`$ARGUMENTS` — format: `NNN-slug story-NN [-- reason]`
- `NNN-slug` — planning id (e.g. `001-jwt-auth-api`)
- `story-NN` — story to skip (e.g. `story-03`)
- `-- reason` — optional free-text reason (e.g. `-- requirement dropped in sprint review`)

## Steps

1. Parse `$ARGUMENTS`: extract planning id, story id, and optional reason (text after ` -- `).
2. Locate `.planning/active/<planning-id>/02-deepening/<story-id>-*.md`. If not found, stop and report.
3. Read the story file and check its current status:
   - If `DONE`: stop — "story is already DONE; use `/plan-rollback` first if you want to re-evaluate it".
   - If `SKIPPED`: stop — "story is already SKIPPED".
   - Otherwise: continue.
4. Set the story status to `SKIPPED` in the story file. Append a `Skipped reason:` line below the status with the provided reason (or `"not provided"` if omitted) and today's date.
5. Update the story's row in `.planning/active/<planning-id>/01-expansion.md` — set its status column to `SKIPPED`.
6. Update `.planning/active/README.md` to reflect the new status.
7. Check if all stories in the planning are now either `DONE` or `SKIPPED`. If yes, suggest `/plan-archive <planning-id>`.
8. Report: story marked SKIPPED, reason recorded, remaining non-DONE/SKIPPED stories (if any).

> SKIPPED stories are treated as closed for planning-closure purposes. To undo, manually reset the status to TODO in the story file.
