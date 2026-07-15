---
name: us-split
description: Split an oversized backlog user story by delegating mechanical acceptance-criteria movement, new filename allocation, cross-reference writing, and index updates to the shared planning-story script.
argument-hint: <path/to/story.md>
allowed-tools: [Bash, Read]
---

Split an oversized or mixed-concern backlog story into two focused stories. The original keeps the core flow; the new story receives the extracted behavior.

## Arguments

`$ARGUMENTS` — path or unambiguous reference to the backlog story file.

## Steps

1. Inspect the target story and its container:
   ```bash
   node .planning/scripts/planning-story.mjs backlog-inspect <story-ref>
   ```
2. Read the story content and decide the product split: what stays, what moves, and the title of the new story.
3. Ask the user to confirm the split, including the acceptance criteria numbers that will move.
4. Generate the dry-run:
   ```bash
   node .planning/scripts/planning-story.mjs backlog-split <story-ref> --new-title "<title>" --move-ac "<1,2>"
   ```
5. After approval, run the same command with `--write`.
6. Report the original file, new file, moved acceptance criteria, and whether follow-up `/us-enrich` is needed.

Layer boundary: this command edits source backlog artifacts only. If the story is already copied into an active planning, use `/plan-split-story` for the planning story.
