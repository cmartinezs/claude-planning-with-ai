---
name: plan-export
description: Export a planning through the deterministic planning-report script as a PR description, ticket list, external issue draft, or standalone markdown summary.
argument-hint: <NNN-slug> [--format pr|tickets|github-issue|jira|linear|markdown]
allowed-tools: [Bash, Read]
---

Export a planning's content for use outside the planning system. Read-only.

## Arguments

`$ARGUMENTS` - format: `NNN-slug [--format pr|tickets|github-issue|jira|linear|markdown]`.

## Steps

1. Use only `./.planning/` in the current working directory. Do not search parent directories.
2. If `.planning/scripts/planning-report.mjs` is missing, stop and report:
   - "This workspace needs the latest planning scripts. Run `/plan-update-version <from> <to>` or re-run `/plan-init --force` from the project root."
3. Run:

```bash
node .planning/scripts/planning-report.mjs export $ARGUMENTS --output markdown
```

4. Report the script output verbatim.
5. Do not write export files unless the user explicitly asks for a file artifact.

> Read-only. To save the output, the user can ask for a target file or pipe the command outside the skill.
