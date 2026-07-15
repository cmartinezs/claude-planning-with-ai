---
name: plan-enrich-epic
description: Add new stories to an active planning by delegating story numbering, expansion table updates, story file creation, and edge-case recording to the shared planning-story script.
argument-hint: <NNN-slug>
allowed-tools: [Bash, Read]
---

Extend an active planning by adding new planning stories discovered after the initial expansion.

## Arguments

`$ARGUMENTS` — the planning ID, for example `001-user-auth-api`.

## Steps

1. Inspect the active planning:
   ```bash
   node .planning/scripts/planning-story.mjs planning-inspect <planning-id>
   ```
2. Read `00-initial.md` and `01-expansion.md` when needed to understand context and dependencies.
3. Ask what new stories to add, or propose stories from the current conversation and planning context.
4. For each approved story, prepare title, area code, dependencies, task summary, done criteria, risk, and external issue when available.
5. Generate the dry-run:
   ```bash
   node .planning/scripts/planning-story.mjs planning-add-story <planning-id> --title "<title>" --area "<code>" --dependencies "<list>" --tasks "<tasks separated by |>" --done "<criteria separated by |>"
   ```
6. After approval, rerun with `--write`.
7. Validate docs-contract consistency and glossary implications for each added story.
8. Report new story IDs, files, dependency changes, and follow-up `/plan-atomize` or `/plan-test-suite` work.

Layer boundary: this command only edits `.planning/active/<planning-id>/` in the current working directory. If a product/backlog epic needs more source stories before planning, use `/epic-enrich`.
