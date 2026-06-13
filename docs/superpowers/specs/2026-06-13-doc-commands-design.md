# Documentation Commands Design

**Date:** 2026-06-13
**Status:** Approved

## Summary

Add three new skills (`doc-generate`, `doc-task`, `doc-scope`) that generate functional and technical documentation automatically when tasks and scopes complete. `doc-generate` is the central smart command; `doc-task` and `doc-scope` are thin wrappers that integrate with `plan-task` and `plan-scope`. Two existing skills (`plan-task`, `plan-scope`) gain one new step each.

---

## Architecture

```
doc-generate NNN-slug [scope-NN] [task-NN]
    │
    ├─ detect level: task / scope / planning
    ├─ detect scope area (from scope file)
    ├─ decide which docs to generate based on area + level
    │
    ├── level task  + area WB/AP    → inline doc  → docs/guides/
    ├── level task  + area IN/AP/AG → ADR          → docs/adr/         (if decision detected)
    ├── level scope + area WB/AP    → changelog + user guide → docs/changelog/ + docs/guides/
    ├── level scope + area IN       → consolidated ADR → docs/adr/
    └── level planning              → RELEASE.md + README.md (consolidation)

doc-task  ──► invokes doc-generate NNN scope-NN task-NN
doc-scope ──► invokes doc-generate NNN scope-NN
```

**New skills:** `doc-generate`, `doc-task`, `doc-scope`

**Modified skills:** `plan-task` (step 10b added), `plan-scope` (step 7b added)

---

## Area Logic

| Area | Inline doc | ADR | Changelog | User guide |
|------|-----------|-----|-----------|------------|
| WB (frontend) | ✅ | — | ✅ | ✅ |
| AP (backend/API) | ✅ | ✅ | ✅ | ✅ |
| IN (infrastructure) | — | ✅ | — | — |
| AG (agents) | ✅ | ✅ | — | — |
| DO (docs) | — | — | — | — |
| W (planning meta) | — | — | — | — |
| Unknown/custom | ✅ | ✅ | ✅ | ✅ (treated as AP) |

---

## Skill Specifications

### `doc-generate`

**Signature:** `/doc-generate <NNN-slug> [scope-NN] [task-NN]`

**Allowed tools:** `Read`, `Write`, `Bash`, `Glob`

**Level detection:**
- `NNN-slug` only → planning level
- `NNN-slug scope-NN` → scope level
- `NNN-slug scope-NN task-NN` → task level

#### Task level

1. Locate `.planning/active/<NNN-slug>/02-deepening/<scope-id>-*/<task-id>-*.md`. Read it fully.
2. Read the scope file to determine the area code.
3. If area is DO or W: exit silently (no-op).
4. **Inline doc** (areas WB, AP, AG):
   - Extract from task: `Objective`, `Implementation Steps` (interfaces, endpoints, props), `Done Criteria`.
   - Write `docs/guides/<NNN-slug>/<scope-id>/<task-id>.md` using the inline doc format (see Formats section).
   - If the file already exists: append a new section with today's date rather than overwriting.
5. **ADR** (areas IN, AP, AG):
   - Scan the `Technical Design` section for decision indicators: "chose X over Y", "decided to", "alternative discarded", "alternative considered", "rejected".
   - If at least one indicator found: write `docs/adr/<YYYY-MM-DD>-<task-slug>.md` using the ADR format.
   - If no indicator found: report "no architectural decision detected in Technical Design — ADR skipped".
   - If the ADR file already exists: append a new section with today's date.
6. Ensure `docs/` exists; create it if not.
7. Report: files written (paths), files skipped (reason).

#### Scope level

1. Locate `.planning/active/<NNN-slug>/02-deepening/<scope-id>-*.md`. Read it fully.
2. Determine area code from the scope file.
3. If area is DO or W: exit silently.
4. Read any existing task doc files under `docs/guides/<NNN-slug>/<scope-id>/` to use as source material.
5. **Changelog entry** (areas WB, AP):
   - Derive user-facing bullets from: scope objective, done criteria, and task objectives.
   - Write `docs/changelog/<NNN-slug>/<scope-id>.md` using the changelog format.
   - If file exists: append with today's date.
6. **User guide** (areas WB, AP):
   - Write `docs/guides/<NNN-slug>/<scope-id>.md` — narrative guide for how to use the implemented feature. Sources: scope objective, task inline docs (if generated), done criteria.
   - If file exists: append with today's date.
7. **Consolidated ADR** (area IN):
   - Collect all ADR files under `docs/adr/` whose name contains the scope slug.
   - Write a consolidated `docs/adr/<YYYY-MM-DD>-<scope-slug>.md` summarising all decisions.
8. Report: files written (paths), files skipped (reason).

#### Planning level

1. Locate the planning in any state (initial/active/finished).
2. Collect all `docs/changelog/<NNN-slug>/scope-*.md` files → consolidate into `docs/changelog/<NNN-slug>/RELEASE.md`.
3. Collect all `docs/guides/<NNN-slug>/scope-*.md` files → consolidate into `docs/guides/<NNN-slug>/README.md`.
4. Report: RELEASE.md and README.md written, N scope entries consolidated.

---

### `doc-task`

**Signature:** `/doc-task <NNN-slug> <scope-NN> <task-NN>`

**Allowed tools:** `Read`, `Write`, `Bash`, `Glob`

Thin wrapper. Reads the scope area; if DO or W, exits silently. Otherwise invokes `doc-generate <NNN-slug> <scope-NN> <task-NN>` and passes through its report.

> Exists as a named skill so `plan-task` can reference it explicitly and users can re-run it independently.

---

### `doc-scope`

**Signature:** `/doc-scope <NNN-slug> <scope-NN>`

**Allowed tools:** `Read`, `Write`, `Bash`, `Glob`

Thin wrapper. Reads the scope area; if DO or W, exits silently. Otherwise invokes `doc-generate <NNN-slug> <scope-NN>` and passes through its report.

> Exists as a named skill so `plan-scope` can reference it explicitly and users can re-run it independently.

---

## Modifications to Existing Skills

### `plan-task` — add step 10b

Insert between the current step 10 (mark task DONE) and step 11 (report):

> **10b.** Invoke `/doc-task <planning-id> <scope-id> <task-id>`. If the scope area is DO or W, this is a no-op. Include the doc-task output in the final report.

### `plan-scope` — add step 7b

Insert between the current step 7 (verify EXECUTE-SCOPE) and step 8 (report):

> **7b.** Invoke `/doc-scope <planning-id> <scope-id>`. If the scope area is DO or W, this is a no-op. Include the doc-scope output in the final report.

---

## Output Formats

### ADR (`docs/adr/YYYY-MM-DD-<slug>.md`)

```markdown
# ADR: <title from task/scope objective>

**Date:** YYYY-MM-DD
**Status:** Accepted
**Planning:** NNN-slug / scope-NN / task-NN (link to task file)

## Context
<extracted from Technical Design — Approach section>

## Decision
<the specific choice made, extracted from decision indicator phrases>

## Consequences
<extracted from Technical Design — Design notes: edge cases, constraints>

## Alternatives Considered
<extracted from "alternative discarded/considered" phrases, or "none documented">
```

### Changelog entry (`docs/changelog/<NNN-slug>/<scope-id>.md`)

```markdown
# <scope name in plain language>

**Planning:** NNN-slug | **Date:** YYYY-MM-DD | **Area:** WB/AP

## What changed
- <user-facing bullet derived from scope objective>
- <additional bullets from done criteria, written in user language>

## Who is affected
<inferred from area: "API consumers", "Web users", "Operators", etc.>
```

### Inline doc (`docs/guides/<NNN-slug>/<scope-id>/<task-id>.md`)

```markdown
# <component name from task objective>

**Source:** task-NN-slug | **Area:** AP/WB/AG | **Date:** YYYY-MM-DD

## What it does
<one paragraph from Objective>

## How to use it
<derived from Implementation Steps: interfaces, endpoints, props, schemas>

## Example
<minimal usage example inferred from the component type and interfaces>
```

### User guide (`docs/guides/<NNN-slug>/<scope-id>.md`)

```markdown
# <scope name — feature title>

**Date:** YYYY-MM-DD | **Area:** WB/AP

## Overview
<scope objective rephrased for end users>

## How to use
<narrative guide derived from task inline docs and done criteria>

## Related components
<links to task-level inline docs under this scope>
```

---

## Edge Cases

| Situation | Behaviour |
|-----------|-----------|
| Area DO or W | Silent no-op — no files created, no output |
| Task with no detectable decision (IN area) | Reports "no architectural decision detected" — ADR skipped |
| Output file already exists | Appends new section with today's date — never overwrites |
| `docs/` directory does not exist | Created automatically before writing |
| Area not recognised (custom code) | Treated as AP — generates all four doc types |
| Task has no Technical Design filled | Reports "Technical Design is empty — doc generation skipped" |

---

## Files to Create or Modify

```
skills/doc-generate/SKILL.md   ← new
skills/doc-task/SKILL.md       ← new
skills/doc-scope/SKILL.md      ← new
skills/plan-task/SKILL.md      ← add step 10b
skills/plan-scope/SKILL.md     ← add step 7b
```

Generated output lives in the **user's project**, not in this plugin repo:
```
docs/adr/
docs/guides/<NNN-slug>/
docs/changelog/<NNN-slug>/
```

---

## Out of Scope

- Automatic commit of generated docs (user decides when to commit)
- Translation of generated docs to other languages
- Integration with external tools (Confluence, Notion, Linear)
- Retroactive doc generation for already-completed plannings (use `/doc-generate NNN-slug` manually)
