---
name: plan-task
description: Execute a single atomic task from an atomized story — technical design, implementation, and unit tests. Marks the task DONE in both the task file and the story index.
argument-hint: <NNN-slug> <story-NN> <task-NN>  (e.g. 001-user-auth-api story-01 task-02)
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

`$ARGUMENTS` — format: `NNN-slug story-NN task-NN` (e.g. `001-user-auth-api story-01 task-02`)

## Steps

1. Parse `$ARGUMENTS` to extract planning id, story id, and task id.
2. Locate `.planning/active/<planning-id>/02-deepening/<story-id>-*/<task-id>-*.md`.
   - If the file exists: read it completely and continue.
   - If the story subfolder does not exist: create it, then generate `<task-id>-slug.md` from `_template/02-deepening/task-NN-name.md` filling all sections using the story file, `00-initial.md`, and `01-expansion.md` as context. Update the story's `## Tasks` table to link the task name to its new file. Then continue with the newly created file.
   - If the subfolder exists but this specific task file is missing: generate it the same way and update the story table link. Then continue.
3. Read the task file completely: objective, technical design, implementation steps, unit tests, done criteria, workflow, dependencies.
4. **Readiness checks** (stop and report if any fails):
   a. Task status must not be `DONE`.
   b. Every task in `Depends On` must have status `DONE` in its own file. List the pending ones otherwise.
   c. Execute `[CHECK-ATOMICITY]` on the task file. If `REJECTED`, stop and suggest `/plan-task-validate <planning-id> <story-id>` — the task definition must be fixed before executing.
   d. Execute `[CHECK-PHASE-CONTEXT]` for the story's area — verify required `docs/` contracts exist and have been read.
5. Set the task status to `IN PROGRESS` in the task file and in the story's `## Tasks` index. If the story status is `TODO`, set it to `IN PROGRESS` too.
6. **Execute the task**, governed by its `Workflow`:
   a. Follow the `Technical Design` as written. If reality contradicts the design, update the design section first, stating why — then proceed.
   b. Apply the `Implementation Steps` in order, announcing each one.
   c. Write the unit tests listed in the `Unit Tests` table at their specified locations.
   d. Run the tests (use the project's test runner). All listed cases must pass; include the run output in the report.
7. Execute `[CHECK-AGNOSTIC-BOUNDARY]` — verify the output is consistent with `docs/` contracts.
8. Execute `[CHECK-TRACEABILITY]` — register any new domain terms introduced.
9. Verify every `Done Criteria` item. If any is unmet, leave the task `IN PROGRESS`, list what is missing, and stop.
10. Mark the task `DONE`: check all done criteria boxes, set the status in the task file, and update the row in the story's `## Tasks` index.

10b. **Conventional commit** — commit the task output:

   a. Derive the **commit type** from the task's `Objective` and `Workflow` field (first match wins):

   | Signal | Type |
   |--------|------|
   | Workflow is `GENERATE-DOCUMENT`, or objective contains "document", "write docs", "update docs" | `docs` |
   | Objective contains "fix", "correct", "resolve", "repair" | `fix` |
   | Objective contains "refactor", "restructure", "reorganize", "clean" | `refactor` |
   | Objective contains "test", "spec", "coverage" | `test` |
   | Objective contains "setup", "configure", "scaffold", "init", "install" | `chore` |
   | (default) | `feat` |

   b. Derive the **scope** from the story filename: strip the `story-NN-` prefix from `story-NN-<slug>` → scope is `<slug>`.

   c. Derive the **description** from the task filename: strip the `task-NN-` prefix from `task-NN-<slug>` and replace hyphens with spaces → e.g. `task-02-create-user-model` → `create user model`.

   d. Stage only the files listed in the task's `Technical Design → Affected files / components` field, plus any additional files created during implementation. Do **not** use `git add -A` or `git add .`.

   e. Commit:
   ```bash
   git commit -m "type(scope): description"
   ```

   Example: `feat(user-authentication): create user model`

   If there is nothing to commit (e.g., the task only touched `.planning/` files), skip this step silently.

10c. Invoke `/doc-task <planning-id> <story-id> <task-id>`. If the story area is DO or W this is a silent no-op. Include any files written in the final report.
11. Report: task completed, files created/changed, test results, commit message used (from step 10b), doc files written (from step 10c), and the next pending task in the story — or, if all tasks are `DONE`, suggest `/plan-done <planning-id> <story-id>`.

> Executes exactly ONE task. To run all tasks of a story in order, use `/plan-story <planning-id> <story-id>`.
