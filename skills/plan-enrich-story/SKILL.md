---
name: plan-enrich-story
description: Enrich an active planning story by delegating story lookup, section detection, approved section appends, and edge-case recording to the shared planning-story script.
argument-hint: <NNN-slug> <story-NN>
allowed-tools: [Bash, Read]
---

Enrich a story already inside `.planning/active/<planning-id>/02-deepening/` without changing its execution status.

## Arguments

`$ARGUMENTS` — format: `NNN-slug story-NN`.

## Steps

1. Parse the planning ID and story ID.
2. Inspect the active planning story:
   ```bash
   node .planning/scripts/planning-story.mjs planning-inspect <planning-id> <story-NN>
   ```
3. Read `00-initial.md`, `01-expansion.md`, and the target story when more context is needed.
4. Diagnose ambiguity, missing tasks, weak done criteria, missing context, undefined acceptance conditions, or unclear dependencies.
5. Propose specific section additions or replacements and wait for user approval.
6. Append approved new sections through the shared script:
   ```bash
   node .planning/scripts/planning-story.mjs planning-enrich-story <planning-id> <story-NN> --section "Heading::Approved content" --write
   ```
7. Verify the enriched story remains consistent with docs contracts and glossary terms. Record any manual follow-up needed.
8. Report sections changed.

Layer boundary: this command only edits `.planning/active/` in the current working directory. If the source backlog story needs enrichment, use `/us-enrich`.
