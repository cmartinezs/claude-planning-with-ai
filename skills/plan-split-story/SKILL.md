---
name: plan-split-story
description: Split a story (user story) that is too large or covers multiple concerns into two or more smaller, focused stories. The original story is replaced by the new ones in both `01-expansion.md` and `02-deep
argument-hint: <NNN-slug> <story-NN>  (e.g. 001-user-auth-api story-02)
allowed-tools: [Read, Write, Bash, Glob]
---

Split a story (user story) that is too large or covers multiple concerns into two or more smaller, focused stories. The original story is replaced by the new ones in both `01-expansion.md` and `02-deepening/`.

Layer boundary: this command edits an active planning. If the oversized story exists only in the product backlog, use `/us-split` instead.

Reference workflows:
- `.planning/WORKFLOWS/02-EXECUTION-WORKFLOWS/EXPAND-ELEMENT.md`
- `.planning/WORKFLOWS/04-SUB-WORKFLOWS/CHECK-AGNOSTIC-BOUNDARY.md`
- `.planning/WORKFLOWS/03-MAINTENANCE-WORKFLOWS/RECORD-EDGE-CASE.md`

## Arguments

`$ARGUMENTS` — format: `NNN-slug story-NN` (e.g. `001-user-auth-api story-02`)

## Preconditions

- The target story must be in `TODO` or `IN PROGRESS` status.
- Splitting a `DONE` story is not allowed — if needed, use `/plan-enrich-epic` to add new stories instead.

## Steps

1. Parse `$ARGUMENTS` to extract planning id and story id.
2. Read `.planning/active/<planning-id>/02-deepening/<story-id>-*.md`. If it doesn't exist, stop and report.
3. Check story status. If `DONE`, stop and explain the precondition. Suggest `/plan-enrich-epic` instead.
4. Read `01-expansion.md` to understand the full story sequence and dependencies.
5. Analyze the story and propose a split. A good split satisfies:
   - Each resulting story has a single, clear responsibility.
   - Each resulting story is independently executable (or the dependency is made explicit).
   - No task appears in more than one resulting story.
   Present the proposed split to the user and wait for confirmation before proceeding.
6. Once the split is confirmed:
   a. Determine the IDs for the new stories: if the original is `story-02` and there are already stories up to `story-04`, new stories become `story-02a` / `story-02b` — or renumber sequentially if the user prefers (ask).
   b. Create `.planning/active/<planning-id>/02-deepening/story-NNa-name.md` and `story-NNb-name.md` (and more if needed) distributing tasks from the original story.
   c. Set each new story's status to match the original (`TODO` → `TODO`; `IN PROGRESS` → `IN PROGRESS` on the one that continues the work, `TODO` on the rest).
   d. Update `01-expansion.md`:
      - Replace the original story row with the new rows.
      - Update the dependency map: any story that depended on the original now depends on the last of the new stories (or as appropriate — clarify with user if ambiguous).
   e. Delete (or rename with a `_split-into` note in its header) the original story file.
7. Update `.planning/active/README.md` to reflect the new story list.
8. Run `[CHECK-AGNOSTIC-BOUNDARY]` on each new story file to verify consistency with `docs/` contracts.
9. Execute `[RECORD-EDGE-CASE]` with source `/plan-split-story`, original story, new stories, and dependency changes.
10. Report: original story replaced by N new stories, list them with IDs and names. Note any dependency changes made.

> If any task in the original story was already `[x]`, carry that mark into the appropriate new story file.
