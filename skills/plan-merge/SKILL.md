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

2. Verify `.planning/scripts/planning-mutate.mjs` exists. If missing, stop:

   > This workspace needs the latest planning scripts. Re-run `/plan-init --force` from the project root or copy the current planning template scripts into `.planning/scripts/`.

3. Run the dry run:

   ```bash
   node .planning/scripts/planning-mutate.mjs merge <source-id> <story-id> <target-id> --dry-run
   ```

   If the script fails, report its error verbatim and stop. Do not manually move files after a failed script run.

4. Verify every touched path from dry-run is inside one of these two planning roots:
   - `.planning/active/<source-id>/`
   - `.planning/active/<target-id>/`

   The expected files are `01-expansion.md`, `README.md`, `RETROSPECTIVE-RAW.md`, the old/new story file, and the old/new atomized task folder when present. If any unrelated path appears, stop.

5. **Confirm before proceeding:**
   "Move `<story-id>` from `<source-id>` to `<target-id>` as `<new-story-id>`? (yes/no)"
   Wait for confirmation.

6. Apply the move:

   ```bash
   node .planning/scripts/planning-mutate.mjs merge <source-id> <story-id> <target-id>
   ```

7. Report the script summary:
   - old and new story IDs
   - old and new story paths
   - whether the task folder was moved
   - whether source appears ready for `/plan-archive`
   - any dependency follow-ups from the script

The script owns the mechanical mutation: active-only preflight, `DONE` rejection, target story numbering, story/task-folder move, internal markdown reference rewrites, `01-expansion.md` row movement, README story index update, and `/plan-merge` entries in both `RETROSPECTIVE-RAW.md` files.

> Dependency references in `Depends On` fields are not automatically updated. Review them manually after the move.
