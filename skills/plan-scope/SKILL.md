---
name: plan-scope
description: Execute all tasks within a scope, following the GENERATE-DOCUMENT workflow for each task.
argument-hint: format: `NNN-slug scope-NN` (e.g. `001-user-auth-api scope-01`)
allowed-tools: [Read, Write, Bash, Glob]
---

Execute all tasks within a scope, following the GENERATE-DOCUMENT workflow for each task.

Reference workflows:
- `.planning/WORKFLOWS/02-EXECUTION-WORKFLOWS/GENERATE-DOCUMENT.md`
- `.planning/WORKFLOWS/04-SUB-WORKFLOWS/EXECUTE-SCOPE.md`
- `.planning/WORKFLOWS/04-SUB-WORKFLOWS/CHECK-PHASE-CONTEXT.md`
- `.planning/WORKFLOWS/04-SUB-WORKFLOWS/CHECK-AGNOSTIC-BOUNDARY.md`

## Arguments

`$ARGUMENTS` — format: `NNN-slug scope-NN` (e.g. `001-user-auth-api scope-01`)

## Steps

1. Parse `$ARGUMENTS` to extract: planning id and scope id.
2. Read `.planning/active/<planning-id>/02-deepening/<scope-id>-*.md`. If it doesn't exist, stop and report.
3. Read the scope file completely: tasks list, done criteria, repository area, and workflow type.
4. Execute `[CHECK-PHASE-CONTEXT]` for the scope's area — verify required `docs/` contracts exist and have been read.
   - If `MISSING`: stop and list which `docs/` files must be read first.
5. Set scope status to `IN PROGRESS` in the scope file.
6. For each task in the scope (in order):
   a. Announce the task being worked on.
   b. Execute the task using the workflow type specified (GENERATE-DOCUMENT, or other).
   c. Execute `[CHECK-AGNOSTIC-BOUNDARY]` — verify output is consistent with `docs/` contracts.
   d. Execute `[CHECK-TRACEABILITY]` — register any new domain terms introduced.
   e. Mark the task as done (`[x]`) in the scope file.
7. After all tasks: execute `[EXECUTE-SCOPE]` to verify done criteria are met.
   - If `BLOCKED`: list unmet criteria and stop.
   - If `DONE`: set scope status to `DONE` in the scope file.
8. Report: scope completed, N tasks done, done criteria satisfied.

> To advance to the next scope, use `/plan-advance <planning-id>`.
