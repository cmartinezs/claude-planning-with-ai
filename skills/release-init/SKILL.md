---
name: release-init
description: Initialize the .releases/ directory for release planning using the deterministic release script.
argument-hint: ""
allowed-tools: [Bash, Read]
---

Initialize `.releases/` for release planning. This is a one-time setup command, independent of `/plan-init`.

## Steps

1. Use only the current working directory. Do not search parent directories.
2. If `.planning/scripts/release.mjs` is missing, stop and report:
   - "This workspace needs the latest planning scripts. Run `/plan-update-version <from> <to>` or re-run `/plan-init --force` from the project root."
3. Run:

```bash
node .planning/scripts/release.mjs init --format markdown
```

4. Report the script output verbatim.
