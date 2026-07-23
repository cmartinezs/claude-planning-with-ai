---
name: plan-from-release
description: Inspect a release source document and generate deterministic parent coordination artifacts without asking an AI agent to reinterpret the release.
argument-hint: <inspect|bridge|seed-release> <release-file> [--planning-id NNN-slug] [--version vX.Y.Z --target YYYY-QN-MN-WN --date YYYY-MM-DD] [--write]
allowed-tools: [Bash, Read]
---

Inspect a release document and, when requested, generate the parent planning bridge artifacts that turn a release into executable child-owned planning work.

This command is intentionally deterministic. It extracts headings, lists, tables, readiness gates, affected areas, existing child planning workspaces, and release metadata with `.planning/scripts/planning-from-release.mjs`. Use it before asking an agent to design child tasks.

## Arguments

`$ARGUMENTS` uses a stage-first format:

- `inspect <release-file>` — read-only summary of release metadata, gates, areas, and child workspaces.
- `bridge <release-file> --planning-id <NNN-slug> [--write]` — create or dry-run a parent coordination planning under `.planning/active/<NNN-slug>/`.
- `seed-release <release-file> --version <vX.Y.Z> --target <YYYY-QN-MN-WN> --date <YYYY-MM-DD> [--write]` — create or dry-run `.releases/<version>.md` seeded from the release source.

Examples:

```bash
node .planning/scripts/planning-from-release.mjs inspect docs/master-plan/releases/release-01-assessment-creation.md
node .planning/scripts/planning-from-release.mjs bridge docs/master-plan/releases/release-01-assessment-creation.md --planning-id 008-assessment-creation --write
node .planning/scripts/planning-from-release.mjs seed-release docs/master-plan/releases/release-01-assessment-creation.md --version v1.0.0 --target 2026-Q3-M1-W2 --date 2026-08-07 --write
```

## Steps

1. Use only the current working directory. Do not search parent directories.
2. If `.planning/scripts/planning-from-release.mjs` is missing, stop and report:
   - "This workspace needs the latest planning scripts. Run `/plan-update-version <from> <to>` or re-run `/plan-init --force` from the project root."
3. Run:

```bash
node .planning/scripts/planning-from-release.mjs $ARGUMENTS --format markdown
```

4. Report the script output verbatim.

## Rules

- `inspect` is always read-only.
- `bridge` and `seed-release` are dry-run by default; they write only with `--write`.
- The generated parent planning coordinates release execution. It must not own child implementation when a child workspace has its own `.planning/`.
- Generated `release-briefs/*.md` files are handoff inputs for child planning, not implementation tasks.
- If the output reports `NOT READY`, proposed stories, unresolved decisions, or missing proof, resolve those upstream before atomizing child tasks.
