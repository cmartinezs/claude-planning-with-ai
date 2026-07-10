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
- `.planning/WORKFLOWS/03-MAINTENANCE-WORKFLOWS/RECORD-EDGE-CASE.md`

## Arguments

`$ARGUMENTS` — format: `NNN-slug story-NN task-NN` (e.g. `001-user-auth-api story-01 task-02`)

## Steps

1. Parse `$ARGUMENTS` to extract planning id, story id, and task id.
2. Locate `.planning/active/<planning-id>/02-deepening/<story-id>-*/<task-id>-*.md`.
   - If the file exists: read it completely and continue.
   - If the story subfolder does not exist: create it, then generate `<task-id>-slug.md` from `_template/02-deepening/task-NN-name.md` filling all sections using the story file, `00-initial.md`, and `01-expansion.md` as context. Update the story's `## Tasks` table to link the task name to its new file. Execute `[RECORD-EDGE-CASE]` noting that task structure had to be recovered during execution. Then continue with the newly created file.
   - If the subfolder exists but this specific task file is missing: generate it the same way, update the story table link, execute `[RECORD-EDGE-CASE]` noting the missing task file, then continue.
3. Read the task file completely: objective, technical design, implementation steps, verification (or legacy Unit Tests), done criteria, workflow, dependencies.
3b. Read `.planning/config.yml` if it exists. Extract:
   - `git.base_branch` (default `main`)
   - `project.type` (default `software`)
   - `execution.requires_tests` (default `true`)
   - `execution.requires_git` (default `true`)
   - `docs.output_dir` (default `docs`)
   - `software.smoke_tests_file` (default `SMOKE-TESTS.md`; resolved under `.planning/`)
3c. **Git branch setup** — if `execution.requires_git` is `true`, isolate this task in its own branch. `/plan-task` must work even when `/plan-story` was not run first.
   a. Derive the story branch from the story filename or task folder name: `story-NN-<slug>`.
      - If this is a child planning running in a dedicated sibling worktree, derive `<worktree-prefix>` from the worktree directory name and prefix the branch: `<worktree-prefix>/story-NN-<slug>`.
      - Preserve an existing worktree prefix if the story branch already has one. The prefix must appear before the rest of the branch name.
   b. Derive the task branch from the story branch and task filename: `<story-branch>/<task-NN-<slug>>`. For prefixed child worktrees this becomes `<worktree-prefix>/story-NN-<slug>/task-NN-<slug>`.
   c. Validate the worktree is clean before branching:
      ```bash
      git status --porcelain
      ```
      If there are uncommitted changes, stop and ask the user to commit, stash, or discard them before starting the task. Do not create a task branch from a dirty worktree.
   d. Ensure the story integration branch exists and is up to date. This branch receives task PRs incrementally and later opens the final story PR to `git.base_branch`.
      ```bash
      git fetch origin
      ```
      - If `<story-branch>` exists locally:
        ```bash
        git checkout <story-branch>
        git pull --ff-only origin <story-branch>
        ```
      - If it exists only on `origin`:
        ```bash
        git checkout -b <story-branch> origin/<story-branch>
        git pull --ff-only origin <story-branch>
        ```
      - If it does not exist locally or on `origin`, create and push it from `git.base_branch`:
        ```bash
        git checkout <base_branch>
        git pull origin <base_branch>
        git checkout -b <story-branch>
        git push -u origin <story-branch>
        ```
      If any step fails, stop and report the error before touching task files.
   e. Create or resume the task branch from the current story branch:
      - If `<task-branch>` exists locally, ask whether to resume it. If yes:
        ```bash
        git checkout <task-branch>
        git pull --ff-only origin <task-branch>
        ```
      - If it exists only on `origin`, ask whether to resume it. If yes:
        ```bash
        git checkout -b <task-branch> origin/<task-branch>
        git pull --ff-only origin <task-branch>
        ```
      - If it does not exist locally or on `origin`, create and push it from the current story branch:
        ```bash
        git checkout -b <task-branch>
        git push -u origin <task-branch>
        ```
      Do not recreate an existing task branch.
4. **Readiness checks** (stop and report if any fails):
   a. Task status must not be `DONE`.
   b. Every task in `Depends On` must have status `DONE` in its own file. If dependencies are pending, execute `[RECORD-EDGE-CASE]`, list the pending ones, and stop.
   c. Execute `[CHECK-ATOMICITY]` on the task file. If `REJECTED`, execute `[RECORD-EDGE-CASE]`, stop, and suggest `/plan-task-validate <planning-id> <story-id>` — the task definition must be fixed before executing.
   d. Execute `[CHECK-PHASE-CONTEXT]` for the story's area — verify required `docs/` contracts exist and have been read. If missing, execute `[RECORD-EDGE-CASE]` before stopping.
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
      6. If any smoke check fails, execute `[RECORD-EDGE-CASE]` with the failure logs and correction summary, keep the task `IN PROGRESS`, report the concrete failure logs, implement the correction, and repeat this step before asking for human code review.
   f. **Database / ORM consistency validation.** If the task changes database structure or ORM artifacts, or if the task is the explicit DB/ORM validation task:
      1. Identify database artifacts changed by this task or its dependencies: migrations, schema files, seed/bootstrap data, DDL, Prisma/TypeORM/Sequelize/SQLAlchemy/JPA/Hibernate/Django/Rails models, generated clients, repositories, or persistence config.
      2. If an ORM or generated database client exists, run static consistency validation between database artifacts and ORM artifacts. Use the stack's concrete command when available (for example schema diff, migration validate, ORM generate/check, typecheck, compile, model metadata validation). If no command exists, perform a static file-level review and report the exact mappings checked: fields, types, nullability, defaults, enums, indexes, relationships, table/column names, and generated client state.
      3. Start the local environment needed to validate the persistence path. Infer the command from `.planning/${software.smoke_tests_file}`, compose files, package scripts, Maven/Gradle tasks, framework CLIs, `.env.example`, and local docs. If the local environment cannot be inferred, stop and ask the human for the startup command and required services; record the answer in the task report before continuing.
      4. Run a runtime smoke check that exercises schema/bootstrap/migration startup and at least one minimal persistence path relevant to the changed surface. Keep it non-destructive or use local/test data only.
      5. Include both static consistency results and runtime smoke evidence in the human review checkpoint.
7. Execute `[CHECK-AGNOSTIC-BOUNDARY]` — verify the output is consistent with `docs/` contracts.
8. Execute `[CHECK-TRACEABILITY]` — register any new domain terms introduced.
9. Verify every `Done Criteria` item. If any is unmet, execute `[RECORD-EDGE-CASE]` with the unmet criteria, leave the task `IN PROGRESS`, list what is missing, and stop.

9b. **Human developer code review checkpoint** — before marking the task DONE or staging any files, present:
   - the full `## Done Criteria` section exactly as it appears in the task file
   - the files changed/created
   - unit/automated verification results
   - for software projects, smoke-test evidence: supporting services, app/build command, connectivity or schema result, and smoke checks
   - for database/ORM changes, static database-to-ORM consistency evidence and local runtime persistence smoke evidence

   Then ask explicitly:

   > "Please perform a human developer code review before this task is marked DONE or committed. Reply with **approved** to mark this task DONE and continue to git add/commit, or list the requested corrections."

   Do not proceed to step 10 until the user approves.

   If the reviewer requests corrections:
   - execute `[RECORD-EDGE-CASE]` with the requested corrections
   - implement the requested changes
   - rerun the task verification
   - for software projects, rerun the smoke test plan
   - present the updated review summary again
   - wait for a new human code review

   Repeat this loop until the reviewer replies with **approved**. Do not mark the task `DONE`, stage files, commit, push, or create a PR before approval.

10. Mark the task `DONE`: check all done criteria boxes, set the status in the task file, and update the row in the story's `## Tasks` index.

10b. **Conventional commit and task PR after review approval** — commit the task output only when `execution.requires_git` is `true`:

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

   d. Stage only the files listed in the task's `Technical Design → Affected files / components` field, plus:
      - the task file itself
      - the story file index/status updates
      - any additional files created during implementation and review corrections

      If the affected-files field is missing or clearly incomplete, execute `[RECORD-EDGE-CASE]`, stop, and ask the user to confirm the exact files to stage. Do **not** use `git add -A` or `git add .`.

   e. Commit:
   ```bash
   git commit -m "type(scope): description"
   ```

   Example: `feat(user-authentication): create user model`

   If there is nothing to commit, skip push/PR creation and report that no repository changes were produced for the task.

   f. Push the task branch only if a commit was created:
   ```bash
   git push -u origin <task-branch>
   ```

   g. Open a pull request from `<task-branch>` to `<story-branch>` only if a commit was created:
   ```bash
   gh pr create \
     --title "<task-NN>: <task-name>" \
     --body "Task <task-id> of story <story-id> in planning <planning-id>." \
     --base <story-branch> \
     --head <task-branch>
   ```
   If `gh` is not available, execute `[RECORD-EDGE-CASE]` noting that task PR creation had to be completed manually, then print the pushed branch and instruct the user to open a PR from `<task-branch>` to `<story-branch>`.

10c. Invoke `/doc-task <planning-id> <story-id> <task-id>`. If the story area is DO or W this is a silent no-op. Include any files written in the final report.
11. Report: task completed, files created/changed, test results, commit message used (from step 10b), task branch and task PR status when git is enabled, task PR target `<story-branch>`, doc files written (from step 10c), and the next pending task in the story. Remind the user that the task PR must be reviewed and merged into `<story-branch>` before the next task starts. After that PR is merged, the local task branch must be deleted from the developer workspace:
   ```bash
   git checkout <story-branch>
   git pull --ff-only origin <story-branch>
   git branch -d <task-branch>
   ```
   Use `git branch -d`, not a forced delete. If deletion fails, report that the branch is not recognized as merged locally and ask the user to confirm the PR merge state. Remote branch deletion is left to the repository/PR workflow. If all tasks are `DONE`, remind the user to merge all task PRs into the story branch, clean local task branches, then run `/plan-done <planning-id> <story-id>` to open the final story PR to `git.base_branch`.

> Executes exactly ONE task. To run all tasks of a story in order, use `/plan-story <planning-id> <story-id>`.
