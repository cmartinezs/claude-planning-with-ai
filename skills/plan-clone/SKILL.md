---
name: plan-clone
description: Clone a planning into a new one with a fresh ID — copies scope structure and resets all statuses to TODO. Use to repeat a proven pattern in a new context.
argument-hint: <NNN-source-slug> <NNN-target-slug>
allowed-tools: [Read, Write, Bash, Glob]
---

Clone an existing planning into a new INITIAL-state planning, preserving scope definitions but resetting all execution state.

## Arguments

`$ARGUMENTS` — format: `NNN-source-slug NNN-target-slug`
- `NNN-source-slug` — ID of the planning to clone (any state: INITIAL, active, or finished)
- `NNN-target-slug` — ID for the new planning (must not exist yet)

## Steps

1. Parse `$ARGUMENTS` into source ID and target ID.

2. Locate the source planning in `.planning/` (INITIAL), `.planning/active/`, or `.planning/finished/`. If not found, stop and report. Record its root path.

3. Verify the target ID does not already exist in any of the three locations. If it does, stop: "target ID already exists".

4. Copy `.planning/_template/` to `.planning/<target-id>/` to create a fresh scaffold.

5. **Copy and reset `00-initial.md`:**
   - Copy the source's `00-initial.md` to `.planning/<target-id>/00-initial.md`.
   - Update the title to use the target slug.
   - Set `Date` to today's date.
   - Add a note at the top: `> Cloned from: <source-id>` so the lineage is traceable.

6. **Copy and reset `01-expansion.md`** (if the source has one):
   - Copy to `.planning/<target-id>/01-expansion.md`.
   - Reset all scope status columns to `TODO`.

7. **Copy scope files** from the source's `02-deepening/*.md` to `.planning/<target-id>/02-deepening/`:
   - For each scope file: copy it, reset `Status: TODO`, uncheck all task checkboxes (`[x]` → `[ ]`).
   - Do NOT copy task folders (`02-deepening/scope-NN-*/`) — the clone starts unatomized.

8. **Copy `TRACEABILITY.md`** if present (it provides domain term context useful to reuse).

9. Update `.planning/README.md`: add the new planning under `### 🆕 Initial` with entry `- [<target-id>](<target-id>/00-initial.md) — <intent> (cloned from <source-id>)`.

10. Report: new planning created at `.planning/<target-id>/`, N scopes copied, all statuses reset to TODO. Suggest `/plan-expand <target-id>` if the source was in INITIAL state, or `/plan-scope <target-id> scope-01` to start executing directly.

> The clone is placed in INITIAL state regardless of the source's state. Run `/plan-expand` to re-expand it if needed.
