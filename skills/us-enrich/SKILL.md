---
name: us-enrich
description: Enrich a backlog user story with execution-ready sections while delegating path resolution, section detection, and deterministic appends to the shared planning-story script.
argument-hint: <path/to/story.md> | <story-id> | <partial-filename>
allowed-tools: [Bash, Read]
---

Enrich a source backlog story with missing execution details: Definition of Done, Technical Notes, Dependencies, Complexity, or other project-specific sections.

## Arguments

`$ARGUMENTS` — a story file path, story ID, or partial filename.

## Steps

1. Run the script in read-only mode to resolve the story and detect current sections:
   ```bash
   node .planning/scripts/planning-story.mjs backlog-enrich <story-ref>
   ```
2. Read any nearby epic context only when needed to infer good section content.
3. Propose the missing enrichment sections to the user. Keep product judgment in the skill: the script only appends approved sections.
4. After approval, write the approved sections with repeated `--section "Heading::Body"` arguments:
   ```bash
   node .planning/scripts/planning-story.mjs backlog-enrich <story-ref> --section "Definition of Done::<approved bullets>" --section "Technical Notes::<approved notes>" --write
   ```
5. Report the file changed and the sections added.

Layer boundary: this command enriches source backlog stories outside `.planning/`. If the story already lives under `.planning/active/<planning-id>/02-deepening/`, use `/plan-enrich-story`.
