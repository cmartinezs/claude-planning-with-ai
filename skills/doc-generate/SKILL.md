---
name: doc-generate
description: Generate documentation from planning artifacts at task, story, or planning level using the deterministic doc-generate script.
argument-hint: <NNN-slug> [<story-NN> [<task-NN>]]
allowed-tools: [Bash, Read]
---

Generate documentation from `.planning/` artifacts into `docs/`.

## Arguments

`$ARGUMENTS` — one of:

- `NNN-slug story-NN task-NN` — task-level inline docs and/or ADR.
- `NNN-slug story-NN` — story-level changelog, guide, or consolidated ADR.
- `NNN-slug` — planning-level release notes and user guide consolidation.

Areas `DO` and `W` are no-op documentation gates. Unknown/custom areas are treated like `AP` for document selection.

## Steps

1. Use only `./.planning/` in the current working directory. Do not search parent directories.
2. If `.planning/scripts/doc-generate.mjs` is missing, stop and report:
   - "This workspace needs the latest planning scripts. Run `/plan-update-version <from> <to>` or re-run `/plan-init --force` from the project root."
3. Run:

```bash
node .planning/scripts/doc-generate.mjs $ARGUMENTS --format markdown
```

4. If the command prints no output, treat it as the expected no-op for area `DO` or `W`.
5. Otherwise, report the script output verbatim, including files written and skipped steps.

> The script owns the document matrix, output paths, append-vs-overwrite rules, ADR decision detection, and planning-level consolidation.
