---
name: us-enrich
description: Enrich a user story (or any story-shaped document) by adding execution-relevant sections it is missing: a testable Definition of Done, Technical Notes / affected areas, Dependencies, and a Complexity 
argument-hint: <path/to/story.md> | <story-id> | <partial-filename>
allowed-tools: [Read, Write, Bash, Glob]
---

Enrich a user story (or any story-shaped document) by adding execution-relevant sections it is missing: a testable Definition of Done, Technical Notes / affected areas, Dependencies, and a Complexity estimate.

Works with any markdown file that has a narrative statement + acceptance criteria — regardless of project structure, naming conventions, or ID format.

Layer boundary: this command enriches source backlog stories outside `.planning/`. If the story already lives in `.planning/active/<planning-id>/02-deepening/`, use `/plan-enrich-story` instead.

## Arguments

`$ARGUMENTS` — any of:
- A file path: `docs/02-product/user-stories/epic-05/01-grading.md`
- A story ID as found in the file content or filename: `US-040`, `story-3`, `FEAT-12`
- A partial filename: `rubric-based-grading` (resolved if unambiguous)

## Steps

### 1 — Resolve the path

- If `$ARGUMENTS` looks like a file path → use it directly.
- Otherwise → search recursively from the current working directory for a markdown file whose content or filename matches the argument. If multiple candidates are found, list them and ask which one.
- If the file does not exist, stop and report.

### 2 — Read and identify structure

Read the file. Identify:

| Element | What to look for |
|---------|-----------------|
| **Narrative** | An "As a / I want / so I can" statement, or any paragraph describing a user-facing intent |
| **Criteria** | A section titled Acceptance Criteria, Requirements, Tests, Checklist, or a bullet list that describes when the story is done |
| **Existing enrichment** | Any section that already covers DoD, Technical Notes, Dependencies, or Complexity — even under different names |

Report what was found:
```
Found story: [title or first heading]
  Narrative:  ✓ (line NN)
  Criteria:   ✓ (N items)
  DoD:        ✗ missing
  Tech Notes: ✗ missing
  Dependencies: ✗ missing
  Complexity: ✗ missing
```

If all enrichment sections already exist with non-placeholder content → report "already enriched" and stop.

### 3 — Find epic context (optional)

Look for an "epic container" around the story:
- If the file is in a directory → check for a `README.md`, `EPIC.md`, `overview.md`, or similar in the same or parent directory.
- If found → read it for narrative, scope, and dependencies to inform the enrichment proposals.
- If not found → proceed without epic context; note this in proposals.

### 4 — Propose enrichments

For each missing section, infer a **proposed value** from the story content + any epic context found, and present it to the user for confirmation. Wait for approval before writing. If the user provides different content, use theirs.

Shared enrichment checklist:
- Objective or narrative is unambiguous.
- Done criteria are specific, binary, and verifiable.
- Affected areas or implementation notes are explicit.
- Dependencies on stories, systems, decisions, or teams are recorded.
- Complexity/risk is visible enough to plan execution.

Inference rules:
- **Definition of Done** — derive from the criteria bullets, making each verifiable: add persistence, UI state, agent log, approval event requirements as applicable. Reference the epic DoD if available.
- **Technical Notes / Area** — infer affected areas from the story domain and any filenames or system names mentioned in the narrative and criteria.
- **Dependencies** — look for references to other stories, epics, or systems in the file content; cross-reference any siblings in the same container.
- **Complexity** — estimate from criteria count and number of affected areas: 1–3 criteria + 1 area = S; 4–6 criteria or 2 areas = M; 7+ criteria or 3+ areas = L.

### 5 — Write enrichment

Append the missing sections to the file. Mirror the **formatting style** of the existing sections (heading level, checkbox style, list indentation) rather than imposing a fixed template. If there is no established style, use the template in `docs/02-product/user-stories/_template-user-story.md` if it exists, or a sensible default.

### 6 — Report

List each section added with a one-line summary of what was written.

> Does NOT create any planning. To generate an execution planning after enriching stories, use `/plan-from-epic`.
