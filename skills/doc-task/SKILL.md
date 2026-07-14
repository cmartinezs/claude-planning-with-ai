---
name: doc-task
description: Generate documentation for a completed atomic task using the deterministic doc-generate script.
argument-hint: <NNN-slug> <story-NN> <task-NN>
allowed-tools: [Bash, Read]
---

Generate documentation for one completed atomic task. This is a thin wrapper around `/doc-generate` and is invoked automatically by `/plan-task` after each task completes.

## Arguments

`$ARGUMENTS` — format: `NNN-slug story-NN task-NN`.

## Steps

1. Use only `./.planning/` in the current working directory. Do not search parent directories.
2. If `.planning/scripts/doc-generate.mjs` is missing, stop and report:
   - "This workspace needs the latest planning scripts. Run `/plan-update-version <from> <to>` or re-run `/plan-init --force` from the project root."
3. Run:

```bash
node .planning/scripts/doc-generate.mjs $ARGUMENTS --format markdown
```

4. If the command prints no output, treat it as the expected no-op for area `DO` or `W`.
5. Otherwise, pass through the script output verbatim.
