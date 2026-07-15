---
name: plan-clone
description: Clone a planning into a new one with a fresh ID — copies story structure and resets all statuses to TODO. Use to repeat a proven pattern in a new context.
argument-hint: <NNN-source-slug> <NNN-target-slug>
allowed-tools: [Read, Write, Bash, Glob]
---

Clone an existing planning into a new INITIAL-state planning, preserving story definitions but resetting all execution state.

## Arguments

`$ARGUMENTS` — format: `NNN-source-slug NNN-target-slug`
- `NNN-source-slug` — ID of the planning to clone (any state: INITIAL, active, or finished)
- `NNN-target-slug` — ID for the new planning (must not exist yet)

## Steps

1. Parse `$ARGUMENTS` into source ID and target ID.

2. Verify `.planning/scripts/planning-mutate.mjs` exists. If missing, stop and report:

   > This workspace needs the latest planning scripts. Re-run `/plan-init --force` from the project root or copy the current planning template scripts into `.planning/scripts/`.

3. Run a dry run first:

   ```bash
   node .planning/scripts/planning-mutate.mjs clone <source-id> <target-id> --dry-run
   ```

   If the script fails, report the error verbatim and stop. Do not manually recreate clone steps after a failed script run.

4. Read the dry-run touched paths. Confirm they are limited to:
   - `.planning/<target-id>/`
   - `.planning/<target-id>/**`
   - `.planning/README.md`

   If any other path appears, stop and report it as unexpected.

5. Apply the clone:

   ```bash
   node .planning/scripts/planning-mutate.mjs clone <source-id> <target-id>
   ```

6. Report the script summary:
   - source path
   - target path
   - number of story files copied
   - whether `.planning/README.md` was updated
   - next command suggestion from the script

The script performs the mechanical mutation:
- locate source in `.planning/`, `.planning/active/`, or `.planning/finished/`;
- reject an existing target in any planning state;
- copy `.planning/_template/` to `.planning/<target-id>/`;
- copy and reset `00-initial.md`;
- copy and reset `01-expansion.md` when present;
- copy only story markdown files from `02-deepening/` and reset task/story statuses;
- skip task folders so the clone starts unatomized;
- copy `TRACEABILITY.md` when present;
- update the root `.planning/README.md` initial section.

> The clone is placed in INITIAL state regardless of the source's state. Run `/plan-expand` to re-expand it if needed.
