---
name: plan-standup
description: Generate standup text for a planning using the deterministic planning-report script: yesterday, today, and blockers.
argument-hint: <NNN-slug>
allowed-tools: [Bash, Read]
---

Generate a standup update for one planning. Read-only.

## Arguments

`$ARGUMENTS` - planning id, format: `NNN-slug`.

## Steps

1. Use only `./.planning/` in the current working directory. Do not search parent directories.
2. If `.planning/scripts/planning-report.mjs` is missing, stop and report:
   - "This workspace needs the latest planning scripts. Run `/plan-update-version <from> <to>` or re-run `/plan-init --force` from the project root."
3. Run:

```bash
node .planning/scripts/planning-report.mjs standup $ARGUMENTS --output markdown
```

4. Report the script output verbatim.
5. If the output says git activity was not found, mention that the standup was inferred from current story state.

> Read-only. Does not modify any files.
