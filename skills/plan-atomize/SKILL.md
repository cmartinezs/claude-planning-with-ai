---
name: plan-atomize
description: Decompose a story into atomic tasks — one file per task with technical design, implementation steps, verification, and done criteria. Run after /plan-expand, before executing the story.
argument-hint: <NNN-slug> [story-NN]  (e.g. 001-user-auth-api story-01 or just 001-user-auth-api)
allowed-tools: [Read, Write, Bash, Glob]
---

Decompose one story (or all pending stories in a planning) into atomic tasks following the ATOMIZE-STORY workflow. Each task becomes one file under `02-deepening/story-NN-name/`, granular enough to be implemented directly in a single session.

Reference workflows:
- `.planning/WORKFLOWS/02-EXECUTION-WORKFLOWS/ATOMIZE-STORY.md`
- `.planning/WORKFLOWS/04-SUB-WORKFLOWS/CHECK-ATOMICITY.md`
- `.planning/WORKFLOWS/04-SUB-WORKFLOWS/CHECK-TRACEABILITY.md`

## Arguments

`$ARGUMENTS` — two forms:
- `NNN-slug story-NN` — atomize a single story (e.g. `001-user-auth-api story-01`)
- `NNN-slug` — atomize **all** pending stories in the planning (skip DONE and already-atomized)

## Steps

1. Parse `$ARGUMENTS`:
   - If two tokens → **single-story mode**: planning id + story id.
   - If one token → **plan mode**: planning id only; discover all story files under `.planning/active/<planning-id>/02-deepening/*.md` and build the work list (exclude stories whose status is `DONE` and stories whose matching directory already contains task files).
   - If the work list is empty (plan mode), report "nothing to atomize" and stop.

2. Read `00-initial.md`, `01-expansion.md`, and `.planning/config.yml` to establish planning context (done once even in plan mode). Extract:
   - `project.type` (default `software`)
   - `execution.requires_tests` (default `true`)
   - `execution.requires_git` (default `true`)
   - `software.smoke_tests_file` (default `SMOKE-TESTS.md`) for software smoke-test expectations

3. **For each story in the work list**, execute the following sub-steps:

   a. Read `.planning/active/<planning-id>/02-deepening/<story-id>-*.md`. If it doesn't exist, skip with a warning.
   b. If story status is `DONE`, skip.
   c. If `02-deepening/<story-id>-*/` already contains task files, skip and note: story already atomized (suggest `/plan-task-validate`).
   d. Read the `docs/` contracts for the story's area to gather context.
   e. Derive candidate atomic tasks from the story's objective and existing task rows. Each candidate targets **exactly one verifiable deliverable** and must include enough information to fill every section of the task template.
   e1. **Database / ORM consistency task.** If any candidate modifies database structure, migrations, schema files, seed/bootstrap data, ORM models/entities, ORM mappings, generated clients, repositories tied to ORM models, or persistence-layer configuration:
      - Add a separate atomic validation task after the relevant schema/ORM change tasks.
      - The validation task must depend on every task that changes the database structure or ORM representation.
      - The validation task must include static consistency validation between database artifacts and ORM artifacts when an ORM exists. Examples: migration/schema diff, entity/model field mapping, generated client/schema sync, repository query shape vs model fields, enum/nullability/index/relationship alignment.
      - The validation task must include runtime validation by starting the required local environment and running a smoke check against the application or persistence layer. Infer the local environment from repository files (`docker-compose.yml`, `compose.yml`, `.env.example`, package scripts, Maven/Gradle tasks, Prisma/Flyway/Liquibase commands, health endpoints) when possible; if it cannot be inferred, ask the human for the local startup steps before finalizing the task breakdown.
      - Do not merge this validation into the implementation task unless the implementation task would otherwise be unverifiable. Prefer an explicit task named like `validate-db-orm-consistency`.
   f. For each candidate, execute `[CHECK-ATOMICITY]`:
      - `REJECTED — too large`: split it.
      - `REJECTED — fragment`: merge it with the task it cannot be verified without.
      - Repeat until every candidate returns `PASS`.
   g. Number the tasks so every `Depends On` reference points only to a lower-numbered task within the same story.
   h. Record the proposed breakdown (task name + one-line deliverable + dependencies) for the confirmation step.

4. Present **all** proposed breakdowns to the user (grouped by story) and wait for a single confirmation before writing anything.

5. For each confirmed story breakdown:

   a. Create `.planning/active/<planning-id>/02-deepening/<story-id>-<name>/` (same name as the story file, without `.md`).
   b. For each task, create `task-NN-slug.md` from `.planning/_template/02-deepening/task-NN-name.md`, filling **all** sections:
      - `Objective` — the single deliverable.
      - `Technical Design` — approach, affected files, interfaces, design notes.
      - `Implementation Steps` — ordered, naming real files or components.
      - `Verification` — if `execution.requires_tests` is `true`, include unit or automated tests for code changes; otherwise include concrete manual/evidence checks appropriate to `project.type`.
      - `Software Smoke Test Check` — for `project.type: software`, include the smoke-test plan, supporting services, startup/build command, connectivity or schema checks, smoke checks, and human developer PR review expectations. For git-enabled tasks, done criteria must state that the task PR is opened before human review and that corrections are pushed to the same PR.
      - `Database / ORM Consistency Check` — required when the task changes database structure or ORM artifacts, and required for the explicit DB/ORM validation task. Include static database-to-ORM checks plus local runtime smoke validation.
      - `Done Criteria` — binary, verifiable conditions.
      - Header fields: `Status: TODO`, `Workflow` (from the catalog), `Depends On`.
   c. Rewrite the story's `## Tasks` table as an index: each task name becomes a link to its task file (`[Task name](<story-id>-<name>/task-NN-slug.md)`), keeping `Workflow`, `Status`, and `Output` columns in sync with the task files.
   d. Execute `[CHECK-TRACEABILITY]` — register any new domain terms introduced.

6. Report:
   - **Single-story mode**: N atomic tasks created under `02-deepening/<story-id>-<name>/`, dependency order, and the suggested next command (`/plan-task <planning-id> <story-id> task-01` or `/plan-story <planning-id> <story-id>`).
   - **Plan mode**: summary table — one row per story showing story id, tasks created, and skipped stories with reason. Suggest `/plan-story <planning-id> <story-id>` for each atomized story.

> Does NOT change story status. Does NOT execute any tasks. All tasks start as `TODO`.
