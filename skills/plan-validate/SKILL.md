---
name: plan-validate
description: Validate the structural integrity of one planning (or all plannings) — file locations, scope consistency, workflow IDs, dependencies, done criteria, and atomized task files.
argument-hint: "[NNN-slug]"
allowed-tools: [Read, Bash, Glob]
---

Validate the structural integrity of plannings in `.planning/`. Read-only: report findings, never modify files.

If `$ARGUMENTS` contains a `NNN-slug`, validate only that planning. If empty, validate every planning found in `.planning/`, `.planning/active/`, and `.planning/finished/`.

## Steps

1. **Locate the planning(s).**
   a. Search for `NNN-slug` folders in `.planning/` (INITIAL), `.planning/active/` (EXPANSION / DEEPENING), and `.planning/finished/` (COMPLETED).
   b. If an explicit `NNN-slug` was given and not found anywhere, stop and report it.
   c. If the same `NNN-slug` exists in more than one location, report it as a **FAIL** (duplicate planning).

2. **Build the workflow catalog.** Read `.planning/WORKFLOWS/README.md` and list every workflow ID defined there (main workflows and sub-workflows). This is the valid set for task `Workflow` columns.

3. **For each planning, check location ↔ state coherence:**
   a. A planning at `.planning/NNN-slug/` must contain only `00-initial.md` artifacts (INITIAL state). If it has `01-expansion.md` or `02-deepening/`, flag **FAIL**: it should have been moved to `active/`.
   b. A planning in `active/` must contain `00-initial.md` and `01-expansion.md`.
   c. A planning in `finished/` must contain all lifecycle files and have every scope marked DONE.

4. **Check required files:**
   a. `00-initial.md` — always required.
   b. `01-expansion.md` — required in `active/` and `finished/`.
   c. `TRACEABILITY.md` — required in `active/` and `finished/`.
   d. `02-deepening/` — required once any scope has started DEEPENING.

5. **Check scope consistency (plannings with `01-expansion.md`):**
   a. Parse the `## Scope Summary` table: scope IDs, names, `Depends On`, statuses.
   b. Every scope row must have a matching `02-deepening/scope-NN-*.md` file **if** the planning is in DEEPENING. A scope file without a table row, or a row without a file (when expected), is a **FAIL**.
   c. Every `Depends On` value must reference an existing scope ID in the same table. Detect circular dependencies (e.g. 01 → 02 → 01) and flag them as **FAIL**.
   d. The scope status in the summary table must match the `> **Status:**` line of the corresponding scope file. Mismatch is a **FAIL**.
   e. Valid status values are `TODO`, `IN PROGRESS`, and `DONE` — for scopes and tasks alike. Any other label (e.g. `PENDING`, a legacy synonym of `TODO`) is a **WARN**: suggest normalizing to `TODO`.

6. **Check each scope file (`02-deepening/scope-NN-*.md`):**
   a. Required sections: `## Objective`, `## Tasks`, `## Done Criteria`.
   b. Every row in the `## Tasks` table must have a `Workflow` value that exists in the catalog from step 2. Unknown workflow IDs are a **FAIL**.
   c. Task numbers must be unique and sequential starting at 1.
   d. A scope marked DONE must have **all** Done Criteria checked (`- [x]`). Unchecked criteria in a DONE scope is a **FAIL**.
   e. A scope with all tasks DONE but status not DONE is a **WARN** (likely forgot `/plan-done`).
   f. Placeholder text surviving from the template (`[Task description]`, `[Scope Name]`, `[WORKFLOW-NAME]`) is a **WARN** in active plannings and a **FAIL** in `finished/`.

7. **Check atomized scopes.** For each scope with a task folder (`02-deepening/<scope-id>-*/` containing `task-NN-*.md`):
   a. Every row in the scope's `## Tasks` index must link to an existing task file, and every task file must have an index row. Orphans in either direction are a **FAIL**.
   b. Task numbers must be unique and sequential starting at `task-01`.
   c. Every task `Depends On` must reference an existing task in the same scope, with no cycles. Violations are a **FAIL**.
   d. Each task file must contain `## Objective`, `## Technical Design`, `## Implementation Steps`, `## Unit Tests`, and `## Done Criteria`. Missing sections are a **FAIL**.
   e. Task `Workflow` values must exist in the catalog from step 2. Unknown IDs are a **FAIL**.
   f. Index status must match each task file's `> **Status:**` line. Mismatch is a **FAIL**.
   g. A task `DONE` with unchecked Done Criteria is a **FAIL**. For deep atomicity auditing, point to `/plan-task-validate`.

8. **Check dependency order:** a scope with status IN PROGRESS or DONE whose `Depends On` scopes are not all DONE is a **WARN** (dependency executed out of order).

9. **Check traceability:** if any scope file's Done Criteria mentions TRACEABILITY and is checked, `TRACEABILITY.md` must exist and be non-empty. Empty or missing while referenced is a **WARN**.

10. **Report.** Print one block per planning:

```
NNN-slug (LOCATION: initial | active | finished)
  ✅ PASS  — <count> checks passed
  ⚠️ WARN  — <description with file and line reference>
  ❌ FAIL  — <description with file and line reference>
```

End with a global summary: `N plannings validated — X clean, Y with warnings, Z with failures.` Exit message must state clearly that nothing was modified.

11. **Suggest fixes.** For each FAIL, suggest the command that fixes it (e.g. status mismatch → `/plan-done NNN-slug scope-NN`; missing scope file → `/plan-enrich-story NNN-slug scope-NN`; malformed atomized scope → `/plan-task-validate NNN-slug scope-NN`). Do not apply any fix.

> This command is read-only. It does not modify any files.
