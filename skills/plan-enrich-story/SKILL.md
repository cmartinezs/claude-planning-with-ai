---
name: plan-enrich-story
description: Enrich a user story that is underspecified, ambiguous, or incomplete. Does not change story status — only deepens the definition so it is ready to execute.
argument-hint: <NNN-slug> <story-NN>  (e.g. 001-user-auth-api story-03)
allowed-tools: [Read, Write, Bash, Glob]
---

Enrich a user story that is underspecified, ambiguous, or incomplete. Does not change story status — only deepens the definition so it is ready to execute.

Reference workflows:
- `.planning/WORKFLOWS/02-EXECUTION-WORKFLOWS/EXPAND-ELEMENT.md`
- `.planning/WORKFLOWS/04-SUB-WORKFLOWS/CHECK-AGNOSTIC-BOUNDARY.md`
- `.planning/WORKFLOWS/04-SUB-WORKFLOWS/VALIDATE-GLOSSARY.md`

## Arguments

`$ARGUMENTS` — format: `NNN-slug story-NN` (e.g. `001-user-auth-api story-03`)

## Steps

1. Parse `$ARGUMENTS` to extract planning id and story id.
2. Read `.planning/active/<planning-id>/02-deepening/<story-id>-*.md`. If it doesn't exist, stop and report.
3. Read `00-initial.md` and `01-expansion.md` for broader planning context.
4. Diagnose the story for issues. Check each of the following and list which apply:
   - **Ambiguous intent** — the objective is unclear or has multiple valid interpretations.
   - **Missing tasks** — the task list is empty, too short, or skips obvious steps.
   - **Weak done criteria** — criteria are vague, untestable, or missing.
   - **Missing context** — no rationale, no reference to `docs/` contracts, no area code.
   - **Undefined acceptance conditions** — no clear pass/fail boundary for the story.
5. For each issue found, ask the user for clarification — or infer from `docs/` and planning context if sufficient information exists. Propose changes and wait for confirmation before writing.
6. Apply the enrichments to the story file:
   - Rewrite or sharpen the objective if ambiguous.
   - Add or expand tasks with enough granularity to be executable.
   - Rewrite done criteria to be specific and verifiable.
   - Fill in missing context fields (area, rationale, dependencies).
7. Execute `[CHECK-AGNOSTIC-BOUNDARY]` — verify the enriched story is consistent with `docs/` contracts.
8. Execute `[VALIDATE-GLOSSARY]` — flag any new terms that need to be added to `TRACEABILITY.md` or `GLOSSARY.md`.
9. Report: list every section that was changed and a one-line summary of what was added or improved.

> Does NOT change story status (TODO / IN PROGRESS / DONE). Does NOT execute any tasks.
