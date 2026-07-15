---
name: plan-audit-docs
description: Audit project documentation produced by a planning for coverage, freshness, traceability, broken references, and consistency with stories/tasks.
argument-hint: <NNN-slug> [--docs-dir <path>]
allowed-tools: [Bash, Read]
---

# plan-audit-docs

Audit documentation generated or modified by a planning through the deterministic planning-check script. This command is read-only.

## Arguments

`$ARGUMENTS` — format: `NNN-slug [--docs-dir <path>]`

- `NNN-slug` — planning id to audit
- `--docs-dir <path>` — optional docs root; default from `.planning/config.yml` `docs.output_dir`, falling back to `docs`

## Steps

1. Use only `./.planning/` in the current working directory. Do not search parent directories.
2. If `.planning/scripts/planning-check.mjs` is missing, stop and report:
   - "This workspace needs the latest planning scripts. Run `/plan-update-version <from> <to>` or re-run `/plan-init --force` from the project root."
3. Run:

```bash
node .planning/scripts/planning-check.mjs audit-docs $ARGUMENTS --format markdown
```

4. Report the script output verbatim.
5. If the output lists FAIL or WARN findings, briefly restate the highest-priority next action. Do not modify docs automatically.

Do not modify files.
