---
name: epic-enrich
description: Add new stories to an existing story container. Reads the current content, identifies gaps in coverage, and guides the addition of new stories. Works with any directory of story files or single docume
argument-hint: path to the story container:
allowed-tools: [Read, Write, Bash, Glob]
---

Add new stories to an existing story container. Reads the current content, identifies gaps in coverage, and guides the addition of new stories. Works with any directory of story files or single document with story sections.

## Arguments

`$ARGUMENTS` — path to the story container:
- A directory: `docs/02-product/user-stories/epic-05-grading-assistance/`
- A single file with story sections: `docs/features.md`, `requirements.md`
- Any directory with story-shaped markdown files

## Steps

### 1 — Resolve and read the container

- If the path does not exist, stop and report.
- **Directory**: read all markdown files in the directory. Identify story-shaped files (files with a narrative statement + criteria section). Skip pure overview/README files during story reading, but keep them for epic context.
- **Single file**: identify each story-shaped section within the file.
- Report: "Found N stories in [container]."

### 2 — Read epic context

Look for an overview file (README, EPIC.md, overview.md, or similar) in the same directory or as the top-level section of a single file. Extract:
- Goal / narrative of the epic
- In-scope / out-of-scope items (if defined)
- Epic-level acceptance criteria or DoD (if defined)
- Dependencies on other epics or systems (if defined)

### 3 — Identify coverage gaps

Analyze the existing stories against the epic goal and scope. Look for:
- **Missing error/edge paths**: what happens when an agent fails, a submission is malformed, a required resource doesn't exist
- **Missing actor perspectives**: roles mentioned in the epic narrative that have no story covering their view
- **Epic AC items without a story**: acceptance criteria at the epic level that no individual story seems to implement
- **Implicit prerequisites**: actions that other stories assume are possible but that no story defines
- **Missing complementary flows**: e.g. "create" exists but "delete" or "edit" does not, if those are in scope

Present gaps as a numbered list. Ask: "¿Cuáles quieres agregar? (números, describe tu propia idea, o 'ninguno')"

### 4 — Add selected stories

For each story the user wants to add, run the `/us-new` interactive flow using the same container path:
- Mirror the format conventions found in existing stories (ID scheme, section names, filename pattern)
- Story content, criteria, and optional enrichment sections (DoD, Technical Notes, Dependencies, Complexity)
- Write the file / section and update any index

### 5 — Report

N stories added, list them with IDs (if applicable) and titles. If the container is linked from a parent index, note whether it was updated. Suggest next step based on context:
- If no planning exists for this container: `/plan-from-epic NNN path/to/container`
- If a planning already exists: `/plan-enrich-epic NNN-slug`

> If the user describes a story with more than ~7 acceptance criteria, suggest splitting it into two before writing.
