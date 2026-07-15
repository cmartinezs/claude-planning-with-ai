---
name: plan-rollback
description: Revert a story from DONE back to TODO, removing its atomized task folder if present. Use when an execution left the code in bad state and the story must be re-run.
argument-hint: <NNN-slug> <story-NN>
allowed-tools: [Read, Write, Bash, Glob]
---

Revert a DONE story to TODO so it can be re-executed. Removes the atomized task folder if one exists.

## Arguments

`$ARGUMENTS` — format: `NNN-slug story-NN`
- `NNN-slug` — planning id (e.g. `001-jwt-auth-api`)
- `story-NN` — story to roll back (e.g. `story-03`)

## Steps

1. Parse `$ARGUMENTS` into planning ID and story ID.

2. Verify `.planning/scripts/planning-mutate.mjs` exists. If missing, stop:

   > This workspace needs the latest planning scripts. Re-run `/plan-init --force` from the project root or copy the current planning template scripts into `.planning/scripts/`.

3. Dry-run the rollback:

   ```bash
   node .planning/scripts/planning-mutate.mjs rollback <planning-id> <story-id> --dry-run
   ```

   If it fails, report the error verbatim and stop.

4. Verify every touched path is inside `.planning/active/<planning-id>/` and limited to story file, `01-expansion.md`, optional `README.md`, `RETROSPECTIVE-RAW.md`, and the atomized task folder. Stop on any unrelated path.

5. Confirm the destructive action:
   "This will reset story `<story-id>` to TODO and delete its task folder if atomized. The generated code/files are NOT reverted — you must undo those changes manually. Continue? (yes/no)"

6. Apply the rollback:

   ```bash
   node .planning/scripts/planning-mutate.mjs rollback <planning-id> <story-id>
   ```

   If available, pass the reason with `--reason "<reason>"`.

7. Report the script summary and remind the user that generated code/files were not reverted.

The script owns active preflight, `DONE` check, task-folder deletion, story/task reset, task-link stripping, `01-expansion.md` reset, optional README update, and `/plan-rollback` retrospective entry.

> Does NOT revert code changes made during the story's execution. You must undo those separately (e.g., `git checkout` or `git revert`).
