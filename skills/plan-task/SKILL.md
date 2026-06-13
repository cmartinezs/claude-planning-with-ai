---
name: plan-task
description: Execute a single atomic task from an atomized scope — technical design, implementation, and unit tests. Marks the task DONE in both the task file and the scope index.
argument-hint: <NNN-slug> <scope-NN> <task-NN>  (e.g. 001-user-auth-api scope-01 task-02)
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
---

Execute one atomic task end to end: verify it is ready, follow its technical design, apply the implementation steps, write and run the unit tests, and verify the done criteria.

Reference workflows:
- `.planning/WORKFLOWS/02-EXECUTION-WORKFLOWS/GENERATE-DOCUMENT.md`
- `.planning/WORKFLOWS/04-SUB-WORKFLOWS/CHECK-ATOMICITY.md`
- `.planning/WORKFLOWS/04-SUB-WORKFLOWS/CHECK-PHASE-CONTEXT.md`
- `.planning/WORKFLOWS/04-SUB-WORKFLOWS/CHECK-AGNOSTIC-BOUNDARY.md`
- `.planning/WORKFLOWS/04-SUB-WORKFLOWS/CHECK-TRACEABILITY.md`

## Arguments

`$ARGUMENTS` — format: `NNN-slug scope-NN task-NN` (e.g. `001-user-auth-api scope-01 task-02`)

## Steps

1. Parse `$ARGUMENTS` to extract planning id, scope id, and task id.
2. Locate `.planning/active/<planning-id>/02-deepening/<scope-id>-*/<task-id>-*.md`. If it doesn't exist, stop and report. If the scope has no task folder, suggest `/plan-atomize <planning-id> <scope-id>` first.
3. Read the task file completely: objective, technical design, implementation steps, unit tests, done criteria, workflow, dependencies.
4. **Readiness checks** (stop and report if any fails):
   a. Task status must not be `DONE`.
   b. Every task in `Depends On` must have status `DONE` in its own file. List the pending ones otherwise.
   c. Execute `[CHECK-ATOMICITY]` on the task file. If `REJECTED`, stop and suggest `/plan-task-validate <planning-id> <scope-id>` — the task definition must be fixed before executing.
   d. Execute `[CHECK-PHASE-CONTEXT]` for the scope's area — verify required `docs/` contracts exist and have been read.
5. Set the task status to `IN PROGRESS` in the task file and in the scope's `## Tasks` index. If the scope status is `TODO`, set it to `IN PROGRESS` too.
6. **Execute the task**, governed by its `Workflow`:
   a. Follow the `Technical Design` as written. If reality contradicts the design, update the design section first, stating why — then proceed.
   b. Apply the `Implementation Steps` in order, announcing each one.
   c. Write the unit tests listed in the `Unit Tests` table at their specified locations.
   d. Run the tests (use the project's test runner). All listed cases must pass; include the run output in the report.
7. Execute `[CHECK-AGNOSTIC-BOUNDARY]` — verify the output is consistent with `docs/` contracts.
8. Execute `[CHECK-TRACEABILITY]` — register any new domain terms introduced.
9. Verify every `Done Criteria` item. If any is unmet, leave the task `IN PROGRESS`, list what is missing, and stop.
10. Mark the task `DONE`: check all done criteria boxes, set the status in the task file, and update the row in the scope's `## Tasks` index.
11. Report: task completed, files created/changed, test results, and the next pending task in the scope — or, if all tasks are `DONE`, suggest `/plan-done <planning-id> <scope-id>`.

> Executes exactly ONE task. To run all tasks of a scope in order, use `/plan-scope <planning-id> <scope-id>`.
