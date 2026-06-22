---
name: plan-from-epic
description: Generate a full execution planning in `.planning/active/` from a story container. One story → one story. Story done criteria come from each story's acceptance criteria and Definition of Done (if pre
argument-hint: <NNN> <path/to/container> [--filter field=value]
allowed-tools: [Read, Write, Bash, Glob]
---

Generate a full execution planning in `.planning/active/` from a story container. One story → one story. Story done criteria come from each story's acceptance criteria and Definition of Done (if present).

Works with any directory of story files or single document with story sections — not tied to a specific project structure or naming convention.

The planning is created directly in `active/` because the container already provides the full expansion structure.

## Arguments

`$ARGUMENTS` — format: `NNN path/to/container [--filter field=value]`

- `NNN` — three-digit planning number (e.g. `005`)
- `path/to/container` — a directory with story files or a single file with story sections
- `--filter field=value` — optional; include only stories where a metadata field matches a value

Examples:
```
005 docs/02-product/user-stories/epic-05-grading-assistance/
005 docs/02-product/user-stories/epic-05-grading-assistance/ --filter priority=P0
005 features/checkout/
005 docs/requirements.md --filter status=approved
```

The `--filter` field and value are matched case-insensitively against any metadata found in each story file (frontmatter, bold key-value pairs, or list items). If no stories pass the filter, stop and report.

## Steps

### 1 — Resolve the container

- If the path does not exist, stop and report.
- **Directory**: list markdown files. Identify story-shaped files (narrative + criteria). Skip pure overview files during story reading; keep them for context.
- **Single file**: identify each story-shaped section within the file.
- Apply `--filter` if provided. Report: "Found N stories (M after filter)."

### 2 — Read epic context

Look for an overview file or section (README, EPIC.md, overview section). Extract whatever is available:
- Intent / goal (for `00-initial.md` → Intent)
- Narrative / motivation (for `00-initial.md` → Why)
- Affected areas / repos (for `00-initial.md` → Approximate Scope and `01-expansion.md`)
- Dependencies on other epics or systems

If no overview exists, derive Intent and Why from the aggregate of the story narratives.

### 3 — Derive the planning slug

Strip any path prefix and numeric/structural prefix from the container name to produce a readable slug.

Examples:
- `epic-05-grading-assistance/` → `grading-assistance`
- `features/checkout/` → `checkout`
- `docs/requirements.md` → `requirements`

Full planning id: `NNN-<slug>` (e.g. `005-grading-assistance`).

### 4 — Create the planning structure

Copy `.planning/_template/` to `.planning/active/NNN-<slug>/`.

### 5 — Fill `00-initial.md`

Populate from the epic context gathered in Step 2:
- `Intent`: one-sentence goal
- `Why`: motivation / narrative
- `Approximate Scope`: list of affected areas found in the stories' Technical Notes sections, or inferred from the epic overview's scope section. Mark as `[inferred]` if not explicitly stated.
- `Requested by`: human
- `Date`: today
- Add a `## Source` note: path of the container and planning generation date

### 6 — Fill `01-expansion.md`

Build the stories table: one row per story, in the order they appear in the container.

For each story, extract:
- **Story ID**: `story-NN` (sequential, starting from `story-01`)
- **Story name**: story title in kebab-case
- **Area**: from the story's Technical Notes or equivalent field; if absent, infer from the narrative and mark as `[inferred]`
- **Priority / order**: from any priority field found in the story; if absent, preserve the file order
- **Dependencies**: from the story's Dependencies section; map referenced story IDs or titles to the corresponding `story-NN`

Build the dependency map section and the "Impact per area" summary.

Add a `## Source` section: container path, filter applied (if any), generation date.

### 7 — Create story files

For each story, create `.planning/active/NNN-<slug>/02-deepening/story-NN-<story-title>.md`:

```markdown
## Objective
[story narrative — as-a / I want / so I can, or equivalent]

> Source: [path/to/story-file or "file#section-heading"] — [story ID if present]

## Status: TODO

## Area
[from Technical Notes or [inferred]]

## Done Criteria
[merge story's criteria section + DoD section into a flat checkbox list]
[mark criteria from DoD as `(DoD)` if the story had separate DoD section]

## Tasks
- [ ] Define implementation tasks

## Technical Notes
[copy from story's Technical Notes if present; otherwise leave blank]

## Dependencies
[map story dependencies to story-NN IDs]
```

### 8 — Update indexes

- `.planning/README.md`: ensure `### 🚧 In Progress` links to `active/README.md`
- `.planning/active/README.md`: add entry for this planning with source container, story list, and filter applied

### 9 — Report

```
Planning created: .planning/active/NNN-slug/
Source: [container path] ([N stories] → [N stories])
Filter: [applied filter or "none"]

Stories:
  story-01  [story title]  [area]  [priority if any]
  story-02  [story title]  [area]  ← no DoD found, criteria from AC only
  ...

Attention:
  [list stories whose stories had no DoD or no Technical Notes — suggest /us-enrich path/story.md]

Next step: /plan-story NNN-slug story-01
```

> Stories missing DoD or Technical Notes still generate a story — area is marked `[inferred]`. Run `/us-enrich` on the source story to fill the gap upstream.
