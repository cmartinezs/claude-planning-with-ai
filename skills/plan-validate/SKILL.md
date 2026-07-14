---
name: plan-validate
description: Validate the structural integrity of one planning or all plannings using the deterministic planning-check script.
argument-hint: "[NNN-slug]"
allowed-tools: [Bash, Read]
---

Validate `.planning/` structure, story consistency, workflow IDs, dependencies, done criteria, and atomized task files. Read-only.

Use `/plan-validate [NNN-slug]` for a detailed audit of one planning, or all plannings if no argument is provided. Use `/plan-health` first when you suspect cross-planning, index, duplicate, or stale-state issues.

## Arguments

`$ARGUMENTS` — optional `NNN-slug`.

## Steps

1. Use only `./.planning/` in the current working directory. Do not search parent directories.
2. If `.planning/scripts/planning-check.mjs` is missing, stop and report:
   - "This workspace needs the latest planning scripts. Run `/plan-update-version <from> <to>` or re-run `/plan-init --force` from the project root."
3. Run the deterministic validator:

```bash
node .planning/scripts/planning-check.mjs validate $ARGUMENTS --format markdown
```

4. Report the script output verbatim.
5. If FAIL findings are present, list the suggested command or file edit from the output. Do not apply fixes automatically.
6. If WARN findings are present, group them after FAIL findings and keep the command read-only.

> This command is read-only. The script performs deterministic checks and does not modify files.
