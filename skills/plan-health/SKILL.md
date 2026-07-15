---
name: plan-health
description: Scan the entire .planning/ system for structural anomalies using the deterministic planning-check script. Broader than plan-validate, which checks one planning at a time.
argument-hint: (no arguments)
allowed-tools: [Bash, Read]
---

Full-system health check of the current directory's `.planning/` workspace. Read-only.

Use `/plan-health` when the whole planning system may be inconsistent. Use `/plan-validate [NNN-slug]` when one planning needs a detailed structural audit.

## Arguments

No arguments.

## Steps

1. Use only `./.planning/` in the current working directory. Do not search parent directories.
2. If `.planning/scripts/planning-check.mjs` is missing, stop and report:
   - "This workspace needs the latest planning scripts. Run `/plan-update-version <from> <to>` or re-run `/plan-init --force` from the project root."
3. Run:

```bash
node .planning/scripts/planning-check.mjs health --format markdown
```

4. Report the script output verbatim.
5. If the output lists FAIL or WARN findings, briefly restate the highest-priority next action and remind the user to inspect the referenced files before applying fixes.

> This command is read-only. The script performs deterministic checks and does not modify files.
