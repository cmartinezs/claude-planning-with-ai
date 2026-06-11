---
name: plan-split-story
description: Split a scope (user story) that is too large or covers multiple concerns into two or more smaller, focused scopes. The original scope is replaced by the new ones in both `01-expansion.md` and `02-deep
argument-hint: format: `NNN-slug scope-NN` (e.g. `001-user-auth-api scope-02`)
allowed-tools: [Read, Write, Bash, Glob]
---

Split a scope (user story) that is too large or covers multiple concerns into two or more smaller, focused scopes. The original scope is replaced by the new ones in both `01-expansion.md` and `02-deepening/`.

Reference workflows:
- `.planning/WORKFLOWS/02-EXECUTION-WORKFLOWS/EXPAND-ELEMENT.md`
- `.planning/WORKFLOWS/04-SUB-WORKFLOWS/CHECK-AGNOSTIC-BOUNDARY.md`

## Arguments

`$ARGUMENTS` — format: `NNN-slug scope-NN` (e.g. `001-user-auth-api scope-02`)

## Preconditions

- The target scope must be in `TODO` or `IN PROGRESS` status.
- Splitting a `DONE` scope is not allowed — if needed, use `/plan-enrich-epic` to add new scopes instead.

## Steps

1. Parse `$ARGUMENTS` to extract planning id and scope id.
2. Read `.planning/active/<planning-id>/02-deepening/<scope-id>-*.md`. If it doesn't exist, stop and report.
3. Check scope status. If `DONE`, stop and explain the precondition. Suggest `/plan-enrich-epic` instead.
4. Read `01-expansion.md` to understand the full scope sequence and dependencies.
5. Analyze the scope and propose a split. A good split satisfies:
   - Each resulting scope has a single, clear responsibility.
   - Each resulting scope is independently executable (or the dependency is made explicit).
   - No task appears in more than one resulting scope.
   Present the proposed split to the user and wait for confirmation before proceeding.
6. Once the split is confirmed:
   a. Determine the IDs for the new scopes: if the original is `scope-02` and there are already scopes up to `scope-04`, new scopes become `scope-02a` / `scope-02b` — or renumber sequentially if the user prefers (ask).
   b. Create `.planning/active/<planning-id>/02-deepening/scope-NNa-name.md` and `scope-NNb-name.md` (and more if needed) distributing tasks from the original scope.
   c. Set each new scope's status to match the original (`TODO` → `TODO`; `IN PROGRESS` → `IN PROGRESS` on the one that continues the work, `TODO` on the rest).
   d. Update `01-expansion.md`:
      - Replace the original scope row with the new rows.
      - Update the dependency map: any scope that depended on the original now depends on the last of the new scopes (or as appropriate — clarify with user if ambiguous).
   e. Delete (or rename with a `_split-into` note in its header) the original scope file.
7. Update `.planning/active/README.md` to reflect the new scope list.
8. Run `[CHECK-AGNOSTIC-BOUNDARY]` on each new scope file to verify consistency with `docs/` contracts.
9. Report: original scope replaced by N new scopes, list them with IDs and names. Note any dependency changes made.

> If any task in the original scope was already `[x]`, carry that mark into the appropriate new scope file.
