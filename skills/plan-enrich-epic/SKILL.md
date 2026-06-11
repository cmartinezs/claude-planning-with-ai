---
name: plan-enrich-epic
description: Extend an active planning by adding new scopes (user stories) to it. Use when a planning already in EXPANSION or DEEPENING phase needs more scope coverage discovered after the initial expansion.
argument-hint: the planning id to enrich (e.g. `001-user-auth-api`)
allowed-tools: [Read, Write, Bash, Glob]
---

Extend an active planning by adding new scopes (user stories) to it. Use when a planning already in EXPANSION or DEEPENING phase needs more scope coverage discovered after the initial expansion.

Reference workflows:
- `.planning/WORKFLOWS/01-PLANNING-WORKFLOWS/CREATE-PLANNING.md` (steps 4–7, scope creation)
- `.planning/WORKFLOWS/02-EXECUTION-WORKFLOWS/EXPAND-ELEMENT.md`
- `.planning/WORKFLOWS/04-SUB-WORKFLOWS/CHECK-AGNOSTIC-BOUNDARY.md`

## Arguments

`$ARGUMENTS` — the planning id to enrich (e.g. `001-user-auth-api`)

## Steps

1. Parse `$ARGUMENTS` to extract the planning id.
2. Read `.planning/active/<planning-id>/00-initial.md` and `01-expansion.md`. If either doesn't exist, stop and report.
3. Verify the planning is in `active/` (EXPANSION or DEEPENING). If not, stop and report.
4. Display the current scopes table from `01-expansion.md` so the user can see what already exists.
5. Ask the user: "¿Qué nuevos scopes quieres agregar?" — or, if context from the conversation makes it clear, propose the new scopes and ask for confirmation.
6. For each new scope to add:
   a. Assign the next available `scope-NN` number (continuing from the highest existing one).
   b. Determine the repository area (DO / WB / AP / AG / IN / W) and dependencies on existing scopes.
   c. Run `[CHECK-AGNOSTIC-BOUNDARY]` — confirm the new scope is consistent with existing `docs/` contracts.
   d. Add a new row to the scopes table in `01-expansion.md`.
   e. Update the dependency map section in `01-expansion.md` if the new scope has or creates dependencies.
   f. Create `.planning/active/<planning-id>/02-deepening/scope-NN-name.md` from the deepening template. Set status to `TODO`.
7. Update `.planning/active/README.md` to list the new scopes under the planning entry.
8. Report: N new scopes added, list them with their IDs and names.

> If the new scopes depend on existing IN PROGRESS or DONE scopes, note that in the dependency map and in the report.
