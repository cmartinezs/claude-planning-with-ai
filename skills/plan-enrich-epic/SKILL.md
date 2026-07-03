---
name: plan-enrich-epic
description: Extend an active planning by adding new planning stories. Compatibility name for "add story to planning"; does not edit a product epic container.
argument-hint: the planning id to enrich (e.g. `001-user-auth-api`)
allowed-tools: [Read, Write, Bash, Glob]
---

Extend an active planning by adding new planning stories to it. Use when a planning already in EXPANSION or DEEPENING phase needs more story coverage discovered after the initial expansion.

Layer boundary: this command edits `.planning/active/<planning-id>/`. If the product/backlog epic needs more source stories before planning, use `/epic-enrich` instead.

Reference workflows:
- `.planning/WORKFLOWS/01-PLANNING-WORKFLOWS/CREATE-PLANNING.md` (steps 4–7, story creation)
- `.planning/WORKFLOWS/02-EXECUTION-WORKFLOWS/EXPAND-ELEMENT.md`
- `.planning/WORKFLOWS/04-SUB-WORKFLOWS/CHECK-AGNOSTIC-BOUNDARY.md`
- `.planning/WORKFLOWS/03-MAINTENANCE-WORKFLOWS/RECORD-EDGE-CASE.md`

## Arguments

`$ARGUMENTS` — the planning id to enrich (e.g. `001-user-auth-api`)

## Steps

1. Parse `$ARGUMENTS` to extract the planning id.
2. Read `.planning/active/<planning-id>/00-initial.md` and `01-expansion.md`. If either doesn't exist, stop and report.
3. Verify the planning is in `active/` (EXPANSION or DEEPENING). If not, stop and report.
4. Display the current stories table from `01-expansion.md` so the user can see what already exists.
5. Ask the user: "¿Qué nuevos stories quieres agregar?" — or, if context from the conversation makes it clear, propose the new stories and ask for confirmation.
6. For each new story to add:
   a. Assign the next available `story-NN` number (continuing from the highest existing one).
   b. Determine the repository area (DO / WB / AP / AG / IN / W) and dependencies on existing stories.
   c. Run `[CHECK-AGNOSTIC-BOUNDARY]` — confirm the new story is consistent with existing `docs/` contracts.
   d. Add a new row to the stories table in `01-expansion.md`.
   e. Update the dependency map section in `01-expansion.md` if the new story has or creates dependencies.
   f. Create `.planning/active/<planning-id>/02-deepening/story-NN-name.md` from the deepening template. Set status to `TODO`.
7. Update `.planning/active/README.md` to list the new stories under the planning entry.
8. Execute `[RECORD-EDGE-CASE]` with source `/plan-enrich-epic`, listing the new stories and why they were discovered after initial expansion.
9. Report: N new stories added, list them with their IDs and names.

> If the new stories depend on existing IN PROGRESS or DONE stories, note that in the dependency map and in the report.
