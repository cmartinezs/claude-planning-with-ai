---
name: release-add
description: Add one or more plannings to an existing release using the deterministic release script.
argument-hint: <vX.Y.Z> <NNN-slug> [<NNN-slug> ...]
allowed-tools: [Bash, Read]
---

Add one or more plannings to a release's `## Included Plannings` table. Planning summaries and live statuses are read from `.planning/`.

## Arguments

`$ARGUMENTS` — format: `vX.Y.Z NNN-slug [NNN-slug ...]`.

## Steps

1. Use only the current working directory. Do not search parent directories.
2. If `.planning/scripts/release.mjs` is missing, stop and report:
   - "This workspace needs the latest planning scripts. Run `/plan-update-version <from> <to>` or re-run `/plan-init --force` from the project root."
3. Run:

```bash
node .planning/scripts/release.mjs add $ARGUMENTS --format markdown
```

4. Report the script output verbatim.
