---
name: doc-scope
description: Generate documentation for a completed scope — changelog entry and user guide (WB/AP) or consolidated ADR (IN). Thin wrapper around doc-generate invoked automatically by plan-scope.
argument-hint: <NNN-slug> <scope-NN>
allowed-tools: [Read, Write, Bash, Glob]
---

Generate documentation for a completed scope. This is a thin wrapper around `doc-generate` invoked automatically by `plan-scope` after each scope completes. Can also be invoked manually to regenerate docs for an already-completed scope.

Reference workflow: `.planning/WORKFLOWS/02-EXECUTION-WORKFLOWS/GENERATE-DOCUMENT.md`

## Arguments

`$ARGUMENTS` — format: `NNN-slug scope-NN` (e.g. `001-user-auth-api scope-01`)

## Steps

1. **Parse arguments:**
   - Split `$ARGUMENTS` on whitespace into tokens.
   - If not exactly 2 tokens, stop and report usage.
   - `planning-id` = token 1, `scope-id` = token 2.

2. **Locate scope file:**
   - Find `.planning/active/<planning-id>/02-deepening/<scope-id>-*.md`.
   - If not found, stop and report.

3. **Determine area code:**
   - Read the scope file.
   - Look for a field named `Area:` or `Repository Area:` (case-insensitive, anywhere in the file).
   - Extract the area code (e.g. `WB`, `AP`, `IN`, `AG`, `DO`, `W`).
   - If not found, treat as `unknown`.

4. **Area gate:**
   - If area is `DO` or `W`: exit silently — no output, no files written. Stop.

5. **Invoke doc-generate:**
   - Call `/doc-generate <planning-id> <scope-id>` with the same arguments.

6. **Pass through output:**
   - Report the output from `doc-generate` verbatim as this skill's report.
