---
name: plan-history
description: Show the timeline of story status transitions for a planning using the deterministic planning-report script and git history.
argument-hint: <NNN-slug>
allowed-tools: [Bash, Read]
---

Display a chronological status-transition history for one planning. Read-only.

## Arguments

`$ARGUMENTS` - planning id, format: `NNN-slug`.

## Steps

1. Use only `./.planning/` in the current working directory. Do not search parent directories.
2. If `.planning/scripts/planning-report.mjs` is missing, stop and report:
   - "This workspace needs the latest planning scripts. Run `/plan-update-version <from> <to>` or re-run `/plan-init --force` from the project root."
3. Run:

```bash
node .planning/scripts/planning-report.mjs history $ARGUMENTS --output markdown
```

4. Report the script output verbatim.
5. If the output says history may be incomplete, mention that sparse git history limits transition reconstruction.

> Read-only. Does not modify any files.
