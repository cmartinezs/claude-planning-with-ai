---
name: plan-done
description: Mark a specific task (or all tasks in a scope) as done and advance the planning if all scopes are complete.
argument-hint: format: `NNN-slug scope-NN [task-N]`
allowed-tools: [Read, Write, Bash, Glob]
---

Mark a specific task (or all tasks in a scope) as done and advance the planning if all scopes are complete.

Reference workflow: `.planning/WORKFLOWS/01-PLANNING-WORKFLOWS/ADVANCE-PLANNING.md`

## Arguments

`$ARGUMENTS` — format: `NNN-slug scope-NN [task-N]`
- `NNN-slug` — planning id (e.g. `001-user-auth-api`)
- `scope-NN` — scope id (e.g. `scope-01`)
- `task-N` — optional; specific task number to mark done (e.g. `task-3`). If omitted, mark all tasks done.

## Steps

1. Parse `$ARGUMENTS`.
2. Read `.planning/active/<planning-id>/02-deepening/<scope-id>-*.md`.
3. If a specific task number was given: find that task in the checklist and mark it `[x]`. Report and stop.
4. If no task number given (mark all):
   a. Mark all tasks `[x]` in the scope file.
   b. Execute `[EXECUTE-SCOPE]` — verify done criteria are satisfied.
      - If `BLOCKED`: report unmet criteria, do NOT advance.
      - If `DONE`: set scope status to `DONE` in the scope file.
   c. Execute `[CHECK-TRACEABILITY]` — ensure all terms from this scope are recorded.
   d. Execute `[NEXT-SCOPE]` to identify the next pending scope.
      - If more scopes exist: set next scope to `IN PROGRESS`. Report which scope is next.
      - If no more scopes: execute `MILESTONE-FEEDBACK` → trigger `/plan-archive <planning-id>`.
5. Update `.planning/active/README.md` to reflect new scope statuses.
