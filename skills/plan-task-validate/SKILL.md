---
name: plan-task-validate
description: Audit atomic tasks against the atomicity checklist and the scope index — read-only. Validates one task, one scope, or every atomized scope in a planning.
argument-hint: <NNN-slug> [scope-NN] [task-NN]
allowed-tools: [Read, Bash, Glob, Grep]
---

Audit atomic tasks against the `[CHECK-ATOMICITY]` requirements and the structural rules of atomized scopes. Read-only: report findings, never modify files.

Reference workflows:
- `.planning/WORKFLOWS/04-SUB-WORKFLOWS/CHECK-ATOMICITY.md`
- `.planning/WORKFLOWS/02-EXECUTION-WORKFLOWS/ATOMIZE-SCOPE.md`

## Arguments

`$ARGUMENTS` — format: `NNN-slug [scope-NN] [task-NN]`

- `NNN-slug` only — validate every atomized scope in the planning.
- `NNN-slug scope-NN` — validate all tasks of that scope.
- `NNN-slug scope-NN task-NN` — validate a single task.

## Steps

1. Parse `$ARGUMENTS` and locate the planning in `.planning/active/` (or `.planning/finished/`). If not found, stop and report.
2. Build the scope set to audit: the given scope, or every scope in `02-deepening/` that has a task folder (`<scope-id>-*/` containing `task-NN-*.md` files). If the target scope has no task folder, report it as not atomized and suggest `/plan-atomize`.
3. Build the workflow catalog from `.planning/WORKFLOWS/README.md` (valid set for `Workflow` fields).
4. **Structural checks per atomized scope:**
   a. Every row in the scope's `## Tasks` index must link to an existing `task-NN-*.md` file, and every task file must have a row in the index. Orphans in either direction are a **FAIL**.
   b. Task numbers must be unique and sequential starting at `task-01`.
   c. Every `Depends On` value must reference an existing task in the same scope, point only to lower-numbered tasks, and contain no cycles. Violations are a **FAIL**.
   d. The status in the index row must match the `> **Status:**` line of the task file. Mismatch is a **FAIL**.
   e. A task `DONE` must have all its Done Criteria checked (`- [x]`). Unchecked criteria in a DONE task is a **FAIL**.
   f. A task `IN PROGRESS` or `DONE` whose `Depends On` tasks are not all `DONE` is a **WARN** (executed out of order).
   g. A scope marked `DONE` with any task not `DONE` is a **FAIL**.
5. **Atomicity checks per task file** — execute `[CHECK-ATOMICITY]` requirement by requirement:
   a. Required sections present: `## Objective`, `## Technical Design`, `## Implementation Steps`, `## Unit Tests`, `## Done Criteria`. Missing section is a **FAIL**.
   b. `Workflow` value exists in the catalog. Unknown ID is a **FAIL**.
   c. Surviving template placeholders (`[Task Name]`, `[WORKFLOW-NAME]`, `[Step naming...]`, etc.) are a **WARN** in `TODO` tasks and a **FAIL** in `IN PROGRESS`/`DONE` tasks.
   d. Objective naming more than one deliverable is a **WARN** (requirement 1: candidate for splitting).
   e. Empty `Unit Tests` table is a **FAIL** (requirement 5).
   f. Done criteria that are not binary/verifiable ("works well", "is reasonable") are a **WARN** (requirement 6).
6. **Report.** Print one block per scope:

```
scope-NN-name (N tasks)
  ✅ PASS  — <count> checks passed
  ⚠️ WARN  — <description with file and line reference>
  ❌ FAIL  — <description with file and line reference>
```

End with a global summary: `N tasks audited — X clean, Y with warnings, Z with failures.` State clearly that nothing was modified.

7. **Suggest fixes.** For each finding, suggest the command or edit that resolves it (e.g. status mismatch → update the index row; non-atomic task → split it and re-run `/plan-atomize` review; missing tests → fill the `Unit Tests` table before `/plan-task`). Do not apply any fix.

> This command is read-only. It does not modify any files.
