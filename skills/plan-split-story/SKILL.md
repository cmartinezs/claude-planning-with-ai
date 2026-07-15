---
name: plan-split-story
description: Split an active planning story by delegating task-row movement, new story numbering, expansion table updates, story file creation, and edge-case recording to the shared planning-story script.
argument-hint: <NNN-slug> <story-NN>
allowed-tools: [Bash, Read]
---

Split a planning story that is too large or mixes concerns into smaller focused stories.

## Arguments

`$ARGUMENTS` — format: `NNN-slug story-NN`.

## Preconditions

- The target story must be `TODO` or `IN PROGRESS`.
- Splitting a `DONE` story is not allowed; add a follow-up story with `/plan-enrich-epic` instead.

## Steps

1. Inspect the target story:
   ```bash
   node .planning/scripts/planning-story.mjs planning-inspect <planning-id> <story-NN>
   ```
2. Read the story file and `01-expansion.md`.
3. Decide the split with product judgment: what stays, what moves, dependency impact, and title of the new story.
4. Ask the user to confirm the split, including task row numbers that move.
5. Generate the dry-run:
   ```bash
   node .planning/scripts/planning-story.mjs planning-split-story <planning-id> <story-NN> --new-title "<title>" --move-tasks "<1,2>"
   ```
6. After approval, rerun with `--write`.
7. Validate docs-contract consistency and glossary implications for each resulting story.
8. Report original story, new story, moved tasks, dependency changes, and follow-up atomization/test-suite work.

Layer boundary: this command only edits `.planning/active/` in the current working directory. If the oversized story exists only in the product backlog, use `/us-split`.
