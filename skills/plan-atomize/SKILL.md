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
      "reviewOnly": false,
      "summaryEvidence": "Required when reviewOnly is true; Markdown prose, links to longer .md artifacts, or language-labeled code snippets.",
      "frontendTask": false,
      "frontendDesign": {
        "ideaToImplementation": "Problem/intent -> UX concept -> representation -> functional markup -> component implementation -> verification.",
        "viewDescription": "Visible layout, primary states, empty/loading/error states, responsive behavior, and accessibility expectations.",
        "uiUxPrinciples": "Hierarchy, clarity, density, feedback, consistency with design system, keyboard/screen-reader behavior, and error prevention.",
        "wireframe": "ASCII wireframe, state diagram, flow outline, or link to design artifact.",
        "functionalMockup": "Static or locally mocked markup/state before real backend or external activity.",
        "componentPattern": "Existing pattern reuse or new component boundary, props/events/state ownership, composition, and styling convention.",
        "pageLogicLayer": "Routing, page/container state, loading/error handling, permissions, and orchestration.",
        "businessLogicLayer": "Validation, derived state, transformations, rules, and domain decisions outside presentation where applicable.",
        "externalCommunicationLayer": "Services, APIs, clients, libraries, generated SDKs, cache/query layer, auth headers, retries, and error mapping.",
        "reuseDecision": "For each affected view/component/service/lib, state reuse, modification, or creation and why."
      },
      "backendTask": false,
      "backendDesign": {
        "styleGuideSource": "Existing backend style/coding guide path(s), or prerequisite task-NN that creates/proposes one before implementation.",
        "functionalDesign": "Use case, actor/system trigger, inputs, outputs, state changes, success path, alternate/error paths, idempotency, permissions, and business rules.",
        "technicalDesign": "Language/framework conventions, module/package placement, architectural pattern, transaction/async boundaries, error handling, observability, and fit with the guide.",
        "contractDefinition": "Endpoints, commands/events, DTOs/schemas, status codes, validation rules, headers, versioning, compatibility, and examples.",
        "layerDesign": "Controller/handler/route, application/use-case, domain/business, persistence/integration responsibilities.",
        "dataPersistenceDesign": "Entities/models, migrations/schema changes, repositories/queries, indexes, constraints, generated clients, and DB/ORM consistency approach.",
        "externalCommunication": "Services, APIs, clients/libs/SDKs, queues/events, auth, retries/timeouts, fallback behavior, and error mapping.",
        "reuseDecision": "For each affected module/service/API/lib, state reuse, modification, or creation and why.",
        "guideComplianceChecks": "Style/lint/format/architecture commands or checklist items proving guide and language convention compliance."
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
   - include static consistency validation and local runtime persistence smoke validation in that validation task;
   - if a candidate is review-only, set `reviewOnly: true` and include `summaryEvidence` guidance; review-only tasks must produce `## Summary Evidence`, with longer prose in `.md` artifacts when needed and language-labeled fenced snippets when code is the reviewed evidence.
   - if a candidate is frontend/UI work, set `frontendTask: true` and fill `frontendDesign` before writing; include the idea-to-code path, view description, UI/UX principles, wireframe or equivalent representation, functional mockup before real activity, component pattern, page logic, business logic, external communication/services/APIs/libs, and reuse/modify/create decisions for every affected view/component/service/lib.
   - if a candidate is backend/API work, search for an existing project style/coding guide before writing tasks: check `docs/`, `.planning/WORKFLOWS/05-SDLC-PHASE-GUIDANCE/`, `AGENTS.md`, `CONTRIBUTING.md`, `STYLEGUIDE*`, language-specific guideline folders, formatter/linter configs, and architecture docs. If a guide exists, set `backendTask: true` and fill `backendDesign.styleGuideSource` with the exact path(s). If no guide exists, ask the user for the guide; if the project has none, create an earlier prerequisite task that proposes a technology-appropriate backend style/coding guide, make backend implementation tasks depend on it, and reference that prerequisite task in `styleGuideSource`.
   - for every backend/API task, fill `backendDesign` with functional design, technical design, contract definition, layer design, data/persistence design, external communication/services/APIs/libs, reuse/modify/create decisions, and guide compliance checks according to the backend language and project guide.
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
