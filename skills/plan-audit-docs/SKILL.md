---
name: plan-audit-docs
description: Audit project documentation produced by a planning for coverage, freshness, traceability, broken references, and consistency with stories/tasks.
argument-hint: <NNN-slug> [--docs-dir <path>]
allowed-tools: [Read, Bash, Glob, Grep]
---

# plan-audit-docs

Audit documentation generated or modified by a planning. This command is read-only.

## Arguments

`$ARGUMENTS`
- `NNN-slug` — planning id to audit
- `--docs-dir <path>` — optional docs root; default from `.planning/config.yml` `docs.output_dir`, falling back to `docs`

## Steps

1. Parse arguments and locate the planning in `.planning/`, `.planning/active/`, or `.planning/finished/`.

2. Read `.planning/config.yml` if present:
   - `docs.output_dir` defaulting to `docs`
   - `project.type` defaulting to `software`
   - `terminology.planning_item` defaulting to `story`

3. Read the planning artifacts:
   - `00-initial.md` for intent and scope
   - `01-expansion.md` for story list, affected areas, external issue IDs, and risks
   - `02-deepening/*.md` story files for objectives, done criteria, residuals, and inconsistencies
   - `02-deepening/story-*/*.md` task files for expected outputs and verification

4. Build the expected documentation set:
   - files listed in story/task `Output` fields
   - docs named in done criteria
   - docs touched by `doc-generate`, `doc-story`, or `doc-task` notes
   - ADR/changelog/user-guide files referenced by the planning

5. Validate each expected doc:
   - file exists under the docs root or explicitly documented alternate path
   - headings are meaningful and not placeholders
   - links to local markdown files resolve
   - references to commands exist in `docs/commands.yml` when available
   - terms introduced by the planning are represented in `TRACEABILITY.md` or `TRACEABILITY-GLOBAL.md`
   - external issue IDs, if present, are copied into the relevant docs or handoff notes

6. Validate freshness:
   - compare the planning's latest activity with doc modification dates when git history is available
   - flag docs that appear older than the story/task that claims to update them

7. Output:

```markdown
# Documentation Audit — NNN-slug

## Result
PASS / WARN / FAIL

## Coverage
| Expected document | Source story/task | Result | Notes |
|-------------------|-------------------|--------|-------|
| docs/example.md | story-01/task-02 | PASS | — |

## Consistency Findings
1. <finding with file path and reason>

## Missing or Stale Docs
1. <doc path and source expectation>

## Recommended Next Commands
- `/doc-task NNN-slug story-NN task-NN`
- `/plan-validate NNN-slug`
```

Do not modify files.
