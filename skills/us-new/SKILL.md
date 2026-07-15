---
name: us-new
description: Add a new user story to an existing backlog story container by delegating mechanical ID, filename, draft rendering, and index updates to the shared planning-story script.
argument-hint: <path/to/container> [--interactive | --blank]
allowed-tools: [Bash, Read]
---

Add a new user story to an existing backlog container. A container is either a directory of story files or a single markdown document with story sections.

## Arguments

`$ARGUMENTS` — format: `path/to/container [--interactive | --blank]`

## Steps

1. Parse `$ARGUMENTS` and identify the container path and whether `--blank` was requested.
2. Inspect the container:
   ```bash
   node .planning/scripts/planning-story.mjs backlog-inspect <container>
   ```
3. If interactive mode is active, ask only for missing content: title, priority when the container uses one, narrative, acceptance criteria, and optional enrichment content.
4. Generate the draft without writing:
   ```bash
   node .planning/scripts/planning-story.mjs backlog-new <container> --title "<title>" --narrative "<story>" --criteria "<criteria separated by |>"
   ```
   Add `--blank` for a blank template and `--priority "<value>"` when applicable.
5. Show the script output and wait for user approval.
6. After approval, run the same command with `--write`.
7. Report the created path, assigned ID, and whether the container index was updated. Suggest `/us-enrich <path>` if enrichment sections were skipped.

Layer boundary: this command edits source backlog artifacts only. It must not create or modify `.planning/` files.
