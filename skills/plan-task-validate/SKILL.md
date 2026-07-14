---
name: plan-task-validate
description: Audit atomic tasks against the atomicity checklist and the story index — read-only. Validates one task, one story, or every atomized story in a planning.
argument-hint: <NNN-slug> [story-NN] [task-NN]
allowed-tools: [Read, Bash, Glob, Grep]
---

Audit atomic tasks against the `[CHECK-ATOMICITY]` requirements and the structural rules of atomized stories. Read-only: report findings, never modify files.

Reference workflows:
- `.planning/WORKFLOWS/04-SUB-WORKFLOWS/CHECK-ATOMICITY.md`
- `.planning/WORKFLOWS/02-EXECUTION-WORKFLOWS/ATOMIZE-STORY.md`

## Arguments

`$ARGUMENTS` — format: `NNN-slug [story-NN] [task-NN]`

- `NNN-slug` only — validate every atomized story in the planning.
- `NNN-slug story-NN` — validate all tasks of that story.
- `NNN-slug story-NN task-NN` — validate a single task.

## Steps

1. Parse `$ARGUMENTS` and locate the planning in `.planning/active/` (or `.planning/finished/`). If not found, stop and report.
1b. Read `.planning/config.yml` if present. Extract `project.type` (default `software`) and `software.smoke_tests_file` (default `SMOKE-TESTS.md` for software).
2. Build the story set to audit: the given story, or every story in `02-deepening/` that has a task folder (`<story-id>-*/` containing `task-NN-*.md` files). If the target story has no task folder, report it as not atomized and suggest `/plan-atomize`.
3. Build the workflow catalog from `.planning/WORKFLOWS/README.md` (valid set for `Workflow` fields).
4. **Structural checks per atomized story:**
   a. Every row in the story's `## Tasks` index must link to an existing `task-NN-*.md` file, and every task file must have a row in the index. Orphans in either direction are a **FAIL**.
   b. Task numbers must be unique and sequential starting at `task-01`.
   c. Every `Depends On` value must reference an existing task in the same story, point only to lower-numbered tasks, and contain no cycles. Violations are a **FAIL**.
   d. The status in the index row must match the `> **Status:**` line of the task file. Mismatch is a **FAIL**.
   e. A task `DONE` must have all its Done Criteria checked (`- [x]`). Unchecked criteria in a DONE task is a **FAIL**.
   f. A task `IN PROGRESS` or `DONE` whose `Depends On` tasks are not all `DONE` is a **WARN** (executed out of order).
   g. A story marked `DONE` with any task not `DONE` is a **FAIL**.
5. **Atomicity checks per task file** — execute `[CHECK-ATOMICITY]` requirement by requirement:
   a. Required sections present: `## Objective`, `## Technical Design`, `## Implementation Steps`, `## Verification` (or legacy `## Unit Tests`), and `## Done Criteria`. Missing section is a **FAIL**.
   b. `Workflow` value exists in the catalog. Unknown ID is a **FAIL**.
   c. Surviving template placeholders (`[Task Name]`, `[WORKFLOW-NAME]`, `[Step naming...]`, etc.) are a **WARN** in `TODO` tasks and a **FAIL** in `IN PROGRESS`/`DONE` tasks.
   d. Objective naming more than one deliverable is a **WARN** (requirement 1: candidate for splitting).
   e. Empty `Verification` table is a **FAIL** (requirement 5). Legacy `Unit Tests` is accepted but should be migrated to `Verification`.
   f. For `project.type: software`, missing `### Software Smoke Test Check` or missing done criteria for supporting services, startup/build, connectivity or schema checks, smoke checks, and human developer PR review is a **FAIL**. For git-enabled tasks, missing done criteria for publishing the task PR before review and pushing corrections to the same PR is a **FAIL**.
   g. For `project.type: software`, missing `### Logging / Observability` or missing done criteria for logging with correlation/trace context and criticality-based levels is a **FAIL** for new code tasks and a **WARN** for legacy tasks. Code-task detection should use affected files, implementation steps, and source/infrastructure file extensions.
   h. For `project.type: software`, missing `### Generated Test Suite` or missing done criteria for generated/refreshed test-suite gate evidence is a **FAIL** for new tasks and a **WARN** for legacy tasks created before this convention. The expected gate set is unit, coverage, integration, acceptance/e2e, static analysis, style, architecture/design guide review, smoke, security/dependency scan, and mutation/test-strength when applicable. Missing acceptance dependency inventory criteria are a **FAIL** for new tasks because acceptance evidence requires every dependency to have an isolated strategy.
   i. If a task appears to change database structure or ORM artifacts (keywords/paths such as migration, schema, database, db, table, column, index, seed, Prisma, TypeORM, Sequelize, SQLAlchemy, Hibernate, JPA, Entity, Model, repository, generated client), missing `### Database / ORM Consistency Check` or missing done criteria for static DB/ORM consistency plus local runtime persistence smoke evidence is a **FAIL**.
   j. If any task in a story changes database structure or ORM artifacts, the story must contain a later explicit validation task depending on those change tasks. Missing DB/ORM validation task is a **FAIL**.
   k. Done criteria that are not binary/verifiable ("works well", "is reasonable") are a **WARN** (requirement 6).
6. **Report.** Print one block per story:

```
story-NN-name (N tasks)
  ✅ PASS  — <count> checks passed
  ⚠️ WARN  — <description with file and line reference>
  ❌ FAIL  — <description with file and line reference>
```

End with a global summary: `N tasks audited — X clean, Y with warnings, Z with failures.` State clearly that nothing was modified.

7. **Suggest fixes.** For each finding, suggest the command or edit that resolves it (e.g. status mismatch → update the index row; non-atomic task → split it and re-run `/plan-atomize` review; missing verification → fill the `Verification` table and, for software, the local runtime check before `/plan-task`). Do not apply any fix.

8. **File review prompt.** After the report, list every task file and story index referenced in a FAIL or WARN and ask the user to inspect them:

   > "Before applying any fix, open and verify the following files directly — the report above may not capture every detail visible in the source:
   > - `<task-file-path>` — check `## Done Criteria` (all `[x]`?), `## Verification` (table populated?), and software local runtime evidence when applicable.
   > …
   > Confirm the issues are still present before modifying or re-running the skill."

> This command is read-only. It does not modify any files.
