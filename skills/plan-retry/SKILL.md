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

1. Locate `.planning/active/$ARGUMENTS/`. If not found, stop and report.
2. Read all story files under `.planning/active/$ARGUMENTS/02-deepening/*.md`. Collect every story whose status line is `BLOCKED`. If none found, report "no BLOCKED stories — nothing to retry" and stop.
3. List the BLOCKED stories and announce: "Retrying N stories: story-01, story-03…"
4. For each BLOCKED story (in dependency order — check `Depends On` fields to avoid retrying a story before its dependency):
   a. Verify all stories it depends on are `DONE`. If not, execute `[RECORD-EDGE-CASE]` with the dependency blocker, then skip it with a warning: "story-NN skipped — dependency story-MM is not DONE".
   b. Set the story status from `BLOCKED` to `TODO` in its file.
   c. Invoke `/plan-story $ARGUMENTS <story-id>`.
   d. If the story completes successfully, note it as DONE.
   e. If it fails again, mark it BLOCKED again with the new failure reason and execute `[RECORD-EDGE-CASE]` with the retry failure.
5. Update `.planning/active/README.md` to reflect new story statuses.
6. Report: N stories retried — N now DONE, N still BLOCKED (with reasons), N skipped (dependency not met).

> Use after manually fixing a blocker. To retry a single story, use `/plan-story NNN-slug story-NN` directly.
