---
name: plan-atomize
description: Decompose a scope into atomic tasks — one file per task with technical design, implementation steps, unit tests, and done criteria. Run after /plan-expand, before executing the scope.
argument-hint: <NNN-slug> [scope-NN]  (e.g. 001-user-auth-api scope-01 or just 001-user-auth-api)
allowed-tools: [Read, Write, Bash, Glob]
---

Decompose one scope (or all pending scopes in a planning) into atomic tasks following the ATOMIZE-SCOPE workflow. Each task becomes one file under `02-deepening/scope-NN-name/`, granular enough to be implemented directly in a single session.

Reference workflows:
- `.planning/WORKFLOWS/02-EXECUTION-WORKFLOWS/ATOMIZE-SCOPE.md`
- `.planning/WORKFLOWS/04-SUB-WORKFLOWS/CHECK-ATOMICITY.md`
- `.planning/WORKFLOWS/04-SUB-WORKFLOWS/CHECK-TRACEABILITY.md`

## Arguments

`$ARGUMENTS` — two forms:
- `NNN-slug scope-NN` — atomize a single scope (e.g. `001-user-auth-api scope-01`)
- `NNN-slug` — atomize **all** pending scopes in the planning (skip DONE and already-atomized)

## Steps

1. Parse `$ARGUMENTS`:
   - If two tokens → **single-scope mode**: planning id + scope id.
   - If one token → **plan mode**: planning id only; discover all scope files under `.planning/active/<planning-id>/02-deepening/*.md` and build the work list (exclude scopes whose status is `DONE` and scopes whose matching directory already contains task files).
   - If the work list is empty (plan mode), report "nothing to atomize" and stop.

2. Read `00-initial.md` and `01-expansion.md` to establish planning context (done once even in plan mode).

3. **For each scope in the work list**, execute the following sub-steps:

   a. Read `.planning/active/<planning-id>/02-deepening/<scope-id>-*.md`. If it doesn't exist, skip with a warning.
   b. If scope status is `DONE`, skip.
   c. If `02-deepening/<scope-id>-*/` already contains task files, skip and note: scope already atomized (suggest `/plan-task-validate`).
   d. Read the `docs/` contracts for the scope's area to gather context.
   e. Derive candidate atomic tasks from the scope's objective and existing task rows. Each candidate targets **exactly one verifiable deliverable** and must include enough information to fill every section of the task template.
   f. For each candidate, execute `[CHECK-ATOMICITY]`:
      - `REJECTED — too large`: split it.
      - `REJECTED — fragment`: merge it with the task it cannot be verified without.
      - Repeat until every candidate returns `PASS`.
   g. Number the tasks so every `Depends On` reference points only to a lower-numbered task within the same scope.
   h. Record the proposed breakdown (task name + one-line deliverable + dependencies) for the confirmation step.

4. Present **all** proposed breakdowns to the user (grouped by scope) and wait for a single confirmation before writing anything.

5. For each confirmed scope breakdown:

   a. Create `.planning/active/<planning-id>/02-deepening/<scope-id>-<name>/` (same name as the scope file, without `.md`).
   b. For each task, create `task-NN-slug.md` from `.planning/_template/02-deepening/task-NN-name.md`, filling **all** sections:
      - `Objective` — the single deliverable.
      - `Technical Design` — approach, affected files, interfaces, design notes.
      - `Implementation Steps` — ordered, naming real files or components.
      - `Unit Tests` — cases, expected results, test file locations.
      - `Done Criteria` — binary, verifiable conditions.
      - Header fields: `Status: TODO`, `Workflow` (from the catalog), `Depends On`.
   c. Rewrite the scope's `## Tasks` table as an index: each task name becomes a link to its task file (`[Task name](<scope-id>-<name>/task-NN-slug.md)`), keeping `Workflow`, `Status`, and `Output` columns in sync with the task files.
   d. Execute `[CHECK-TRACEABILITY]` — register any new domain terms introduced.

6. Report:
   - **Single-scope mode**: N atomic tasks created under `02-deepening/<scope-id>-<name>/`, dependency order, and the suggested next command (`/plan-task <planning-id> <scope-id> task-01` or `/plan-scope <planning-id> <scope-id>`).
   - **Plan mode**: summary table — one row per scope showing scope id, tasks created, and skipped scopes with reason. Suggest `/plan-scope <planning-id> <scope-id>` for each atomized scope.

> Does NOT change scope status. Does NOT execute any tasks. All tasks start as `TODO`.
