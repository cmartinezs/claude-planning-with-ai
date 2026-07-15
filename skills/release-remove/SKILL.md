---
name: release-remove
description: Remove a planning from a release using the deterministic release script.
argument-hint: <vX.Y.Z> <NNN-slug>
allowed-tools: [Bash, Read]
---

Remove a planning from a release's `## Included Plannings` table, renumber remaining rows, and update release progress.

## Arguments

`$ARGUMENTS` — format: `vX.Y.Z NNN-slug`.

## Steps

1. Use only the current working directory. Do not search parent directories.
2. If `.planning/scripts/release.mjs` is missing, stop and report:
   - "This workspace needs the latest planning scripts. Run `/plan-update-version <from> <to>` or re-run `/plan-init --force` from the project root."
3. Run:

```bash
node .planning/scripts/release.mjs remove $ARGUMENTS --format markdown
```

4. If the script reports that the release already shipped, ask the user for explicit confirmation before rerunning with `--force`.
5. Report the script output verbatim.
