---
name: plan-retry
description: Retry all BLOCKED scopes in a planning — resets each to TODO and re-runs plan-scope for it. Use after fixing a blocker to resume the pipeline.
argument-hint: <NNN-slug>
allowed-tools: [Read, Write, Bash, Glob]
---

Retry all scopes with status BLOCKED in a planning. Resets each to TODO and invokes `/plan-scope` for it.

## Arguments

`$ARGUMENTS` — planning id (e.g. `001-jwt-auth-api`)

## Steps

1. Locate `.planning/active/$ARGUMENTS/`. If not found, stop and report.
2. Read all scope files under `.planning/active/$ARGUMENTS/02-deepening/*.md`. Collect every scope whose status line is `BLOCKED`. If none found, report "no BLOCKED scopes — nothing to retry" and stop.
3. List the BLOCKED scopes and announce: "Retrying N scopes: scope-01, scope-03…"
4. For each BLOCKED scope (in dependency order — check `Depends On` fields to avoid retrying a scope before its dependency):
   a. Verify all scopes it depends on are `DONE`. If not, skip it with a warning: "scope-NN skipped — dependency scope-MM is not DONE".
   b. Set the scope status from `BLOCKED` to `TODO` in its file.
   c. Invoke `/plan-scope $ARGUMENTS <scope-id>`.
   d. If the scope completes successfully, note it as DONE.
   e. If it fails again, mark it BLOCKED again with the new failure reason.
5. Update `.planning/active/README.md` to reflect new scope statuses.
6. Report: N scopes retried — N now DONE, N still BLOCKED (with reasons), N skipped (dependency not met).

> Use after manually fixing a blocker. To retry a single scope, use `/plan-scope NNN-slug scope-NN` directly.
