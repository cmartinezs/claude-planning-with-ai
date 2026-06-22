---
name: doc-task
description: Generate documentation for a completed atomic task — inline component doc and/or ADR depending on story area. Thin wrapper around doc-generate invoked automatically by plan-task.
argument-hint: <NNN-slug> <story-NN> <task-NN>
allowed-tools: [Read, Write, Bash, Glob]
---

Generate documentation for a completed atomic task. This is a thin wrapper around `/doc-generate` invoked automatically by `/plan-task` after each task completes. Can also be invoked manually to regenerate docs for an already-completed task.

The area code (WB, AP, IN, AG, DO, W, or custom) determines which documents are generated: inline component docs, ADRs, changelogs, or user guides. Tasks in area `DO` (documentation) or `W` (workflow) exit silently and produce no output.

## Arguments

`$ARGUMENTS` — format: `NNN-slug story-NN task-NN`
- `NNN-slug` — planning id (e.g. `001-user-auth-api`)
- `story-NN` — story id (e.g. `story-01`)
- `task-NN` — task id (e.g. `task-3`)

## Steps

1. Parse `$ARGUMENTS` into `planning-id`, `story-id`, and `task-id`.
2. Read `.planning/active/<planning-id>/02-deepening/<story-id>-*.md` to determine the area code.
   - If story file not found, stop and report the error.
   - Extract the area code from `Area:` or `Repository Area:` field (case-insensitive).
3. If area is `DO` or `W`: exit silently — no output, no files written.
4. Invoke `/doc-generate <planning-id> <story-id> <task-id>`.
5. Pass through the output from `doc-generate` verbatim as this skill's report.
