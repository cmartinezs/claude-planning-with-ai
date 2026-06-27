---
name: plan-task
description: Execute a single atomic task from an atomized story — technical design, implementation, verification, and done criteria. Marks the task DONE in both the task file and the story index.
argument-hint: <NNN-slug> <story-NN> <task-NN>  (e.g. 001-user-auth-api story-01 task-02)
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
---

Execute one atomic task end to end: verify it is ready, follow its technical design, apply the implementation steps, run the required verification, and verify the done criteria.

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
3. Read the task file completely: objective, technical design, implementation steps, verification (or legacy Unit Tests), done criteria, workflow, dependencies.
3b. Read `.planning/config.yml` if it exists. Extract:
   - `project.type` (default `software`)
   - `execution.requires_tests` (default `true`)
   - `execution.requires_git` (default `true`)
   - `docs.output_dir` (default `docs`)
   - `software.smoke_tests_file` (default `SMOKE-TESTS.md`; resolved under `.planning/`)
4. **Readiness checks** (stop and report if any fails):
   a. Task status must not be `DONE`.
   b. Every task in `Depends On` must have status `DONE` in its own file. List the pending ones otherwise.
   c. Execute `[CHECK-ATOMICITY]` on the task file. If `REJECTED`, stop and suggest `/plan-task-validate <planning-id> <story-id>` — the task definition must be fixed before executing.
   d. Execute `[CHECK-PHASE-CONTEXT]` for the story's area — verify required `docs/` contracts exist and have been read.
5. Set the task status to `IN PROGRESS` in the task file and in the story's `## Tasks` index. If the story status is `TODO`, set it to `IN PROGRESS` too.
6. **Execute the task**, governed by its `Workflow`:
   a. Follow the `Technical Design` as written. If reality contradicts the design, update the design section first, stating why — then proceed.
   b. Apply the `Implementation Steps` in order, announcing each one.
   c. Run the checks listed in the `Verification` table. If `execution.requires_tests` is `true`, write and run the listed unit tests for code tasks. If it is `false`, collect the stated manual, documentary, approval, or reproducibility evidence appropriate to `project.type`.
   d. Run the project's relevant validation command when applicable. If `execution.requires_tests` is `false` and no automated validation exists, do not invent a test runner; include the evidence summary in the report instead.
   e. For `project.type: software`, execute the smoke test plan before asking for human review:
      1. Read `.planning/${software.smoke_tests_file}` if present. If missing, infer the smoke plan from the repository stack signals (`package.json`, `pom.xml`, `build.gradle*`, `docker-compose.yml`, `compose.yml`, migrations, health endpoints, CLI entrypoints) and write the inferred plan into the report before running it.
      2. Start the supporting services or fixtures required by the smoke plan using the safest non-destructive commands for the detected stack.
      3. Compile or build the application using the project build tool or the task's verification command.
      4. Start the application or worker using the project-local configuration described by the smoke plan.
      5. Run the smoke checks focused on real integration failures:
         - compilation/build failure
         - dependency or connectivity failure
         - schema or migration failure when applicable
         - minimal health/API/CLI checks that prove the changed surface starts correctly
      6. If any smoke check fails, keep the task `IN PROGRESS`, report the concrete failure logs, implement the correction, and repeat this step before asking for human code review.
7. Execute `[CHECK-AGNOSTIC-BOUNDARY]` — verify the output is consistent with `docs/` contracts.
8. Execute `[CHECK-TRACEABILITY]` — register any new domain terms introduced.
9. Verify every `Done Criteria` item. If any is unmet, leave the task `IN PROGRESS`, list what is missing, and stop.

9b. **Human developer code review checkpoint** — before marking the task DONE or staging any files, present:
   - the full `## Done Criteria` section exactly as it appears in the task file
   - the files changed/created
   - unit/automated verification results
   - for software projects, smoke-test evidence: supporting services, app/build command, connectivity or schema result, and smoke checks

   Then ask explicitly:

   > "Please perform a human developer code review before this task is marked DONE or committed. Reply with **approved** to mark this task DONE and continue to git add/commit, or list the requested corrections."

   Do not proceed to step 10 until the user approves.

   If the reviewer requests corrections:
   - implement the requested changes
   - rerun the task verification
   - for software projects, rerun the smoke test plan
   - present the updated review summary again
   - wait for a new human code review

   Repeat this loop until the reviewer replies with **approved**. Do not mark the task `DONE`, stage files, commit, push, or create a PR before approval.

10. Mark the task `DONE`: check all done criteria boxes, set the status in the task file, and update the row in the story's `## Tasks` index.

10b. **Conventional commit after review approval** — commit the task output only when `execution.requires_git` is `true`:

   If `execution.requires_git` is `false`, skip this step and report that git commit was disabled by `.planning/config.yml`.

   a. Derive the **commit type** from the task's `Objective` and `Workflow` field (first match wins):

   | Signal | Type |
   |--------|------|
   | Workflow is `GENERATE-DOCUMENT`, or objective contains "document", "write docs", "update docs" | `docs` |
   | Objective contains "fix", "correct", "resolve", "repair" | `fix` |
   | Objective contains "refactor", "restructure", "reorganize", "clean" | `refactor` |
   | Objective contains "test", "spec", "coverage" | `test` |
   | Objective contains "setup", "configure", "scaffold", "init", "install" | `chore` |
   | (default) | `feat` |

   b. Derive the **commit scope** from the story filename: strip the `story-NN-` prefix from `story-NN-<slug>` → commit scope is `<slug>`.

   c. Derive the **description** from the task filename: strip the `task-NN-` prefix from `task-NN-<slug>` and replace hyphens with spaces → e.g. `task-02-create-user-model` → `create user model`.

   d. Stage only the files listed in the task's `Technical Design → Affected files / components` field, plus any additional files created during implementation and review corrections. If the field is missing or clearly incomplete, stop and ask the user to confirm the exact files to stage. Do **not** use `git add -A` or `git add .`.

   e. Commit:
   ```bash
   git commit -m "type(scope): description"
   ```

   Example: `feat(user-authentication): create user model`

   If there is nothing to commit (e.g., the task only touched `.planning/` files), skip this step silently.

10c. Invoke `/doc-task <planning-id> <story-id> <task-id>`. If the story area is DO or W this is a silent no-op. Include any files written in the final report.
11. Report: task completed, files created/changed, test results, commit message used (from step 10b), doc files written (from step 10c), and the next pending task in the story — or, if all tasks are `DONE`, suggest `/plan-done <planning-id> <story-id>`.

> Executes exactly ONE task. To run all tasks of a story in order, use `/plan-story <planning-id> <story-id>`.
