---
name: plan-report
description: Generate an executive summary of a planning — objective, story completion, risks, metrics, key technical decisions, duration, and next steps.
argument-hint: <NNN-slug> [--metrics]
allowed-tools: [Read, Bash, Glob]
---

Generate a structured report for a planning, suitable for retrospectives, stakeholder updates, or handoffs.

## Arguments

`$ARGUMENTS` — planning id (e.g. `001-jwt-auth-api`)
- `--metrics` — include planning metrics such as throughput, blocked ratio, skipped ratio, task count, and risk distribution

## Steps

1. Locate the planning in `.planning/` (INITIAL), `.planning/active/`, or `.planning/finished/`. If not found, stop and report.

2. Read `00-initial.md`: extract intent, why, approximate scope, open questions.

3. Read `01-expansion.md` (if it exists): extract story list, area codes, dependency map, risks, and external issue IDs.

4. Read all story files under `02-deepening/*.md`. For each story, collect: name, status, done criteria, and any notes.

5. For each atomized story with task files (`02-deepening/<story-id>-*/task-*.md`): read the `Technical Design` section of each task to extract key decisions made during execution.

6. Read any `pdr-*.md` files in the planning root. Extract PDR id, status, decision, rationale, affected areas, and related story/task.

7. Run `git log --oneline -- .planning/**/<planning-id>/**` and extract: first commit date (planning start), last commit date (last activity), total commit count.

8. Compute summary stats: total stories, DONE count, IN PROGRESS count, TODO count, BLOCKED count, SKIPPED count.

9. Extract risk and external issue data:
   - `Risk` and `External Issue` columns from `01-expansion.md`
   - `Risk Register` rows from `01-expansion.md`
   - `## Risk` sections from story files
   - `Risk` bullets from task `Technical Design` sections

10. If `--metrics` is present, compute:
   - completion rate: `(DONE + SKIPPED) / total stories`
   - blocked ratio: `BLOCKED / total stories`
   - skipped ratio: `SKIPPED / total stories`
   - average tasks per story
   - count of H/M/L risks
   - external issue coverage: stories with external issue IDs / total stories

11. Output the report:

```
# Planning Report — <planning-id>
Generated: <today's date>

## Objective
<intent from 00-initial.md>

## Why
<why from 00-initial.md>

## Story Summary
| Status | Count |
|--------|-------|
| DONE | N |
| IN PROGRESS | N |
| TODO | N |
| BLOCKED | N |
| SKIPPED | N |
| **Total** | **N** |

## Story Detail
| Story | Area | Risk | External Issue | Status | Notes |
|-------|------|------|----------------|--------|-------|
| story-01-docs | DO | M | GH-123 | DONE | — |
| story-02-api-domain | AP | L | — | DONE | — |
...

## Risk Summary
| Risk | Impact | Likelihood | Mitigation | Status |
|------|--------|------------|------------|--------|
| R-01 | M | M | — | Open |

## Metrics
<include only when --metrics is passed>
- Completion rate: N%
- Blocked ratio: N%
- Skipped ratio: N%
- Average tasks per story: N
- Risk distribution: H=N, M=N, L=N
- External issue coverage: N/N stories

## Key Technical Decisions
- [story-03 / task-01] Chose stateless JWT over session tokens to avoid distributed session storage.
- [story-03 / task-02] Spring Security filter chain ordered before CSRF filter.
...
(extracted from task Technical Design sections; empty if no atomized tasks)

## Project Decision Records
| PDR | Status | Decision | Affected Areas | Related |
|-----|--------|----------|----------------|---------|
| PDR-001 | Accepted | Use area-specific smoke tests | AP, WB | story-02 |

(empty if no PDRs exist)

## Timeline
- Started: <first commit date>
- Last activity: <last commit date>
- Duration: N days
- Commits: N

## Open Questions (from initial.md)
<open questions if any remain>

## Next Steps
<list remaining TODO/IN PROGRESS stories, or "Planning complete — ready to archive" if all DONE/SKIPPED>
```

> Read-only. Does not modify any files.
