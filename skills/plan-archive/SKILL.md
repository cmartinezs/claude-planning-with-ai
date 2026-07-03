---
name: plan-archive
description: Audit a completed planning and archive it to `finished/`. Runs AUDIT-PLANNING then moves the folder.
argument-hint: the planning id to archive (e.g. `001-user-auth-api`)
allowed-tools: [Read, Write, Bash, Glob]
---

Audit a completed planning and archive it to `finished/`. Runs AUDIT-PLANNING then moves the folder.

Reference workflow: `.planning/WORKFLOWS/03-MAINTENANCE-WORKFLOWS/AUDIT-PLANNING.md`

## Arguments

`$ARGUMENTS` — the planning id to archive (e.g. `001-user-auth-api`)

## Steps

1. Locate `.planning/active/$ARGUMENTS/`. If it doesn't exist, stop and report.
2. **Audit — AUDIT-PLANNING workflow:**
   a. Verify all stories in `02-deepening/` have status `DONE`. If any are not → stop, list pending stories.
   b. Verify all tasks in each story have their documented output. If any are missing → list them and stop.
   c. Verify `TRACEABILITY.md` is fully populated (no empty cells for evaluated terms).
   d. Verify no open inconsistencies remain unaddressed.
   e. Verify `README.md` has a completed `## Retrospective` section. If missing or still placeholder-only, read `RETROSPECTIVE-RAW.md`; if raw entries exist, invoke `/plan-retrospective $ARGUMENTS` and re-check. If the retrospective is still missing or placeholder-only, ask the user to complete it before proceeding.
   f. Execute `MILESTONE-FEEDBACK` (`.planning/WORKFLOWS/03-MAINTENANCE-WORKFLOWS/MILESTONE-FEEDBACK.md`) if not already done — summarize key outcomes and decisions in the retrospective.
3. **Archive:**
   a. Move `.planning/active/$ARGUMENTS/` to `.planning/finished/$ARGUMENTS/`.
   b. Update `.planning/active/README.md` — remove the entry for this planning.
   c. Update `.planning/finished/README.md` — add entry: `- [NNN-slug](NNN-slug/) — <intent> (COMPLETED <date>)`.
   d. Update `.planning/README.md` root index — move from active section to `### ✅ Completed`.
4. Update `.planning/TRACEABILITY-GLOBAL.md` with any final terms from this planning.
5. Report: planning archived to `finished/`, indexes updated.
