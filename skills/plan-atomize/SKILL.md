---
name: plan-atomize
description: Decompose a story into atomic tasks — use the shared helper for inspection and file writes, while the skill owns technical decomposition, atomicity judgment, and human approval.
argument-hint: <NNN-slug> [story-NN]  (e.g. 001-user-auth-api story-01 or just 001-user-auth-api)
allowed-tools: [Read, Write, Bash, Glob]
---

Decompose one story, or all pending stories in a planning, into atomic tasks following the ATOMIZE-STORY workflow. Each task becomes one file under `02-deepening/story-NN-name/`, granular enough to be implemented directly in a single session.

Reference workflows:
- `.planning/WORKFLOWS/02-EXECUTION-WORKFLOWS/ATOMIZE-STORY.md`
- `.planning/WORKFLOWS/04-SUB-WORKFLOWS/CHECK-ATOMICITY.md`
- `.planning/WORKFLOWS/04-SUB-WORKFLOWS/CHECK-TRACEABILITY.md`

## Arguments

`$ARGUMENTS` — two forms:
- `NNN-slug story-NN` — atomize a single story
- `NNN-slug` — atomize all pending stories in the planning

## Deterministic helper

Use only the current directory's `./.planning/`. Do not search parent directories.

Use the shared script for mechanical inspection and writing:

```bash
node .planning/scripts/planning-atomize.mjs inspect <planning-id> [story-NN] --format markdown
node .planning/scripts/planning-atomize.mjs apply <planning-id> <story-NN> --from <breakdown.json> --write
```

The helper owns deterministic work only:
- locate active planning/story files under the current `./.planning/`;
- discover the atomization worklist in planning mode;
- skip DONE stories and stories that already have `task-NN-*.md` files;
- validate that task dependencies point only to lower-numbered tasks;
- create the story task directory;
- render task files with required sections for objective, technical design, steps, verification, smoke, DB/ORM, logging, generated test suite, and done criteria;
- rewrite the story `## Tasks` table as task-file links;
- report the deterministic `/plan-test-suite` command, or run it when explicitly called with `--run-suite`.

The skill still owns human judgment:
- read `00-initial.md`, `01-expansion.md`, story files, and required `docs/` contracts;
- derive candidate tasks from the story objective, constraints, and existing task rows;
- add an explicit DB/ORM consistency validation task when required;
- execute `[CHECK-ATOMICITY]` until every candidate passes;
- ask for human approval before writing;
- execute `[CHECK-TRACEABILITY]` after writing and register new terms.

## Breakdown JSON

Before writing, create a temporary JSON file with the approved tasks:

```json
{
  "tasks": [
    {
      "title": "Implement reset endpoint",
      "workflow": "GENERATE-DOCUMENT",
      "dependsOn": ["task-01"],
      "output": "Endpoint, tests, and evidence",
      "objective": "A single verifiable deliverable.",
      "technicalDesign": {
        "approach": "Why this approach is appropriate.",
        "affectedFiles": ["src/..."],
        "interfaces": "Routes, types, schemas, or None.",
        "risk": "Medium - risk and mitigation.",
        "designNotes": "Constraints and gotchas."
      },
      "implementationSteps": ["Edit src/...", "Add tests..."],
      "verification": [{"check": "Tests pass", "how": "Run npm test"}],
      "smokeChecks": [{"check": "App starts", "how": "Run the smoke plan"}],
      "dbOrmChecks": [{"check": "Static DB/ORM consistency", "how": "Compare migration and model fields"}],
      "logging": {
        "mechanism": "Existing logger or proposed mechanism",
        "correlation": "Request/trace propagation",
        "tracePoints": "Entry, decisions, persistence, completion",
        "evidence": "Expected log/test evidence"
      },
      "doneCriteria": ["Deliverable exists", "Verification evidence captured"]
    }
  ]
}
```

## Steps

1. Parse `$ARGUMENTS`.
   - If two tokens: single-story mode.
   - If one token: planning mode.
2. Run:
   ```bash
   node .planning/scripts/planning-atomize.mjs inspect <planning-id> [story-NN] --format markdown
   ```
   If the worklist is empty in planning mode, report "nothing to atomize" and stop.
3. Read `00-initial.md`, `01-expansion.md`, `.planning/config.yml`, each target story file, and required `docs/` contracts for the story's area.
4. For each story in the worklist:
   - derive candidate atomic tasks from the objective and current task rows;
   - ensure every task targets exactly one verifiable deliverable;
   - if a candidate modifies database structure, migrations, schema files, seed/bootstrap data, ORM models/entities, ORM mappings, generated clients, repositories tied to ORM models, or persistence-layer configuration, add a separate validation task named like `validate-db-orm-consistency`;
   - make the DB/ORM validation task depend on every schema/ORM-changing task;
   - include static consistency validation and local runtime persistence smoke validation in that validation task.
5. Execute `[CHECK-ATOMICITY]` for each candidate:
   - `REJECTED — too large`: split it;
   - `REJECTED — fragment`: merge it with the task it cannot be verified without;
   - repeat until every candidate returns `PASS`.
6. Number tasks so every `Depends On` reference points only to a lower-numbered task in the same story.
7. Present all proposed breakdowns to the user, grouped by story, and wait for a single confirmation before writing anything.
8. For each confirmed story, write the approved breakdown JSON to a temporary file and run:
   ```bash
   node .planning/scripts/planning-atomize.mjs apply <planning-id> <story-NN> --from <breakdown.json> --write
   ```
9. Generate or refresh test suites:
   ```bash
   bash .planning/<software.test_suite_generator> --planning <planning-id> --story <story-id> --all
   ```
   If the generator is unavailable, report the exact follow-up command: `/plan-test-suite <planning-id> <story-id> --all`.
10. Execute `[CHECK-TRACEABILITY]` and register any new domain terms introduced.
11. Report:
    - single-story mode: N atomic tasks created, dependency order, and suggested next command (`/plan-task <planning-id> <story-id> task-01` or `/plan-story <planning-id> <story-id>`);
    - plan mode: summary table with story id, tasks created, and skipped stories with reason.

> Does NOT change story status. Does NOT execute tasks. All tasks start as `TODO`.
