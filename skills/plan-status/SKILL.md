---
name: plan-status
description: Show the current state of all plannings in the `.planning/` system.
allowed-tools: [Read, Write, Bash, Glob]
---

Show the current state of all plannings in the `.planning/` system.

## Steps

1. Read `.planning/README.md` to get the root index (Initial plannings listed there).
2. Read `.planning/active/README.md` to get all plannings in EXPANSION or DEEPENING.
3. Read `.planning/finished/README.md` to get all completed plannings.
4. For each active planning found, read its `01-expansion.md` (if exists) to extract scope statuses.
5. Report a concise summary table:

```
INITIAL
  NNN-slug — intent

ACTIVE (EXPANSION / DEEPENING)
  NNN-slug — intent
    scope-01-name [TODO / IN PROGRESS / DONE]
    scope-02-name [TODO / IN PROGRESS / DONE]

COMPLETED
  NNN-slug — intent
```

If no plannings exist in a category, print `(none)`.

> This command is read-only. It does not modify any files.
