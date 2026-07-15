---
name: release-status
description: Show or transition release status using the deterministic release script and live .planning/ state.
argument-hint: [<vX.Y.Z>] [--mark-planned | --mark-in-progress | --mark-blocked | --mark-released | --mark-cancelled]
allowed-tools: [Bash, Read]
---

Show release status with live planning states read from `.planning/`. Optionally transition a release with `--mark-*` flags.

## Arguments

`$ARGUMENTS` — format: `[vX.Y.Z] [--mark-planned | --mark-in-progress | --mark-blocked | --mark-released | --mark-cancelled]`.

## Steps

1. Use only the current working directory. Do not search parent directories.
2. If `.planning/scripts/release.mjs` is missing, stop and report:
   - "This workspace needs the latest planning scripts. Run `/plan-update-version <from> <to>` or re-run `/plan-init --force` from the project root."
3. Run:

```bash
node .planning/scripts/release.mjs status $ARGUMENTS --format markdown
```

4. If `--mark-blocked` fails because no included planning is currently `BLOCKED`, ask for explicit confirmation before rerunning with `--force`.
5. If `--mark-released` fails because included plannings are not `COMPLETED`, report the blocking plannings and do not force the transition.
6. Report the script output verbatim.
