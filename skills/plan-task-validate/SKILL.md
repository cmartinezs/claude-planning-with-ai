---
name: plan-task-validate
description: Audit atomic tasks against the atomicity checklist and story index using the deterministic planning-check script.
argument-hint: <NNN-slug> [story-NN] [task-NN]
allowed-tools: [Bash, Read]
---

Audit atomized task structure, task indexes, dependency order, workflow IDs, done criteria, generated test-suite evidence, smoke-test evidence, logging criteria, and DB/ORM validation criteria. Read-only.

## Arguments

`$ARGUMENTS` — format: `NNN-slug [story-NN] [task-NN]`.

- `NNN-slug` only — validate every atomized story in the planning.
- `NNN-slug story-NN` — validate all tasks of that story.
- `NNN-slug story-NN task-NN` — validate a single task.

## Steps

1. Use only `./.planning/` in the current working directory. Do not search parent directories.
2. If `.planning/scripts/planning-check.mjs` is missing, stop and report:
   - "This workspace needs the latest planning scripts. Run `/plan-update-version <from> <to>` or re-run `/plan-init --force` from the project root."
3. Run:

```bash
node .planning/scripts/planning-check.mjs task-validate $ARGUMENTS --format markdown
```

4. Report the script output verbatim.
5. If the target story is not atomized, suggest `/plan-atomize <planning-id> <story-id>`.
6. If FAIL or WARN findings are present, do not apply fixes automatically; ask the user to inspect the referenced files first.

> This command is read-only. The script performs deterministic checks and does not modify files.
