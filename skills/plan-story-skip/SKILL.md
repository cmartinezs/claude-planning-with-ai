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

1. Parse `$ARGUMENTS`: extract planning ID, story ID, and optional reason after ` -- `.

2. Verify `.planning/scripts/planning-mutate.mjs` exists. If missing, stop:

   > This workspace needs the latest planning scripts. Re-run `/plan-init --force` from the project root or copy the current planning template scripts into `.planning/scripts/`.

3. Dry-run the skip:

   ```bash
   node .planning/scripts/planning-mutate.mjs story-skip <planning-id> <story-id> --dry-run -- <reason>
   ```

   If it fails, report the error verbatim and stop.

4. Verify touched paths stay inside `.planning/active/<planning-id>/` and only include story file, `01-expansion.md`, optional `README.md`, and `RETROSPECTIVE-RAW.md`.

5. Apply the skip:

   ```bash
   node .planning/scripts/planning-mutate.mjs story-skip <planning-id> <story-id> -- <reason>
   ```

6. Report reason recorded, closeout readiness, remaining non-DONE/SKIPPED stories, and suggested closeout commands if any.

The script owns active preflight, `DONE`/`SKIPPED` rejection, status/reason updates, `01-expansion.md`, optional README, retrospective entry, and closeout readiness.

> SKIPPED stories are treated as closed for planning-closure purposes. To undo, manually reset the status to TODO in the story file.
