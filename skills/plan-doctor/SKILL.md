---
name: plan-doctor
description: Audit a plugin checkout or installed planning template for command inventory, skill metadata, copied template integrity, and legacy reference drift.
argument-hint: [--plugin-root <path>]
allowed-tools: [Bash, Read]
---

# plan-doctor

Run a compatibility and consistency audit for this planning plugin through the deterministic planning-check script. This command is read-only.

## Arguments

`$ARGUMENTS` — format: `[--plugin-root <path>]`

- *(empty)* — audit the current repository or installed plugin root
- `--plugin-root <path>` — audit a specific plugin checkout

## Steps

1. Resolve the planning-check script:
   - If `planning-template/scripts/planning-check.mjs` exists, use it. This is the plugin-checkout path.
   - Else if `.planning/scripts/planning-check.mjs` exists, use it. This is the installed-workspace path.
   - Else stop and report that the workspace needs the latest planning scripts or a plugin checkout.

2. Run:

```bash
if [ -f planning-template/scripts/planning-check.mjs ]; then
  node planning-template/scripts/planning-check.mjs doctor $ARGUMENTS --format markdown
else
  node .planning/scripts/planning-check.mjs doctor $ARGUMENTS --format markdown
fi
```

3. Report the script output verbatim.
4. Treat FAIL rows as required fixes and WARN rows as recommended improvements.

Do not modify files.
