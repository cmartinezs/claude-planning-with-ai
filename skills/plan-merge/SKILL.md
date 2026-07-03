---
name: plan-merge
description: Move a story from one active planning to another — updates both 01-expansion.md files, relocates the story file, and preserves atomized task folders.
argument-hint: <NNN-source> <story-NN> <NNN-target>
allowed-tools: [Read, Write, Bash, Glob]
---

Move a story from one planning to another. Useful when reorganizing work reveals a story belongs to a different initiative.

## Arguments

`$ARGUMENTS` — format: `NNN-source story-NN NNN-target`
- `NNN-source` — planning ID that currently owns the story (e.g. `001-jwt-auth-api`)
- `story-NN` — the story to move (e.g. `story-03`)
- `NNN-target` — planning ID to receive the story (e.g. `002-api-platform`)

## Steps

1. Parse `$ARGUMENTS` into source ID, story ID, and target ID.

2. Verify both plannings exist in `.planning/active/`. If either is not in `active/`, stop and report which one is missing or not in active state.

3. Locate the story file: `.planning/active/<source-id>/02-deepening/<story-id>-*.md`. If not found, stop and report.

4. Read the story file and verify its status is not `DONE`. If DONE, stop: "cannot move a DONE story — it is already part of the source planning's history".

5. Determine the new story number in the target planning: read the existing story files in `.planning/active/<target-id>/02-deepening/` to find the highest existing story-NN number, then assign the next one (e.g., if story-03 is highest, the moved story becomes story-04).

6. **Confirm before proceeding:**
   "Move `<story-id>` from `<source-id>` to `<target-id>` as `<new-story-id>`? (yes/no)"
   Wait for confirmation.

7. **Execute the move:**
   a. Rename the story file from `<story-id>-<name>.md` to `<new-story-id>-<name>.md` and move it to `.planning/active/<target-id>/02-deepening/`.
   b. Update the story number reference inside the moved file (header fields, any self-referencing links).
   c. If a task folder exists (`02-deepening/<story-id>-<name>/`): move it to the target as `02-deepening/<new-story-id>-<name>/` and update internal task file references to the new story ID.

8. **Update source planning:**
   a. Remove the story row from `.planning/active/<source-id>/01-expansion.md`.
   b. Update `.planning/active/<source-id>/README.md` to remove the story entry.
   c. Check if the source planning now has all remaining stories DONE/SKIPPED. If yes, suggest `/plan-archive <source-id>`.

9. **Update target planning:**
   a. Add a new row for the moved story in `.planning/active/<target-id>/01-expansion.md`.
   b. Update `.planning/active/<target-id>/README.md` to add the story entry.

10. Execute `[RECORD-EDGE-CASE]` in both affected plannings' `RETROSPECTIVE-RAW.md` files with source `/plan-merge`, the old/new story IDs, and any dependency follow-up.

11. Report: story moved from `<source-id>/<old-story-id>` to `<target-id>/<new-story-id>`. If task folder was moved, confirm that too. List any follow-up actions needed (e.g., dependency updates if the story depended on other stories in the source planning).

> Dependency references in `Depends On` fields are not automatically updated. Review them manually after the move.
