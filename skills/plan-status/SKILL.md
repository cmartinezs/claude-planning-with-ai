---
name: plan-status
description: Show the current state of all plannings, or one planning, using the deterministic planning-report script.
argument-hint: [NNN-slug]
allowed-tools: [Bash, Read]
---

Show the current state of all plannings, or one planning, in the current `.planning/` system. Read-only.

## Arguments

`$ARGUMENTS` - optional planning id, format: `NNN-slug`.

## Steps

1. Use only `./.planning/` in the current working directory. Do not search parent directories.
2. If `.planning/scripts/planning-report.mjs` is missing, stop and report:
   - "This workspace needs the latest planning scripts. Run `/plan-update-version <from> <to>` or re-run `/plan-init --force` from the project root."
3. Run:

```bash
node .planning/scripts/planning-report.mjs status $ARGUMENTS --output markdown
```

4. Report the script output verbatim.

> Read-only. Does not modify any files.
