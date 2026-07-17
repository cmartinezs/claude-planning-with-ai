---
name: plan-retry
description: Retry all BLOCKED stories in a planning — resets each to TODO and re-runs plan-story for it. Use after fixing a blocker to resume the pipeline.
argument-hint: <NNN-slug>
allowed-tools: [Read, Write, Bash, Glob]
---

Retry all stories with status BLOCKED in a planning. Resets each to TODO and invokes `/plan-story` for it.

## Arguments

`$ARGUMENTS` — planning id (e.g. `001-jwt-auth-api`)

## Steps

1. Parse `$ARGUMENTS` as planning ID.

2. Verify `.planning/scripts/planning-mutate.mjs` exists. If missing, stop:

   > This workspace needs the latest planning scripts. Re-run `/plan-init --force` from the project root or copy the current planning template scripts into `.planning/scripts/`.

3. Dry-run retry preparation:

   ```bash
   node .planning/scripts/planning-mutate.mjs retry <planning-id> --dry-run
   ```

   If it fails, report the error verbatim and stop.

4. Verify touched paths stay inside `.planning/active/<planning-id>/` and are limited to story files, `01-expansion.md`, optional `README.md`, and `RETROSPECTIVE-RAW.md`.

5. Apply retry preparation:

   ```bash
   node .planning/scripts/planning-mutate.mjs retry <planning-id>
   ```

6. If no BLOCKED stories are reported, say "no BLOCKED stories — nothing to retry" and stop.

7. Invoke each reported `retryCommands` entry in order. Before starting each retried story, clear the Claude session with `/clear`, then rerun the reported `/plan-story <planning-id> <story-id>` command from the project root. If the current turn is already the resumed context after `/clear` for that exact retried story, continue.
   - If `/plan-story` completes successfully, note it as DONE.
   - If it fails again, leave/report the story as BLOCKED with the new failure reason and execute `[RECORD-EDGE-CASE]` for the retry failure.

8. Report: N stories retried, N now DONE, N still BLOCKED, N skipped because dependencies were not DONE.

The script owns active preflight, BLOCKED collection, dependency checks, TODO reset, expansion/README updates, skipped dependency notes, and retry command emission.

> Use after manually fixing a blocker. To retry a single story, use `/plan-story NNN-slug story-NN` directly.
