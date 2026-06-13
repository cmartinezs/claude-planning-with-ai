---
name: plan-history
description: Show the timeline of status transitions for all scopes in a planning, extracted from git history.
argument-hint: <NNN-slug>
allowed-tools: [Read, Bash, Glob]
---

Display a chronological log of scope status changes for a planning, derived from git commits.

## Arguments

`$ARGUMENTS` — planning id (e.g. `001-jwt-auth-api`)

## Steps

1. Locate the planning in `.planning/` (INITIAL), `.planning/active/`, or `.planning/finished/`. Determine its root path.

2. Run `git log --all --follow --format="%H %as %s" -- "<planning-root>/02-deepening/*.md"` to get all commits that touched scope files. If no commits found, report "no git history found for this planning" and stop.

3. For each commit that touched a scope file:
   a. Run `git show <hash> -- "<scope-file>"` to get the diff.
   b. Parse the diff for `Status:` line changes (e.g., `- Status: TODO` → `+ Status: IN PROGRESS`).
   c. Record: date, scope name, from-status, to-status, commit subject.

4. Also look for the planning folder move (INITIAL → active): run `git log --all --diff-filter=R --summary --format="%as %s" | grep "<planning-id>"` to find the expansion commit date.

5. Sort all events chronologically.

6. Output the history table:

```
# Planning History — <planning-id>

| Date | Event | Details |
|------|-------|---------|
| 2026-06-01 | Planning created | 001-jwt-auth-api in INITIAL |
| 2026-06-02 | Expanded to ACTIVE | 4 scopes created |
| 2026-06-03 | scope-01-docs | TODO → IN PROGRESS |
| 2026-06-03 | scope-01-docs | IN PROGRESS → DONE |
| 2026-06-04 | scope-02-api-domain | TODO → IN PROGRESS |
| 2026-06-05 | scope-02-api-domain | IN PROGRESS → DONE |
...
```

If git history is sparse (e.g., bulk commits), note: "(history may be incomplete — status transitions inferred from available diffs)"

> Read-only. Does not modify any files.
