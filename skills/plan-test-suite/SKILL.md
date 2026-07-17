---
name: plan-test-suite
description: Generate deterministic test-suite matrices for a planning, story, or task. Prefers repository scripts and tooling over AI-generated guesses.
argument-hint: <NNN-slug> [story-NN] [task-NN] [--all]
allowed-tools: [Read, Bash]
---

Generate or refresh test-suite artifacts for a planning, story, or task. The command must prefer deterministic repository inference and scripts over AI-authored plans so token usage stays low and test evidence remains reproducible.

Reference artifacts:
- `.planning/scripts/generate-test-suite.sh`
- `.planning/SMOKE-TESTS.md`
- `.planning/config.yml`

## Arguments

`$ARGUMENTS` — format: `<NNN-slug> [story-NN] [task-NN] [--all]`

- `NNN-slug` — planning id.
- `story-NN` — optional story id. If omitted, generate the planning-level suite.
- `task-NN` — optional task id. Requires `story-NN`.
- `--all` — generate planning, every atomized story, and every task suite in one pass.

Examples:

```text
/plan-test-suite 001-user-auth
/plan-test-suite 001-user-auth story-01
/plan-test-suite 001-user-auth story-01 task-02
/plan-test-suite 001-user-auth --all
```

## Output Paths

| Scope | Output |
|-------|--------|
| Planning | `.planning/active/<planning-id>/TEST-SUITE.md` |
| Story | `.planning/active/<planning-id>/02-deepening/<story-id>-*/TEST-SUITE.md` |
| Task | `.planning/active/<planning-id>/02-deepening/<story-id>-*/test-suites/<task-id>-<slug>-test-suite.md` |

## Steps

1. Parse `$ARGUMENTS`.
2. Use only the current directory's `./.planning/`. Do not search parent directories.
3. Locate `.planning/active/<planning-id>/`. If it does not exist, stop and report.
4. If `.planning/scripts/generate-test-suite.sh` is missing, stop and report:
   - "This workspace needs the latest planning scripts. Run `/plan-update-version <from> <to>` or re-run `/plan-init --force` from the project root."
5. Run the bundled deterministic generator:
   ```bash
   bash .planning/scripts/generate-test-suite.sh --planning <planning-id> [--story <story-id>] [--task <task-id>] [--all] --format markdown
   ```
6. If the script succeeds, report its output verbatim. Then read the generated files it lists and summarize:
   - commands inferred automatically
   - gates that still need manual completion
   - evidence metadata that must be captured when each gate runs: test type, command, parameters, environment, configuration/scripts, output log or report, and result
   - the next recommended command (`/plan-atomize`, `/plan-task`, `/plan-story`, or `/plan-validate`)
7. If the script fails, report the error. Do not invent commands blindly; inspect repository files only to explain the failure or identify the missing workspace update.

> The script owns repository-tool detection, quality-gate rows, isolated acceptance-environment guidance, Maven acceptance-test scaffolding, dependency inventory, and generated artifact schemas. Use `--format json` only when another command needs machine-readable output.

## Integration With Execution

- Run `/plan-test-suite <planning-id> --all` after `/plan-expand` or `/plan-atomize` when a complete test strategy is needed.
- Run `/plan-test-suite <planning-id> <story-id> <task-id>` before `/plan-task` when a task lacks a task-level test suite.
- `/plan-task` should read the task test-suite artifact when present and execute applicable gates before publishing the task PR for review.
- Generated, detected, and user-supplied manual tests all require durable execution evidence with the same fields: type (`unit`, `integration`, `acceptance`, `e2e`, `smoke`, `static-analysis`, `style`, `architecture`, `security`, `mutation`, or manual), exact command, parameters/profiles/env vars, environment, configuration/scripts used, output log or CI/report link, result, and skipped-gate rationale when applicable.
