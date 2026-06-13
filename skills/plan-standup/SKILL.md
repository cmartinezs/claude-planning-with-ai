---
name: plan-standup
description: Generate standup text for a planning — what was completed since yesterday, what is in progress today, and what is blocked.
argument-hint: <NNN-slug>
allowed-tools: [Read, Bash, Glob]
---

Generate a standup update for a planning by reading current scope statuses and recent git activity.

## Arguments

`$ARGUMENTS` — planning id (e.g. `001-jwt-auth-api`)

## Steps

1. Locate the planning in `.planning/` (INITIAL), `.planning/active/` (EXPANSION/DEEPENING), or `.planning/finished/`. If not found, stop and report.

2. Read the planning's `00-initial.md` to get the planning intent (one line for context).

3. Run `git log --since="yesterday 00:00" --oneline -- .planning/**/<planning-id>/**` to find commits from the last 24 hours related to this planning. Also check task file paths under `02-deepening/`.

4. Read all scope files under `02-deepening/*.md`. For each scope, record: scope name, status, and whether any task was updated in the git log from step 3.

5. Categorize:
   - **Yesterday (done):** Scopes or tasks whose status changed to DONE in the git log window. If git history is not conclusive, fall back to scopes with status DONE that have recent modification timestamps.
   - **Today (in progress):** Scopes with status IN PROGRESS, plus the first TODO scope (the likely next task).
   - **Blockers:** Scopes with status BLOCKED, with their recorded reason if available.

6. Output formatted standup text:

```
## Standup — <planning-id> — <today's date>

**Yesterday:**
- [scope-01-docs] Completed: documented auth contract in docs/
- [task-02-login-endpoint] Completed: login endpoint implemented and tested

**Today:**
- [scope-03-api-auth] In progress: Spring Security config + JWT filter
- [scope-04-web-login] Next up (TODO)

**Blockers:**
- [scope-02-api-domain] BLOCKED: missing Teacher entity spec in docs/
```

If no git activity is found for yesterday, note: "(no git activity found — status inferred from current scope states)"

> Read-only. Does not modify any files.
