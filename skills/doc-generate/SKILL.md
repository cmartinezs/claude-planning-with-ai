---
name: doc-generate
description: Generate documentation from planning artifacts (inline docs, ADRs, changelogs, user guides) at task, story, or planning level.
argument-hint: <NNN-slug> [<story-NN> [<task-NN>]]  (e.g. 001-user-auth-api story-01 task-02)
allowed-tools: [Read, Write, Bash, Glob, Grep]
---

Generate documentation from planning artifacts. Detects the level (task / story / planning) from the number of tokens in `$ARGUMENTS` and the area code from the story file, then writes to `docs/`.

**Area → document matrix:**

| Area | Inline doc | ADR | Changelog | User guide |
|------|-----------|-----|-----------|------------|
| WB   | ✅        | —   | ✅        | ✅         |
| AP   | ✅        | ✅  | ✅        | ✅         |
| IN   | —         | ✅  | —         | —          |
| AG   | ✅        | ✅  | —         | —          |
| DO   | silent no-op | | |           |
| W    | silent no-op | | |           |
| unknown/custom | ✅ | ✅ | ✅ | ✅  |

## Arguments

`$ARGUMENTS` — one of:
- `NNN-slug story-NN task-NN` — **task level** (3 tokens)
- `NNN-slug story-NN` — **story level** (2 tokens)
- `NNN-slug` — **planning level** (1 token)

## Steps

### 0. Parse arguments and detect level

Split `$ARGUMENTS` on whitespace:
- 3 tokens → task level. `planning-id` = token 1, `story-id` = token 2, `task-id` = token 3.
- 2 tokens → story level. `planning-id` = token 1, `story-id` = token 2.
- 1 token → planning level. `planning-id` = token 1.
- Any other count: stop and report usage.

---

## Task level

### T1. Locate task file

Find `.planning/active/<planning-id>/02-deepening/<story-id>-*/<task-id>-*.md`. If not found, stop and report. Read the file completely: Objective, Technical Design, Implementation Steps, Unit Tests, Done Criteria.

### T2. Determine area

Read the story file `.planning/active/<planning-id>/02-deepening/<story-id>-*.md`. Look for a field named `Area:` or `Repository Area:` (case-insensitive, anywhere in the file). Extract the area code (e.g. `WB`, `AP`, `IN`, `AG`, `DO`, `W`). If not found, treat as `unknown`.

### T3. Area gate

If area is `DO` or `W`: exit silently (no output, no files written).

### T4. Ensure docs/ exists

If `docs/` does not exist at the project root, create it with `mkdir -p docs/guides docs/adr docs/changelog`.

### T5. Inline doc  (areas: WB, AP, AG, unknown)

Skip this step for area `IN`.

- Target path: `docs/guides/<planning-id>/<story-id>/<task-id>.md`
- Create parent directories if needed.
- Extract from task file:
  - **Objective** section (or first descriptive paragraph)
  - **Implementation Steps** section — derive usage instructions (interfaces, endpoints, props, schemas) from these steps; do not copy raw implementation steps verbatim
  - **Done Criteria** section — use as supplementary detail

**If the file does not exist**, write:

```markdown
# <component name — derived from Objective>

**Source:** <task-id> | **Area:** <area> | **Date:** <today>

## What it does
<Objective section verbatim or lightly paraphrased>

## How to use it
<Derived from Implementation Steps: public API, endpoints, props, schemas — written as usage instructions, not implementation steps>

## Example
<Minimal usage example inferred from the component type and interfaces exposed>
```

**If the file already exists**, append:

```markdown

---

## Update — <today>

**Source:** <task-id>

### What changed
<Objective section verbatim or lightly paraphrased>

### How to use it
<Derived from Implementation Steps>

### Example
<Minimal usage example>
```

### T6. ADR  (areas: IN, AP, AG, unknown)

Skip this step for area `WB`.

- Scan the `Technical Design` section of the task file for decision indicator phrases: "chose", "decided to", "over", "instead of", "alternative discarded", "alternative considered", "rejected", "we avoid".
- If Technical Design is empty or absent, or no indicator phrases are found: report "no architectural decision detected — ADR skipped" and skip this step.
- Derive `task-slug`: take the task filename, remove the leading `task-NN-` prefix, and strip the `.md` extension.
- Target path: `docs/adr/<YYYY-MM-DD>-<task-slug>.md` where `<YYYY-MM-DD>` is today's date.

**If the file does not exist**, write:

```markdown
# ADR: <task Objective as title>

**Date:** <today>
**Status:** Accepted
**Planning:** <planning-id> / <story-id> / <task-id>

## Context
<Technical Design — Approach field, or the full Technical Design section if no labelled fields>

## Decision
<Sentences from Technical Design that contain decision indicator phrases>

## Consequences
<Technical Design — Design notes field, or any consequences mentioned>

## Alternatives Considered
<Sentences containing "alternative", "discarded", "rejected", "instead of" — or "None documented" if none found>
```

**If the file already exists**, append:

```markdown

---

## Revision — <today>

**Source:** <task-id>

### Decision
<Sentences with decision indicators>

### Alternatives Considered
<Sentences with alternative/discarded/rejected/instead of — or "None documented">
```

### T7. Report

List every file written and every sub-step skipped with the reason.

---

## Story level

### S1. Locate story file

Find `.planning/active/<planning-id>/02-deepening/<story-id>-*.md`. If not found, stop and report. Read it completely: name, objective, area, done criteria, task list.

### S2. Determine area

Same as T2: look for `Area:` or `Repository Area:`. Treat missing as `unknown`.

### S3. Area gate

If area is `DO` or `W`: exit silently.

### S4. Ensure docs/ exists

If `docs/` does not exist, create `docs/guides docs/adr docs/changelog` with `mkdir -p`.

### S5. Changelog  (areas: WB, AP, unknown)

Skip for areas `IN` and `AG`.

- Target path: `docs/changelog/<planning-id>/<story-id>.md`
- Create parent directories if needed.

**If the file does not exist**, write:

```markdown
# <story name in plain language>

**Planning:** <planning-id> | **Date:** <today> | **Area:** <area>

## What changed
- <User-facing bullet derived from story objective — "Users can now…" / "Fixed…" / "Added…">
- <Additional bullets from done criteria, rephrased for end users>

## Who is affected
<Inferred audience: WB → "Web users"; AP → "API consumers"; unknown → "End users and API consumers">
```

**If the file already exists**, append:

```markdown

---

## Update — <today>

### What changed
- <Bullets from story objective and done criteria>

### Who is affected
<Inferred audience>
```

### S6. User guide  (areas: WB, AP, unknown)

Skip for areas `IN` and `AG`.

- Collect existing task inline docs under `docs/guides/<planning-id>/<story-id>/` as source material (read all `task-NN-*.md` files found there).
- Target path: `docs/guides/<planning-id>/<story-id>.md`
- Create parent directories if needed.

**If the file does not exist**, write:

```markdown
# <story name — feature title>

**Date:** <today> | **Area:** <area>

## Overview
<Story objective rephrased for end users — no technical jargon>

## How to use
<Narrative guide synthesised from: task inline docs (if any), done criteria, story task descriptions>

## Related components
<Links to task-level inline docs under docs/guides/<planning-id>/<story-id>/ — or "None">
```

**If the file already exists**, append:

```markdown

---

## Revision — <today>

### Overview
<Story objective rephrased for end users>

### How to use
<Narrative from task inline docs and done criteria>

### Related components
<Links or "None">
```

### S7. Consolidated ADR  (area: IN only)

Only for area `IN`.

- Collect ADR files in `docs/adr/` whose filename contains the story-id (e.g. `story-01`).
- If none found: report "no task-level ADRs found for <story-id> — run /doc-generate <planning-id> <story-id> <task-id> for each task first" and skip.
- Derive `story-slug`: take the story filename, remove the leading `story-NN-` prefix, strip `.md`.
- Target path: `docs/adr/<YYYY-MM-DD>-<story-slug>.md`.

**If the file does not exist**, write:

```markdown
# ADR Summary: <story name>

**Date:** <today>
**Status:** Accepted
**Planning:** <planning-id> / <story-id>
**Source ADRs:** <comma-separated list of source ADR filenames>

## Decisions Made in This Story
<One paragraph per source ADR summarising its Decision section>

## Combined Consequences
<Merged Consequences sections from all source ADRs>
```

**If the file already exists**, append:

```markdown

---

## Update — <today>

**Source ADRs:** <comma-separated list of source ADR filenames>

### Decisions Made in This Story
<One paragraph per source ADR summarising its Decision section>

### Combined Consequences
<Merged Consequences sections from all source ADRs>
```

### S8. Report

List every file written and every step skipped with the reason.

---

## Planning level

### P1. Locate planning

Look for `<planning-id>` under `.planning/active/`, `.planning/`, and `.planning/finished/` (in that order). If not found, stop and report.

### P2. Collect story changelogs

Glob `docs/changelog/<planning-id>/story-*.md`. If none found: report "no story changelog entries — run `/doc-generate <planning-id> <story-id>` for each story first" and stop.

### P3. Consolidate release notes

Sort the collected story changelog files by story number (ascending). Write `docs/changelog/<planning-id>/RELEASE.md` (always overwrite):

```markdown
# Release Notes — <planning-id>

**Generated:** <today>

<contents of story-01.md>

---

<contents of story-02.md>

---

<… one section per story, separated by ---, in story-number order>
```

### P4. Collect story guides

Glob `docs/guides/<planning-id>/story-*.md`.

If none found: report "no story guides found — run `/doc-generate <planning-id> <story-id>` for each story first" and write only the RELEASE.md.

### P5. Consolidate user guide

Sort the collected story guide files by story number (ascending). Write `docs/guides/<planning-id>/README.md` (always overwrite):

```markdown
# User Guide — <planning-id>

**Generated:** <today>

## Table of Contents
- [<story-01 title>](<story-01 filename>)
- [<story-02 title>](<story-02 filename>)
- …

---

<contents of story-01.md>

---

<contents of story-02.md>

---

<… in story-number order>
```

### P6. Report

List RELEASE.md and README.md written (or skipped), and any stories missing from the consolidated files.

---

## Edge-case rules (apply at all levels)

- **Area DO or W** → exit silently at the area gate, write nothing, report nothing.
- **Technical Design empty or no decision indicators** → report and skip the ADR step; do not create a partial file.
- **Output file already exists** → append a dated section; never overwrite — except `docs/changelog/<planning-id>/RELEASE.md` and `docs/guides/<planning-id>/README.md`, which are always regenerated from source.
- **`docs/` missing** → create `docs/guides`, `docs/adr`, `docs/changelog` before writing any file.
- **Area unknown or custom** → treat as AP for document selection (inline doc + ADR + changelog + user guide).
