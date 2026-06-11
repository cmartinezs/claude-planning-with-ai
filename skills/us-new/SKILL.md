---
name: us-new
description: Add a new user story to an existing story container. A container is either a directory of story files or a single document with story sections. The command mirrors the format and conventions it finds 
argument-hint: format: `path/to/container [--interactive | --blank]`
allowed-tools: [Read, Write, Bash, Glob]
---

Add a new user story to an existing story container. A container is either a directory of story files or a single document with story sections. The command mirrors the format and conventions it finds — it does not impose a fixed structure.

## Arguments

`$ARGUMENTS` — format: `path/to/container [--interactive | --blank]`
- `path/to/container` — a directory of story files OR a single markdown file with story sections
- `--interactive` — Claude asks questions and fills the story from your answers **(default)**
- `--blank` — creates a story from a blank template for manual editing

The container can be:
- A directory: `docs/02-product/user-stories/epic-05-grading-assistance/`
- Any other directory with story-shaped markdown files: `features/checkout/`, `specs/`
- A single file with story sections: `docs/requirements.md`, `features.md`

## Steps

### 1 — Resolve and read the container

- If the path does not exist, stop and report.
- **Directory**: read all markdown files (excluding README-like overview files). Identify their story structure — narrative format, ID convention (US-NNN, FEAT-NNN, none), priority values (P0/P1, High/Low, none), filename pattern, section names used.
- **Single file**: read the file, identify each story-shaped section by looking for narrative statements + criteria subsections.
- Report: "Found N stories in [container]. Format: [description]. Next ID would be: [X]."

### 2 — Find an epic overview (optional)

In a directory: look for a `README.md`, `EPIC.md`, `overview.md`, or similar in the same directory. Read it for narrative, goal, and scope — used to inform story creation.

In a single file: use any top-level section that describes the overall goal or context.

### 3 — Determine identifiers for the new story

- **ID**: scan all existing stories to find the highest ID number (in whatever format they use). Increment by 1. If no ID convention is found, omit the ID field.
- **Filename** (directory mode): use the next sequence number + a kebab-case title derived from the user's answer. Mirror the existing naming pattern.
- **Section title** (single-file mode): use a heading at the same level as existing story headings.

### 4 — Gather content

**Interactive mode** — ask these questions one at a time, adapting the phrasing to match the conventions found in the container:

| # | Question | Maps to |
|---|----------|---------|
| 1 | ¿Cómo se llama esta story? (título corto) | Filename + heading |
| 2 | ¿Cuál es la prioridad? (adapt to found values, or skip if none used) | Priority field |
| 3 | Escribe el enunciado narrativo de la story | Narrative section |
| 4 | Lista los criterios de aceptación (uno por línea) | Criteria section |
| 5 | ¿Quieres agregar DoD / Technical Notes / Dependencies / Complexity ahora? (sí / skip) | Enrichment sections |

Questions 2 and 5 can be skipped. If priority values are not used in the container, skip question 2 automatically.

**Blank mode** — write a template that mirrors the structure of existing stories in the container, with all fields as placeholders.

### 5 — Write the new story

- **Directory**: create a new file at `[container]/[NN]-[title].md`.
- **Single file**: append a new story section at the end of the file using the same heading depth as sibling stories.

### 6 — Update indexes

- **Directory**: if a README or overview file exists in the container, add a row for the new story to any stories table found in it.
- Look one level up for a parent index file (e.g. `docs/02-product/user-stories/README.md`) — if it contains a story count or index for this container, increment/update it.

### 7 — Report

File or section created, path, ID assigned, indexes updated. Suggest `/us-enrich [path]` if enrichment sections were skipped.
