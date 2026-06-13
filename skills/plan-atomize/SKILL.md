---
name: plan-atomize
description: Decompose a scope into atomic tasks — one file per task with technical design, implementation steps, unit tests, and done criteria. Run after /plan-expand, before executing the scope.
argument-hint: <NNN-slug> <scope-NN>  (e.g. 001-user-auth-api scope-01)
allowed-tools: [Read, Write, Bash, Glob]
---

Decompose a scope into atomic tasks following the ATOMIZE-SCOPE workflow. Each task becomes one file under `02-deepening/scope-NN-name/`, granular enough to be implemented directly in a single session.

Reference workflows:
- `.planning/WORKFLOWS/02-EXECUTION-WORKFLOWS/ATOMIZE-SCOPE.md`
- `.planning/WORKFLOWS/04-SUB-WORKFLOWS/CHECK-ATOMICITY.md`
- `.planning/WORKFLOWS/04-SUB-WORKFLOWS/CHECK-TRACEABILITY.md`

## Arguments

`$ARGUMENTS` — format: `NNN-slug scope-NN` (e.g. `001-user-auth-api scope-01`)

## Steps

1. Parse `$ARGUMENTS` to extract planning id and scope id.
2. Read `.planning/active/<planning-id>/02-deepening/<scope-id>-*.md`. If it doesn't exist, stop and report.
3. If the scope status is `DONE`, stop: a completed scope is not atomized.
4. If `02-deepening/<scope-id>-*/` already contains task files, stop and report: the scope is already atomized. Suggest `/plan-task-validate` to audit it or manual cleanup before regenerating.
5. Read `00-initial.md`, `01-expansion.md`, and the `docs/` contracts for the scope's area to gather context.
6. Derive candidate atomic tasks from the scope's objective and existing task rows. Each candidate targets **exactly one verifiable deliverable** and must include enough information to fill every section of the task template.
7. For each candidate, execute `[CHECK-ATOMICITY]`:
   - `REJECTED — too large`: split it.
   - `REJECTED — fragment`: merge it with the task it cannot be verified without.
   - Repeat until every candidate returns `PASS`.
8. Number the tasks so every `Depends On` reference points only to a lower-numbered task.
9. Present the proposed breakdown to the user (task name + one-line deliverable + dependencies) and wait for confirmation before writing.
10. Create `.planning/active/<planning-id>/02-deepening/<scope-id>-<name>/` (same name as the scope file, without `.md`).
11. For each task, create `task-NN-slug.md` from `.planning/_template/02-deepening/task-NN-name.md`, filling **all** sections:
    - `Objective` — the single deliverable.
    - `Technical Design` — approach, affected files, interfaces, design notes.
    - `Implementation Steps` — ordered, naming real files or components.
    - `Unit Tests` — cases, expected results, test file locations.
    - `Done Criteria` — binary, verifiable conditions.
    - Header fields: `Status: TODO`, `Workflow` (from the catalog), `Depends On`.
12. Rewrite the scope's `## Tasks` table as an index: each task name becomes a link to its task file (`[Task name](<scope-id>-<name>/task-NN-slug.md)`), keeping `Workflow`, `Status`, and `Output` columns in sync with the task files.
13. Execute `[CHECK-TRACEABILITY]` — register any new domain terms introduced.
14. Report: N atomic tasks created under `02-deepening/<scope-id>-<name>/`, dependency order, and the suggested next command (`/plan-task <planning-id> <scope-id> task-01` or `/plan-scope <planning-id> <scope-id>`).

> Does NOT change scope status. Does NOT execute any tasks. All tasks start as `TODO`.
