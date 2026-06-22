---
name: plan-expand
description: Advance a planning from INITIAL to EXPANSION. Fills `01-expansion.md`, creates `02-deepening/` story files, moves the folder to `active/`, and updates all indexes.
argument-hint: the planning id to expand (e.g. `001-user-auth-api`)
allowed-tools: [Read, Write, Bash, Glob]
---

Advance a planning from INITIAL to EXPANSION. Fills `01-expansion.md`, creates `02-deepening/` story files, moves the folder to `active/`, and updates all indexes.

Reference workflow: `.planning/WORKFLOWS/01-PLANNING-WORKFLOWS/CREATE-PLANNING.md` (steps 4–7).

## Arguments

`$ARGUMENTS` — the planning id to expand (e.g. `001-user-auth-api`)

## Steps

1. Locate `.planning/$ARGUMENTS/00-initial.md` and read it. If it doesn't exist, stop and report the error.
2. Verify the planning is currently in INITIAL state (lives at `.planning/NNN-slug/`, not inside `active/`).
3. Ask the user to describe all user stories if not already known, or infer them from `00-initial.md`. A story maps to a repository area (DO / WB / AP / AG / IN / W). Each story will get its own file.
4. Fill `.planning/$ARGUMENTS/01-expansion.md` from the template:
   - List all stories with their area code, a short description, dependencies, and priority order.
   - Fill the "Impact per Repository Area" table.
5. Create `.planning/$ARGUMENTS/02-deepening/` directory.
5b. **Check open residuals.** Read `.planning/TRACEABILITY-GLOBAL.md` → **Consolidated Residuals** table. For each row where `Status` is `OPEN`:
    - Compare its `Source Planning` and `Notes` fields against the intent and story areas of this planning.
    - If there is a thematic match, add the residual as an explicit task in the relevant deepening story file and update the residual's row: set `Status` to `ABSORBED` and append this planning's ID to `Notes`.
    - If no residuals match, proceed without changes.
6. For each story, create `.planning/$ARGUMENTS/02-deepening/story-NN-name.md` from the deepening template. Set status to `TODO`. Include any absorbed residuals as tasks in the appropriate story.
7. Move `.planning/$ARGUMENTS/` to `.planning/active/$ARGUMENTS/`.
8. Update `.planning/README.md`:
   - Remove the entry from `### 🆕 Initial`.
   - Ensure the `### 🚧 In Progress` section links to `active/README.md`.
9. Update `.planning/active/README.md`: add an entry for this planning with its stories listed.
10. Report: planning moved to `active/`, N stories created in `02-deepening/`.
