---
name: release-new
description: Create a new release in DRAFT status using the deterministic release script.
argument-hint: <vX.Y.Z> -- <purpose>
allowed-tools: [Bash, Read]
---

Create a new release entry in `.releases/`. Requires `/release-init` first.

## Arguments

`$ARGUMENTS` — format: `vX.Y.Z -- <purpose>`.

The script also needs:

- `--target <YYYY-QN-MN-WN>`
- `--date <YYYY-MM-DD>`

If either value is missing, ask the user for it and rerun with both flags.

## Steps

1. Use only the current working directory. Do not search parent directories.
2. If `.planning/scripts/release.mjs` is missing, stop and report:
   - "This workspace needs the latest planning scripts. Run `/plan-update-version <from> <to>` or re-run `/plan-init --force` from the project root."
3. If `$ARGUMENTS` does not include `--target` or `--date`, ask for the missing value(s):
   - Target period format: `YYYY-QN-MN-WN`, for example `2026-Q1-M1-W2`.
   - Estimated date format: `YYYY-MM-DD`.
4. Run:

```bash
node .planning/scripts/release.mjs new $ARGUMENTS --target <target> --date <date> --format markdown
```

5. Report the script output verbatim.
