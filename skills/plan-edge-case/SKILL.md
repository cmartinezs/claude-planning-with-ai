---
name: plan-edge-case
description: Add a raw retrospective note for an unexpected event, correction, blocker, or unusual situation in an active planning.
argument-hint: '[NNN-slug] [story-NN] -- <what happened>'
allowed-tools: [Read, Write, Bash, Glob]
---

Add a raw retrospective note to `.planning/active/<planning-id>/RETROSPECTIVE-RAW.md`.

Use this when something unusual happens outside another plugin command, or when the user says something like:

```bash
/plan-edge-case "this last thing that happened and how we solved it"
/plan-edge-case 001-checkout -- reviewer found the smoke test was checking the wrong port
/plan-edge-case 001-checkout story-02 -- deployment config was missing and we patched it manually
```

Reference workflow: `.planning/WORKFLOWS/03-MAINTENANCE-WORKFLOWS/RECORD-EDGE-CASE.md`

## Arguments

`$ARGUMENTS` supports:
- `NNN-slug [story-NN] -- <description>`
- `NNN-slug [story-NN] "<description>"`
- `"<description>"` when exactly one active planning exists

## Steps

1. Parse `$ARGUMENTS`.
   - If the first token matches `\d{3}-[a-z0-9-]+`, treat it as the planning id.
   - If the next token matches `story-[a-zA-Z0-9-]+`, treat it as the related story.
   - The remaining text is the description. Strip a leading `--` if present.
   - If no planning id was provided, list `.planning/active/*/`. If exactly one active planning exists, use it. If zero or multiple active plannings exist, stop and ask the user to provide the planning id.
   - If the description is empty, stop and ask for a concise description of what happened.

2. Locate `.planning/active/<planning-id>/`. If not found:
   - If `.planning/<planning-id>/` exists, use that path and note that the planning is still INITIAL.
   - If `.planning/finished/<planning-id>/` exists, stop: finished plannings are read-only; create a follow-up planning instead.
   - Otherwise stop and report that the planning was not found.

3. Ensure `RETROSPECTIVE-RAW.md` exists in the planning root.
   - If missing, create it with the same structure as `.planning/_template/RETROSPECTIVE-RAW.md`.

4. Read recent conversation context and the planning files (`00-initial.md`, `01-expansion.md` if present, related story file if provided) only as needed to understand the event.

5. Create a new raw entry. Use the current local date/time from:

   ```bash
   date "+%Y-%m-%d %H:%M"
   ```

   Add the entry under `## Log`, above older entries:

   ```md
   ### YYYY-MM-DD HH:MM - <short title>

   - **Source:** manual
   - **Related story/task:** <story-NN, task-NN, or none>
   - **What happened:** <description>
   - **Expected instead:** <inferred expectation, or unknown>
   - **Resolution:** <known resolution from user/context, or unresolved>
   - **Retrospective signal:** <lesson, follow-up, risk, or decision candidate>
   ```

   If the file contains `*(No unexpected events recorded yet.)*`, remove that placeholder.

6. Report the path updated and a one-line summary of the entry.

> This command writes raw facts only. Use `/plan-retrospective <planning-id>` to convert them into the final professional retrospective.
