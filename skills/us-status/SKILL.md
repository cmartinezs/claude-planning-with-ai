---
name: us-status
description: Show the enrichment status of all stories in a container — which have DoD, Technical Notes, Dependencies; which are already linked to a active planning story.
argument-hint: <path/to/container/>
allowed-tools: [Bash, Read]
---

Audit user-story enrichment and active-planning linkage through the deterministic planning-check script. The product-layer equivalent of `/plan-status`.

## Arguments

`$ARGUMENTS` — path to a story container (directory or file). Can be:
- A directory: `docs/product/user-stories/epic-01-auth/`
- A single story file: `docs/product/user-stories/epic-01-auth/03-teacher-login.md`
- Empty: scans from the current directory recursively for all story-shaped markdown files

## Steps

1. Use only the current working directory and its `./.planning/` if present. Do not search parent directories.
2. If `.planning/scripts/planning-check.mjs` is missing, stop and report:
   - "This workspace needs the latest planning scripts. Run `/plan-update-version <from> <to>` or re-run `/plan-init --force` from the project root."
3. Run:

```bash
node .planning/scripts/planning-check.mjs us-status $ARGUMENTS --format markdown
```

4. Report the script output verbatim.
5. If no story files are found, suggest the correct path or container.
6. If stories need enrichment, suggest the `/us-enrich <story-id>` commands listed by the script.

> Read-only. Does not modify any files.
