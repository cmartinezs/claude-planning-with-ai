---
name: epic-enrich
description: Add missing backlog stories to an existing epic or story container while delegating container inspection, ID assignment, story drafting, and index updates to the shared planning-story script.
argument-hint: <path/to/epic-dir/> | <path/to/stories.md>
allowed-tools: [Bash, Read]
---

Add new stories to an existing backlog story container after identifying coverage gaps.

## Arguments

`$ARGUMENTS` — a story directory or a single markdown file with story sections.

## Steps

1. Inspect the container:
   ```bash
   node .planning/scripts/planning-story.mjs backlog-inspect <container>
   ```
2. Read the epic overview or top-level context when present.
3. Identify product coverage gaps: missing edge paths, missing actor perspectives, epic acceptance criteria without a story, implicit prerequisites, or complementary flows.
4. Ask which gaps the user wants to add. For each selected story, gather title, narrative, acceptance criteria, and optional enrichment details.
5. Generate each story as a dry-run using the same shared script:
   ```bash
   node .planning/scripts/planning-story.mjs backlog-new <container> --title "<title>" --narrative "<story>" --criteria "<criteria separated by |>"
   ```
6. After approval, rerun each accepted command with `--write`.
7. Report stories added and suggest the next planning command:
   - No planning exists yet: `/plan-from-epic <name> <container>`
   - Planning already exists: `/plan-enrich-epic <NNN-slug>`

Layer boundary: this command edits product/backlog containers. If the missing work belongs to an already active planning, use `/plan-enrich-epic`.
