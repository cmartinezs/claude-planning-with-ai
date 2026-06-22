---
name: plan-health
description: Scan the entire .planning/ system for structural anomalies — duplicate IDs, orphaned files, stale plannings, mismatched story/task indexes. Broader than plan-validate, which checks one planning at a time.
argument-hint: (no arguments)
allowed-tools: [Read, Bash, Glob]
---

Full-system health check of the `.planning/` directory. Detects cross-planning anomalies and stale state that `/plan-validate` does not catch.

## Arguments

`$ARGUMENTS` — none. Always scans the entire `.planning/` system from the current directory.

## Steps

1. Verify `.planning/` exists. If not, stop: "No `.planning/` directory found. Run `/plan-init` first."

2. Discover all planning directories across all three locations:
   - `.planning/NNN-slug/` → INITIAL
   - `.planning/active/NNN-slug/` → ACTIVE
   - `.planning/finished/NNN-slug/` → FINISHED

3. Run the following checks, collecting PASS / WARN / FAIL results for each:

   **Check 1 — Duplicate NNN IDs**
   Two plannings share the same three-digit prefix (e.g., two `001-*` directories). → FAIL if any found.

   **Check 2 — Planning in wrong location for its state**
   A planning in `.planning/NNN-slug/` that contains `01-expansion.md` should be in `active/`. A planning in `active/` with all stories DONE should be in `finished/`. → WARN for each case.

   **Check 3 — Story files without a parent planning**
   `*.md` files inside `02-deepening/` directories that do not belong to any known planning folder. → FAIL if any found.

   **Check 4 — Task folders without matching story file**
   A directory `02-deepening/story-NN-name/` exists but `02-deepening/story-NN-name.md` does not. → FAIL for each.

   **Check 5 — Story IDs in 01-expansion.md not matching any story file**
   For each active planning: extract story IDs listed in the table in `01-expansion.md` and verify a matching `02-deepening/story-NN-*.md` file exists. → FAIL for each missing file.

   **Check 6 — Stale active plannings (no activity in >30 days)**
   For each planning in `active/`: run `git log --since="30 days ago" -- ".planning/active/<id>/**"`. If no commits found, flag as WARN: "no activity in >30 days".

   **Check 7 — README.md index out of sync**
   Entries in `.planning/README.md` pointing to directories that do not exist, or existing planning directories not listed in `README.md`. → WARN for each discrepancy.

   **Check 8 — Empty planning directories**
   Planning directories that contain no `00-initial.md`. → FAIL for each.

4. Output the health report:

```
## Planning Health Report — <today's date>

Plannings found: N (INITIAL: N, ACTIVE: N, FINISHED: N)

| Check | Result | Details |
|-------|--------|---------|
| Duplicate NNN IDs | ✅ PASS | — |
| Planning location vs state | ⚠️ WARN | 001-old-work in .planning/ but has 01-expansion.md |
| Orphaned story files | ✅ PASS | — |
| Task folders without story file | ❌ FAIL | active/002-auth/02-deepening/story-03-web/ has no .md |
| Stories in expansion not on disk | ✅ PASS | — |
| Stale active plannings | ⚠️ WARN | 003-infra-setup — no git activity in 47 days |
| README.md index sync | ✅ PASS | — |
| Empty planning directories | ✅ PASS | — |

Issues requiring action:
- FAIL: active/002-auth/02-deepening/story-03-web/ — create story-03-web.md or delete the folder
Warnings (no immediate action required):
- 001-old-work should be moved to active/ (run /plan-expand 001-old-work)
- 003-infra-setup has been inactive for 47 days
```

5. If all checks PASS, report: "✅ Planning system is healthy — no issues found."

> Read-only. Does not modify any files. To fix structural issues found, use the appropriate skill (e.g., `/plan-validate NNN-slug` for detailed per-planning checks).
