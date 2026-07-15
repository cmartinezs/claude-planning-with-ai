---
name: plan-report
description: Generate an executive summary of a planning using the deterministic planning-report script: objective, story completion, risks, metrics, key decisions, timeline, and next steps.
argument-hint: <NNN-slug> [--metrics]
allowed-tools: [Bash, Read]
---

Generate a structured report for a planning. Read-only.

## Arguments

`$ARGUMENTS` - format: `NNN-slug [--metrics]`.

## Steps

1. Use only `./.planning/` in the current working directory. Do not search parent directories.
2. If `.planning/scripts/planning-report.mjs` is missing, stop and report:
   - "This workspace needs the latest planning scripts. Run `/plan-update-version <from> <to>` or re-run `/plan-init --force` from the project root."
3. Run:

```bash
node .planning/scripts/planning-report.mjs report $ARGUMENTS --output markdown
```

4. Report the script output verbatim.
5. If the output lists blockers, open questions, or next steps, briefly restate the highest-priority follow-up after the script output.

> Read-only. Does not modify any files.
