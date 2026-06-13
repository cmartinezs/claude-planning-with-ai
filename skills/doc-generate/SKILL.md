---
name: doc-generate
description: Generate documentation from planning artifacts (inline docs, ADRs, changelogs, user guides) at task, scope, or planning level.
argument-hint: <NNN-slug> [<scope-NN> [<task-NN>]]  (e.g. 001-user-auth-api scope-01 task-02)
allowed-tools: [Read, Write, Bash, Glob, Grep]
---

Generate documentation from planning artifacts. Detects the level (task / scope / planning) from the number of tokens in `$ARGUMENTS` and the area code from the scope file, then writes to `docs/`.

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
- `NNN-slug scope-NN task-NN` — **task level** (3 tokens)
- `NNN-slug scope-NN` — **scope level** (2 tokens)
- `NNN-slug` — **planning level** (1 token)

## Steps

### 0. Parse arguments and detect level

Split `$ARGUMENTS` on whitespace:
- 3 tokens → task level. `planning-id` = token 1, `scope-id` = token 2, `task-id` = token 3.
- 2 tokens → scope level. `planning-id` = token 1, `scope-id` = token 2.
- 1 token → planning level. `planning-id` = token 1.
- Any other count: stop and report usage.

---

## Task level

### T1. Locate task file

Find `.planning/active/<planning-id>/02-deepening/<scope-id>-*/<task-id>-*.md`. If not found, stop and report. Read the file completely: Objective, Technical Design, Implementation Steps, Unit Tests, Done Criteria.

### T2. Determine area

Read the scope file `.planning/active/<planning-id>/02-deepening/<scope-id>-*.md`. Look for a field named `Area:` or `Repository Area:` (case-insensitive, anywhere in the file). Extract the area code (e.g. `WB`, `AP`, `IN`, `AG`, `DO`, `W`). If not found, treat as `unknown`.

### T3. Area gate

If area is `DO` or `W`: exit silently (no output, no files written).

### T4. Ensure docs/ exists

If `docs/` does not exist at the project root, create it with `mkdir -p docs/guides docs/adr docs/changelog`.

### T5. Inline doc  (areas: WB, AP, AG, unknown)

Skip this step for area `IN`.

- Target path: `docs/guides/<planning-id>/<scope-id>/<task-id>.md`
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
**Planning:** <planning-id> / <scope-id> / <task-id>

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

## Scope level

### S1. Locate scope file

Find `.planning/active/<planning-id>/02-deepening/<scope-id>-*.md`. If not found, stop and report. Read it completely: name, objective, area, done criteria, task list.

### S2. Determine area

Same as T2: look for `Area:` or `Repository Area:`. Treat missing as `unknown`.

### S3. Area gate

If area is `DO` or `W`: exit silently.

### S4. Ensure docs/ exists

If `docs/` does not exist, create `docs/guides docs/adr docs/changelog` with `mkdir -p`.

### S5. Changelog  (areas: WB, AP, unknown)

Skip for areas `IN` and `AG`.

- Target path: `docs/changelog/<planning-id>/<scope-id>.md`
- Create parent directories if needed.

**If the file does not exist**, write:

```markdown
# <scope name in plain language>

**Planning:** <planning-id> | **Date:** <today> | **Area:** <area>

## What changed
- <User-facing bullet derived from scope objective — "Users can now…" / "Fixed…" / "Added…">
- <Additional bullets from done criteria, rephrased for end users>

## Who is affected
<Inferred audience: WB → "Web users"; AP → "API consumers"; unknown → "End users and API consumers">
```

**If the file already exists**, append:

```markdown

---

## Update — <today>

### What changed
- <Bullets from scope objective and done criteria>

### Who is affected
<Inferred audience>
```

### S6. User guide  (areas: WB, AP, unknown)

Skip for areas `IN` and `AG`.

- Collect existing task inline docs under `docs/guides/<planning-id>/<scope-id>/` as source material (read all `task-NN-*.md` files found there).
- Target path: `docs/guides/<planning-id>/<scope-id>.md`
- Create parent directories if needed.

**If the file does not exist**, write:

```markdown
# <scope name — feature title>

**Date:** <today> | **Area:** <area>

## Overview
<Scope objective rephrased for end users — no technical jargon>

## How to use
<Narrative guide synthesised from: task inline docs (if any), done criteria, scope task descriptions>

## Related components
<Links to task-level inline docs under docs/guides/<planning-id>/<scope-id>/ — or "None">
```

**If the file already exists**, append:

```markdown

---

## Revision — <today>

### Overview
<Scope objective rephrased for end users>

### How to use
<Narrative from task inline docs and done criteria>

### Related components
<Links or "None">
```

### S7. Consolidated ADR  (area: IN only)

Only for area `IN`.

- Collect ADR files in `docs/adr/` whose filename contains the scope-id (e.g. `scope-01`).
- If none found: report "no task-level ADRs found for <scope-id> — run /doc-generate <planning-id> <scope-id> <task-id> for each task first" and skip.
- Derive `scope-slug`: take the scope filename, remove the leading `scope-NN-` prefix, strip `.md`.
- Target path: `docs/adr/<YYYY-MM-DD>-<scope-slug>.md`.

**If the file does not exist**, write:

```markdown
# ADR Summary: <scope name>

**Date:** <today>
**Status:** Accepted
**Planning:** <planning-id> / <scope-id>
**Source ADRs:** <comma-separated list of source ADR filenames>

## Decisions Made in This Scope
<One paragraph per source ADR summarising its Decision section>

## Combined Consequences
<Merged Consequences sections from all source ADRs>
```

**If the file already exists**, append:

```markdown

---

## Update — <today>

**Source ADRs:** <comma-separated list of source ADR filenames>

### Decisions Made in This Scope
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

### P2. Collect scope changelogs

Glob `docs/changelog/<planning-id>/scope-*.md`. If none found: report "no scope changelog entries — run `/doc-generate <planning-id> <scope-id>` for each scope first" and stop.

### P3. Consolidate release notes

Sort the collected scope changelog files by scope number (ascending). Write `docs/changelog/<planning-id>/RELEASE.md` (always overwrite):

```markdown
# Release Notes — <planning-id>

**Generated:** <today>

<contents of scope-01.md>

---

<contents of scope-02.md>

---

<… one section per scope, separated by ---, in scope-number order>
```

### P4. Collect scope guides

Glob `docs/guides/<planning-id>/scope-*.md`.

If none found: report "no scope guides found — run `/doc-generate <planning-id> <scope-id>` for each scope first" and write only the RELEASE.md.

### P5. Consolidate user guide

Sort the collected scope guide files by scope number (ascending). Write `docs/guides/<planning-id>/README.md` (always overwrite):

```markdown
# User Guide — <planning-id>

**Generated:** <today>

## Table of Contents
- [<scope-01 title>](<scope-01 filename>)
- [<scope-02 title>](<scope-02 filename>)
- …

---

<contents of scope-01.md>

---

<contents of scope-02.md>

---

<… in scope-number order>
```

### P6. Report

List RELEASE.md and README.md written (or skipped), and any scopes missing from the consolidated files.

---

## Edge-case rules (apply at all levels)

- **Area DO or W** → exit silently at the area gate, write nothing, report nothing.
- **Technical Design empty or no decision indicators** → report and skip the ADR step; do not create a partial file.
- **Output file already exists** → append a dated section; never overwrite — except `docs/changelog/<planning-id>/RELEASE.md` and `docs/guides/<planning-id>/README.md`, which are always regenerated from source.
- **`docs/` missing** → create `docs/guides`, `docs/adr`, `docs/changelog` before writing any file.
- **Area unknown or custom** → treat as AP for document selection (inline doc + ADR + changelog + user guide).
