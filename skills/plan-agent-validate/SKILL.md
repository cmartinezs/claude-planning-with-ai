---
name: plan-agent-validate
description: Validate and close a planning — runs plan-validate, then plan-done and plan-archive if all stories pass. Stops without archiving if validation finds issues.
argument-hint: <NNN-slug>
allowed-tools: [Read, Write, Bash, Glob]
---

Validate structural integrity, close all stories, and archive a completed planning. No confirmations.

## Arguments

`$ARGUMENTS` — planning id (e.g. `001-user-auth-api`)

## Steps

1. Locate `.planning/active/$ARGUMENTS/`. If not found, stop and report.

2. Invoke `/plan-validate $ARGUMENTS`.
   - Read the validation output and parse the result:
     - If any **FAIL** items are present: stop. Report all failing checks. Do NOT proceed to done/archive. Suggest manual fix and re-running `/plan-agent-validate`.
     - If only **WARN** items: continue (warnings do not block closure).
     - If all **PASS**: continue.

3. Read all story files under `.planning/active/$ARGUMENTS/02-deepening/*.md` and check statuses:
   - `DONE` and `SKIPPED` are closable states.
   - `TODO`, `IN PROGRESS`, `BLOCKED`, and `STANDBY` are not closable.
   - If any story is not closable: list the story and status, then stop — the planning is not ready to close.
   - If all stories are closable: continue.

4. Invoke `/plan-done $ARGUMENTS` (without story argument — marks the full planning done).

5. Invoke `/plan-archive $ARGUMENTS`.

6. Verify the planning now exists at `.planning/finished/$ARGUMENTS/`.

7. Report: planning archived at `.planning/finished/$ARGUMENTS/`. List stories closed and the archive timestamp.

> Called by `/plan-run`. Can also be used independently to close and archive any planning that is ready.
