# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [3.11.0] — 2026-07-22

### Added

- Added `/plan-from-release` backed by `.planning/scripts/planning-from-release.mjs` for deterministic release source inspection, parent coordination bridge generation, and `.releases/` seeding.
- Added release-to-planning bridge migration guidance to the `2.x -> 3.x` update baseline.

## [3.10.10] — 2026-07-17

### Added

- Added Claude session boundary guidance: run `/clear` before starting a different story and `/compact` before each new task implementation.
- Added reproducible test evidence requirements for generated, detected, CI, and manual gates: type, command, parameters, environment, configuration/scripts, output log/report, and result.

### Fixed

- Fixed `/plan-task git-setup` so it checks existing local and `origin/*` story/task branches and no longer resets an existing story branch back to `git.base_branch` with `git checkout -B`; regression coverage in `scripts/verify-plugin.sh` creates a diverged story branch and asserts the generated plan checks it out instead of resetting it.
- Fixed `/plan-task` affected-file detection for multiline `- **Affected files / components:**` lists so publish allowlists include every indented backtick-quoted path, while preserving the existing inline `New: \`a\`, \`b\`` format; regression coverage in `scripts/verify-plugin.sh` covers both forms.

## [3.10.9] — 2026-07-16

### Fixed

- Hardened `/plan-task` story-branch detection so legacy task branches such as `tasks/<story>/<task>` only keep a sliced prefix when that prefix exists as a local or `origin/*` branch; otherwise task PRs target the real `<story>` branch.

## [3.10.8] — 2026-07-15

### Added

- Backend/API implementation tasks now require `## Backend/API Design Plan`, including style/coding guide discovery or a prerequisite guide task, functional and technical design, contracts, layer design, data/persistence, external communication, reuse/modify/create decisions, and guide compliance checks.

## [3.10.7] — 2026-07-15

### Added

- Frontend/UI implementation tasks now require `## Frontend Design Plan`, covering idea-to-code flow, view behavior, UI/UX principles, wireframe or equivalent representation, functional mockup, component pattern, page/business/external communication layers, services/APIs/libs, and reuse/modify/create decisions.

## [3.10.6] — 2026-07-15

### Added

- Review-only tasks now require durable `## Summary Evidence`, with guidance for longer Markdown artifacts and language-labeled code snippets when the review evidence is code.

## [3.10.5] — 2026-07-15

### Fixed

- Fixed layered git task branch naming so task branches use sibling refs like `<story-branch>--task-NN-<slug>` instead of impossible nested refs like `<story-branch>/task-NN-<slug>`.

## [3.10.4] — 2026-07-15

### Fixed

- Fixed `planning-add-story` so new story rows are inserted only inside the `Story Summary` section instead of the last numeric table elsewhere in `01-expansion.md`.
- Reduced DB/ORM validation false positives by ignoring explicit no-database/no-ORM task notes and requiring generic terms such as `repository`, `table`, or `column` to appear near DB/ORM context.

## [3.10.3] — 2026-07-15

### Fixed

- Fixed planning reports so Story Detail area values are read from the documented `SDLC Phase(s)` Story Summary column and from story-file `## Area` fallback, instead of rendering `-`.

## [3.10.2] — 2026-07-15

### Fixed

- Fixed Story Summary ID extraction in deterministic planning scripts so the documented `| # | Story | ... |` table format derives `story-NN` from the numeric `#` column instead of requiring the slug column to contain a literal `story-NN` token.

## [3.10.1] — 2026-07-15

### Fixed

- Fixed dashed Markdown table column access in deterministic planning scripts so `depends-on`, `external-issue`, and `external-id` columns are read with bracket notation instead of being parsed as subtraction expressions.

## [3.10.0] — 2026-07-15

### Added

- `.planning/scripts/update-version.mjs` centralizes deterministic `/plan-update-version` preflight: version parsing, adjacent major-pair migration chain selection, migration-file lookup/copying, `.planning/` boundary checks, git dirty preflight, and Markdown/JSON reporting.
- `.planning/scripts/planning-init.mjs` centralizes deterministic `/plan-init` setup: template copying, non-destructive `--force` refreshes, area detection, AREA file generation, traceability table updates, config generation, and Markdown/JSON reporting.
- `.planning/scripts/planning-report.mjs` centralizes deterministic reporting and communication views for status, executive reports, exports, standups, and status-transition history.
- `.planning/scripts/planning-atomize.mjs` centralizes deterministic `/plan-atomize` inspection and writing: atomization worklist discovery, approved breakdown JSON validation, task-file rendering, story task-table rewrites, and test-suite command reporting.
- `.planning/scripts/planning-story.mjs` centralizes deterministic backlog and active-planning story utilities plus `/plan-story` execution helpers: container inspection, story ID/path allocation, draft rendering, approved section appends, split helpers, expansion table updates, edge-case recording, story execution inspection, start/DONE status updates, and finalize command reporting.
- `.planning/scripts/planning-task.mjs` centralizes deterministic `/plan-task` stages for inspection, readiness, git setup, start status updates, publish/PR automation, correction commits, and closeout updates.
- `.planning/scripts/planning-mutate.mjs` provides the shared deterministic lifecycle mutation entrypoint with subcommands for `archive`, `done`, `clone`, `merge`, `rollback`, `retry`, and `story-skip`, each with dry-run reporting where file mutations occur.

### Changed

- `/us-status`, `/plan-audit-docs`, and `/plan-doctor` now delegate repeatable structural audits to `.planning/scripts/planning-check.mjs <subcommand>` instead of carrying embedded parsers in skill context.
- `/plan-update-version` now delegates repeatable migration setup to `.planning/scripts/update-version.mjs` while keeping semantic migration application in the Markdown migration files.
- `/plan-init` now delegates repeatable initialization and area-table writing to `.planning/scripts/planning-init.mjs`.
- `/plan-init --force` now preserves existing project-specific workspace files such as `config.yml`, guide/traceability files, smoke/logging policy, `_template/`, active/finished plannings, and SDLC area guidance instead of overwriting them with bundled template defaults.
- `/plan-status`, `/plan-report`, `/plan-export`, `/plan-standup`, and `/plan-history` now delegate repeatable reporting, metrics, exports, and timeline rendering to `.planning/scripts/planning-report.mjs <subcommand>` while keeping human follow-up interpretation in the skills.
- `/plan-atomize` now delegates repeatable worklist inspection, dependency validation, task-file writes, story task-table rewrites, and test-suite command reporting to `.planning/scripts/planning-atomize.mjs` while keeping task decomposition, atomicity judgment, DB/ORM validation-task decisions, traceability, and human approval in the skill.
- `/us-new`, `/us-enrich`, `/us-split`, `/epic-enrich`, `/plan-enrich-story`, `/plan-enrich-epic`, and `/plan-split-story` now delegate mechanical story operations to `.planning/scripts/planning-story.mjs <subcommand>` while keeping product diagnosis and user approval in the skills.
- `/plan-task` now delegates deterministic substeps to `.planning/scripts/planning-task.mjs <stage>`, where the first argument is the stage (`inspect`, `readiness`, `git-setup`, `start`, `publish`, `correction`, `closeout`) while the skill keeps implementation, verification judgment, and human review.
- `/plan-done`, `/plan-clone`, `/plan-merge`, `/plan-rollback`, `/plan-retry`, `/plan-story-skip`, and `/plan-archive` now delegate repeatable lifecycle mutations to `.planning/scripts/planning-mutate.mjs <subcommand>` while keeping human approval, review, milestone feedback, PDR decisions, and command orchestration in the skills.
- `/plan-story` now delegates repeatable story orchestration reads and status mutations to `.planning/scripts/planning-story.mjs execute-*` helpers while keeping context checks, PR merge judgment, `/plan-task` invocation, final human review, smoke evidence judgment, and git/PR execution in the skill.

## [3.9.0] — 2026-07-14

### Added

- `.planning/scripts/release.mjs` centralizes deterministic release planning operations for initialization, creation, adding/removing plannings, status reporting, and status transitions.

### Changed

- `/release-init`, `/release-new`, `/release-add`, `/release-remove`, and `/release-status` now delegate `.releases/` file updates and live `.planning/` status reads to `.planning/scripts/release.mjs`.
- `scripts/verify-plugin.sh` now verifies the release script exists and passes `node --check`.
- `planning-template/update-version/2-3.md` now brings `2.x` workspaces to the current `3.9.0` baseline, including deterministic validation, documentation, and release-management scripts.

## [3.8.0] — 2026-07-14

### Added

- `.planning/scripts/planning-check.mjs` centralizes deterministic read-only planning validation for health, planning structure, and atomized task checks, with Markdown and JSON output.
- `.planning/scripts/doc-generate.mjs` centralizes deterministic documentation generation for task, story, and planning-level artifacts.
- `docs/plugin-review/07-automation-candidates.md` records the skill automation candidates, applied cuts, and token-reduction measurements.

### Changed

- `/plan-health`, `/plan-validate`, and `/plan-task-validate` now delegate repeated structural checks to `.planning/scripts/planning-check.mjs` instead of carrying long duplicated checklists in skill context.
- `/doc-generate`, `/doc-task`, and `/doc-story` now delegate document writing, append-vs-overwrite behavior, ADR detection, and planning-level consolidation to `.planning/scripts/doc-generate.mjs`.
- `scripts/verify-plugin.sh` now verifies both deterministic scripts exist and pass `node --check`.
- `planning-template/update-version/2-3.md` now brings `2.x` workspaces to the current `3.8.0` baseline, including the deterministic validation and documentation scripts.

## [3.7.0] — 2026-07-13

### Added

- `/plan-decision` creates or updates optional Project Decision Records (PDRs) only when a planning produces a cross-cutting decision.
- `/plan-test-suite` generates deterministic test-suite matrices for a planning, story, or task, using repository tooling before AI-generated guidance.
- `.planning/scripts/generate-test-suite.sh` detects local test, coverage, integration, acceptance, static-analysis, style, architecture, smoke, security, and mutation-test commands for generated planning artifacts, including Maven Cucumber/Gherkin acceptance tests through an `acceptanceTests` profile.
- `.planning/LOGGING.md` defines the software logging policy used by code tasks: mechanism, correlation/trace context, levels, sensitive-data guardrails, and stack recommendations.

### Changed

- Git-enabled `/plan-task` now commits, pushes, and opens or reuses the task PR before asking for human developer review, so external PR review can produce feedback first; requested corrections are pushed to the same PR, and the task is marked `DONE` only after review approval.
- `/plan-task`, `/plan-atomize`, task templates, and validators now treat generated test-suite gates as first-class execution evidence.
- `/plan-task`, `/plan-atomize`, task templates, and validators now require software code tasks to include intelligent logging evidence, with stack-specific recommendation and human decision when no logging mechanism is defined.
- `planning-template/update-version/2-3.md` now brings `2.x` workspaces to the current `3.7.0` baseline, including optional PDRs, test-suite generation, logging policy, and richer template examples.
- PDRs are no longer copied into every new planning as empty placeholder files. The template now lives at `.planning/PDR-TEMPLATE.md`, while `/plan-report`, `/plan-retrospective`, and `/plan-validate` know how to read or flag real `pdr-*.md` records.
- Workflows that resolve inconsistencies, cascade cross-cutting changes, update traceability, record edge cases, generate retrospectives, finish stories, or archive plannings can now invoke `/plan-decision` automatically when a decision is explicit, accepted, cross-cutting, and supported by enough evidence; otherwise they suggest it as a follow-up.
- Markdown templates now include concrete example values and example rows for initial planning, expansion, stories, tasks, traceability, raw retrospectives, PDRs, smoke tests, and idea capture.

## [3.6.0] — 2026-07-10

### Changed

- Layered git workflow now requires local cleanup after PR merges: delete each merged task branch locally after its PR lands in the story branch, and delete the local story branch after the story PR lands in `git.base_branch`. Remote branch cleanup remains controlled by the PR/repository workflow.
- Git-enabled child plannings coordinated by a parent now run in dedicated sibling worktrees, and child story/task branches preserve the worktree prefix before the rest of the branch name.

## [3.5.0] — 2026-06-29

### Added

- `/plan-edge-case` — manual command to append unexpected events, corrections, blockers, or unusual situations to a planning's `RETROSPECTIVE-RAW.md`.
- `/plan-retrospective` — generates or refreshes the final professional `README.md# Retrospective` from `RETROSPECTIVE-RAW.md`, planning context, story statuses, and traceability notes.
- `/plan-update-version` — applies cumulative adjacent major-pair planning-system migrations from `update-version/<N>-<N+1>.md`, starting with `1-2.md` to migrate legacy `scope` planning artifacts to `story`.
- `planning-template/update-version/2-3.md` — major-pair migration that brings any `2.x` workspace to the 3.x baseline by applying the recorded 3.x changes in order.
- `RETROSPECTIVE-RAW.md` planning template and `RECORD-EDGE-CASE` workflow for preserving raw retrospective signals during execution.

### Changed

- Planning execution, adjustment, recovery, validation, and archive commands now record blockers, corrections, retries, skipped work, rollbacks, validation findings, and scope changes as raw retrospective notes.
- `/plan-archive` now attempts `/plan-retrospective` when the retrospective is missing or placeholder-only and raw notes exist.
- Public docs, tutorial reference, and landing command inventory now list 50 commands and include the retrospective and update-version workflows.
- Git execution now uses layered integration: story branches start from `git.base_branch`, each task opens a PR into the story branch, and the final story PR targets the base branch.
- `/plan-task` now creates or reuses the story integration branch when invoked directly, so `/plan-story` is optional orchestration rather than a required pre-step.
- Training workspace now uses a direct custom splitter for Explorer/Main and Editor/Terminal so panel boundaries resize reliably and the reset action restores the intended layout.
- Software task execution now uses a stack-specific smoke test plan before completion: read or infer `.planning/SMOKE-TESTS.md`, run the supporting services, build/start the app, verify connectivity or schema checks, run smoke checks, and wait for human developer code review before marking DONE or committing.
- DB/ORM changes now require an explicit validation task with static database-to-ORM consistency checks and local runtime persistence smoke evidence.
- Added `/plan-smoke-config` and `.planning/SMOKE-TESTS.md` to configure stack-specific smoke tests from questions, manual input, or repository inference.
- Updated task templates, atomization, task validation, story completion, and user docs to enforce smoke-test evidence and post-verification human review before git add/commit/push/PR.

## [3.4.0] — 2026-06-29

### Added

- `/plan-edge-case` — manual command to append unexpected events, corrections, blockers, or unusual situations to a planning's `RETROSPECTIVE-RAW.md`.
- `/plan-retrospective` — generates or refreshes the final professional `README.md# Retrospective` from `RETROSPECTIVE-RAW.md`, planning context, story statuses, and traceability notes.
- `RETROSPECTIVE-RAW.md` planning template and `RECORD-EDGE-CASE` workflow for preserving raw retrospective signals during execution.

### Changed

- Planning execution, adjustment, recovery, validation, and archive commands now record blockers, corrections, retries, skipped work, rollbacks, validation findings, and scope changes as raw retrospective notes.
- `/plan-archive` now attempts `/plan-retrospective` when the retrospective is missing or placeholder-only and raw notes exist.
- Public docs, tutorial reference, and landing command inventory now list 50 commands and include the retrospective workflow.
- Git execution now uses layered integration: story branches start from `git.base_branch`, each task opens a PR into the story branch, and the final story PR targets the base branch.
- Training workspace now uses a direct custom splitter for Explorer/Main and Editor/Terminal so panel boundaries resize reliably and the reset action restores the intended layout.
- Software task execution now uses a stack-specific smoke test plan before completion: read or infer `.planning/SMOKE-TESTS.md`, run the supporting services, build/start the app, verify connectivity or schema checks, run smoke checks, and wait for human developer code review before marking DONE or committing.
- Added `/plan-smoke-config` and `.planning/SMOKE-TESTS.md` to configure stack-specific smoke tests from questions, manual input, or repository inference.
- Updated task templates, atomization, task validation, story completion, and user docs to enforce smoke-test evidence and post-verification human review before git add/commit/push/PR.

## [3.2.0] — 2026-06-27

### Changed

- Training workspace resize behavior was reworked to use a custom IDE-style splitter for the Explorer, Editor, and Terminal panes.

## [3.1.0] — 2026-06-27

### Added

- `/plan-smoke-config` — setup command that generates or updates `.planning/SMOKE-TESTS.md` with stack-specific smoke test instructions.
- `.planning/SMOKE-TESTS.md` template — project-level smoke-test plan file copied by `/plan-init` and used by task/story execution.

### Changed

- Software task execution no longer assumes a compose-backed local runtime as the universal default; smoke tests are now stack-specific and can be generated, written manually, or inferred from the repository.
- Updated task templates, atomicity checks, story execution, and planning documentation to use `Software Smoke Test Check` instead of the previous local-runtime assumption.
- Public docs and landing command inventories now include `/plan-smoke-config` and the 48-command reference.

## [3.0.0] — 2026-06-26

### Added

- `/plan-next` — read-only recommendation command that inspects planning state, blockers, dependencies, project type, and autonomy level to suggest the safest next command.
- `/plan-doctor` — plugin/template audit command for command inventory coverage, skill metadata, template integrity, and legacy reference drift.
- `/plan-audit-docs` — documentation audit command that checks expected docs for coverage, freshness, links, traceability, and consistency with planning stories/tasks.
- `planning-template/WORKFLOWS/06-PROJECT-GUIDANCE/` — guidance for adapting the workflow to documentation, research, operations, and general projects.
- `scripts/verify-plugin.sh` — local compatibility check for plugin structure, skill metadata, command inventory, workflow groups, and template markers.
- Configurable planning defaults in `.planning/config.yml`: `terminology`, `autonomy.level`, and `integrations.external_issues`.
- Risk and external issue fields in planning templates, including story summary risk, risk register, external issue mapping, story-level risk, and task-level risk.
- Prompt snippets for creating plannings, splitting stories, validating done criteria, writing ADRs, reviewing risk, and adapting planning to non-software projects.

### Changed

- `/plan-run` now honors `autonomy.level` (`manual`, `assisted`, `autonomous`) when deciding confirmation checkpoints.
- `/plan-report` now supports `--metrics` and reports risk distribution, external issue coverage, and planning health metrics.
- `/plan-export` now supports external issue draft formats: `github-issue`, `jira`, and `linear`.
- `docs/commands.yml` now carries reusable defaults for `audience`, `project_modes`, and `usage`, plus command-specific metadata for the new commands.
- Public docs, tutorial reference, and landing command inventory now list 47 commands and cover the new advisory, audit, and documentation workflows.
- Landing tutorials and training now include the v3 decision/audit flow with `/plan-next`, `/plan-report --metrics`, `/plan-audit-docs`, and `/plan-doctor`.
- `release-init` skill metadata now includes `argument-hint` so all skills satisfy the same frontmatter contract.
- Refreshed public docs and metadata to align with the current story-based command model (`/plan-story`, `story-NN`) and remove active references to the old `/plan-scope` workflow.
- Updated command reference coverage for the current 47 commands, including agents, documentation, release, recovery, and maintenance commands.
- Added general-project language to the user guide and planning task template so non-software work can use verification evidence instead of only unit-test language.
- Archived legacy SDLC-specific sub-workflows from the installed planning template and marked `docs/superpowers/` as historical design material.
- Documented intentional command overlaps by layer/audience and added `docs/commands.yml` as the canonical command inventory for docs synchronization.

## [2.4.0] — 2026-06-25

### Added

- `[CHECK-PLANNING-CONTEXT]` sub-workflow — validates planning execution context before starting a new planning run; detects in-progress stories across all active plannings, reports full git state (modified, untracked, staged, unpushed commits, stashes), and offers 4 alternatives: Abort / Inspect / Stabilize (commit WIP + optional push + mark STANDBY + return to base branch) / Proceed anyway (requires typing `CONFIRMAR PROCEDER`)
- `[CHECK-STORY-CONTEXT]` sub-workflow — validates story execution context before switching story branches; detects if the current branch is an in-progress story, reports git state, and offers 5 alternatives: Abort / Stash (asks whether to include untracked files) / Commit WIP / Commit + Push WIP / Commit + Push + mark STANDBY
- `STANDBY` story status — new lifecycle status for a story that was intentionally paused to allow a context switch; resumable by re-running `/plan-story`; documented in `GLOSSARY.md`

### Changed

- `/plan-run` — executes `[CHECK-PLANNING-CONTEXT]` at step 2b before building the execution plan
- `/plan-agent-execute` — executes `[CHECK-PLANNING-CONTEXT]` at step 0 before locating the active planning
- `/plan-story` — executes `[CHECK-STORY-CONTEXT]` at step 0 of the Git pre-flight before any branch operation

## [2.3.0] — 2026-06-23

### Added

- Training mode (`/training`): 7 interactive scenarios to practice the plugin step by step in the browser
  - Scenario 1 — Primer planning (basic, ~8 min): plan-init → plan-new → plan-expand → plan-story → plan-done → plan-archive
  - Scenario 2 — Desde un epic (basic, ~7 min): us-status → us-enrich → plan-from-epic → plan-atomize → plan-task → plan-done
  - Scenario 3 — Plan que cambia (intermediate, ~6 min): plan-status → plan-enrich-epic → plan-split-story → plan-story-skip → plan-story
  - Scenario 4 — Backlog primero (intermediate, ~7 min): us-new → us-enrich → epic-enrich → us-status → plan-from-epic
  - Scenario 5 — Gestión de release (intermediate, ~6 min): release-init → release-new → release-add → release-status × 2
  - Scenario 6 — Pipeline autónomo (advanced, ~5 min): plan-run → plan-agent-plan → plan-agent-execute → plan-agent-validate → plan-status
  - Scenario 7 — Recuperación (advanced, ~6 min): plan-health → plan-validate → plan-rollback → plan-retry → plan-story
- Per-scenario progress tracking via localStorage: ✓ badge on completed cards and global counter
- "Entrenamientos" / "Training" nav link in header and footer (ES + EN)
- 4th card in landing Commands section pointing to `/training`
- Runner page uses i18n (`useTranslation`) — all UI strings available in ES + EN

## [2.2.0] — 2026-06-23

### Added

- `/plan-git-config` — view or update the git configuration for the planning system (`git.base_branch`); useful for projects initialized before git configuration existed
- `planning-template/config.yml` — new config file written by `/plan-init` and `/plan-git-config` to store per-project git settings
- Git workflow integrated into story execution:
  - `plan-story` — pre-flight: syncs base branch, checks for branch collision, creates story branch; finalize: rebases, pushes, opens PR via `gh`
  - `plan-task` — commits after each task using conventional commits (`type(scope): description`); type derived from task objective/workflow, scope from story slug, description from task slug
  - `plan-done` — conditional push + PR when a full story is marked done and the story branch is active
  - `plan-init` — new step 8: detects default remote branch and writes `.planning/config.yml`

### Fixed

- Landing page (`/commands`): `/plan-scope` → `/plan-story`, `/plan-scope-skip` → `/plan-story-skip`, `/doc-scope` → `/doc-story` — renames from v2.0.0 were never applied to the page
- Landing page: 5 release commands (`/release-init`, `/release-new`, `/release-add`, `/release-remove`, `/release-status`) added — missing since v2.1.0
- Command count updated: 38 → 44 (hero stat and reference card, ES + EN)

## [2.1.0] — 2026-06-22

### Added

- `/release-init` — initialize `.releases/` for release planning (opt-in, independent of `/plan-init`)
- `/release-new` — create a new release in DRAFT status with semantic version, target period (`YYYY-QN-MN-WN`), and estimated date
- `/release-add` — add one or more plannings to a release; reads summaries and live statuses from `.planning/` automatically
- `/release-remove` — remove a planning from a release; requires explicit confirmation if the release has already shipped
- `/release-status` — show live release status (all releases or one in detail) with transition flags: `--mark-planned`, `--mark-in-progress`, `--mark-blocked`, `--mark-released`, `--mark-cancelled`

## [2.0.0] — 2026-06-22

### Added

- `SUPERSEDE-PLANNING` workflow — formalized process for replacing an active or completed planning; two paths: Path A (revert artifacts first, status `SUPERSEDED — REVERTED`) and Path B (overwrite internals, status `SUPERSEDED — OVERRIDDEN`)
- `## Supersedes` section in `00-initial.md` template — documents which planning is being replaced and the chosen path
- `♻️ Superseded Plannings` section in `GUIDE.md` with lifecycle description and folder movement table

### Changed

- **Scope → User Story rename** — all occurrences of "scope" as a planning concept renamed to "user story" / "story" throughout the plugin:
  - `skills/plan-scope/` → `skills/plan-story/`
  - `skills/plan-scope-skip/` → `skills/plan-story-skip/`
  - `skills/doc-scope/` → `skills/doc-story/`
  - `planning-template/_template/02-deepening/scope-NN-name.md` → `story-NN-name.md`
  - `WORKFLOWS/04-SUB-WORKFLOWS/EXECUTE-SCOPE.md` → `EXECUTE-STORY.md`
  - `WORKFLOWS/04-SUB-WORKFLOWS/NEXT-SCOPE.md` → `NEXT-STORY.md`
  - `WORKFLOWS/02-EXECUTION-WORKFLOWS/ATOMIZE-SCOPE.md` → `ATOMIZE-STORY.md`
  - `GLOSSARY.md`: `### Scope` → `### User Story (Story)`
- `task-NN-name.md` template — Approach field now asks for design rationale ("why this solution and not the obvious alternative"); Unit Tests table updated; Done Criteria requires build runner to pass
- Story files — task files are now **mandatory**: every row in the Tasks table must have a corresponding `task-NN-name.md` before the story can be marked IN PROGRESS
- `plan-story` (formerly `plan-scope`) — added step 3b: generates missing task files from template before proceeding
- `plan-task` — creates missing task file from template if not found, instead of stopping
- `EXECUTE-STORY` sub-workflow — added step 1b: task file audit; returns BLOCKED if any task file is missing
- `plan-expand` — added step 5b: checks open residuals in `TRACEABILITY-GLOBAL.md` and links relevant ones as tasks
- `CREATE-PLANNING` workflow — added bullet to consult `TRACEABILITY-GLOBAL.md → Consolidated Residuals` before creating story files
- `plan-new` — added step 2b: supersession check; executes `SUPERSEDE-PLANNING` if the new planning targets the same domain as an active one

## [1.4.0] — 2026-06-13

### Added

- `/doc-generate` — central documentation generator. Detects level (task/scope/planning) and area (WB/AP/IN/AG/DO/W) and writes the appropriate doc types: inline guides to `docs/guides/`, ADRs to `docs/adr/`, changelog entries and user guides to `docs/changelog/` and `docs/guides/`, and RELEASE.md/README.md consolidations at the planning level.
- `/doc-task` — thin wrapper over `/doc-generate` at task granularity; invoked automatically by `plan-task` at step 10b after marking a task DONE.
- `/doc-scope` — thin wrapper over `/doc-generate` at scope granularity; invoked automatically by `plan-scope` at step 7b after completing a scope.

### Changed

- `plan-task` — added step 10b: invokes `/doc-task` after marking a task DONE; includes doc files written in the final report.
- `plan-scope` — added step 7b: invokes `/doc-scope` after completing a scope; includes doc files written in the final report.

## [1.3.0] — 2026-06-13

### Added

- `/plan-retry` — retry all BLOCKED scopes in a planning after fixing a blocker, respecting dependency order
- `/plan-scope-skip` — mark a scope as SKIPPED (no longer applicable) to allow planning closure without executing it
- `/plan-rollback` — revert a DONE scope back to TODO, removing its atomized task folder; requires confirmation
- `/plan-standup` — generate standup text (yesterday/today/blockers) from scope statuses and recent git activity
- `/plan-report` — generate an executive summary with scope stats, key technical decisions, and git-derived timeline
- `/plan-history` — show a chronological table of scope status transitions extracted from git history
- `/plan-clone` — clone a planning into a new ID, preserving scope structure and resetting all statuses to TODO
- `/plan-export` — export a planning as a PR description, ticket list, or standalone markdown document
- `/plan-health` — full-system health check across 8 structural checks (duplicate IDs, orphaned files, stale plannings, index sync)
- `/plan-merge` — move a scope from one active planning to another, preserving task folders
- `/us-split` — split a user story into two focused stories with cross-references
- `/us-status` — show enrichment status of all stories in a container (DoD, Technical Notes, Dependencies, planning linkage)

## [1.2.0] — 2026-06-13

### Added

- `/plan-run` — orchestrator skill that runs a planning end-to-end from the current state. Detects planning state, presents a full execution plan with a single confirmation, then delegates to phase agents autonomously.
- `/plan-agent-plan` — phase agent for the planning phase. Creates a new planning (if needed) and advances it from INITIAL to EXPANSION without intermediate confirmations.
- `/plan-agent-execute` — phase agent for scope execution. Atomizes and executes independent scopes in parallel using Claude subagents; respects dependency order between scopes.
- `/plan-agent-validate` — phase agent for validation and closure. Runs structural validation, marks the planning done, and archives it.

## [1.1.0] — 2026-06-12

### Added
- `plan-atomize`: plan-mode — `/plan-atomize NNN-slug` now atomizes all pending scopes in a planning with a single confirmation step
- `/plan-validate` skill for verifying planning structure integrity
- Atomic task layer: `/plan-atomize`, `/plan-task`, `/plan-task-validate` skills
- `plan-from-epic` skill: bridge from story/epic containers to a full planning
- `plan-enrich-epic` and `plan-enrich-story` skills for post-expansion enrichment
- `plan-split-story` skill for decomposing oversized scopes
- Spanish/English i18n on landing page with language switcher

### Changed
- Landing commands section is now a carousel with rebalanced categories
- Install instructions updated to marketplace flow
- Status labels normalized to `TODO` across all task templates
- Improved landing mobile/desktop UX

### Fixed
- Plugin update command: marketplace suffix is now required
- `argument-hint` YAML parsing fixed in 7 skills
- `argument-hint` fixed in `us-enrich`, `epic-enrich`, and `plan-status`

### Removed
- Archon/metalanguage references removed from docs and landing

## [1.0.0] — 2026-06-11

### Added
- Initial release: planning lifecycle skills (`plan-new`, `plan-expand`, `plan-scope`, `plan-done`, `plan-archive`)
- Backlog enrichment skills (`us-enrich`, `us-new`, `epic-enrich`)
- Planning template scaffold (`_template/`, `WORKFLOWS/`, `TUTORIAL/`, `GLOSSARY.md`, `GUIDE.md`)
- `plan-init` skill to bootstrap `.planning/` in user projects
- `plan-status` skill for at-a-glance planning state
- GitHub Pages deploy workflow

[Unreleased]: https://github.com/cmartinezs/claude-planning-with-ai/compare/v3.11.0...HEAD
[3.11.0]: https://github.com/cmartinezs/claude-planning-with-ai/compare/v3.10.10...v3.11.0
[3.10.10]: https://github.com/cmartinezs/claude-planning-with-ai/compare/v3.10.9...v3.10.10
[3.10.9]: https://github.com/cmartinezs/claude-planning-with-ai/compare/v3.10.8...v3.10.9
[3.10.8]: https://github.com/cmartinezs/claude-planning-with-ai/compare/v3.10.7...v3.10.8
[3.10.7]: https://github.com/cmartinezs/claude-planning-with-ai/compare/v3.10.6...v3.10.7
[3.10.6]: https://github.com/cmartinezs/claude-planning-with-ai/compare/v3.10.5...v3.10.6
[3.10.5]: https://github.com/cmartinezs/claude-planning-with-ai/compare/v3.10.4...v3.10.5
[3.10.4]: https://github.com/cmartinezs/claude-planning-with-ai/compare/v3.10.3...v3.10.4
[3.10.3]: https://github.com/cmartinezs/claude-planning-with-ai/compare/v3.10.2...v3.10.3
[3.10.2]: https://github.com/cmartinezs/claude-planning-with-ai/compare/v3.10.1...v3.10.2
[3.10.1]: https://github.com/cmartinezs/claude-planning-with-ai/compare/v3.10.0...v3.10.1
[3.10.0]: https://github.com/cmartinezs/claude-planning-with-ai/compare/v3.9.0...v3.10.0
[3.9.0]: https://github.com/cmartinezs/claude-planning-with-ai/compare/v3.8.0...v3.9.0
[3.8.0]: https://github.com/cmartinezs/claude-planning-with-ai/compare/v3.7.0...v3.8.0
[3.7.0]: https://github.com/cmartinezs/claude-planning-with-ai/compare/v3.6.0...v3.7.0
[3.6.0]: https://github.com/cmartinezs/claude-planning-with-ai/compare/v3.5.0...v3.6.0
[3.5.0]: https://github.com/cmartinezs/claude-planning-with-ai/compare/v3.4.0...v3.5.0
[3.4.0]: https://github.com/cmartinezs/claude-planning-with-ai/compare/v3.2.0...v3.4.0
[3.2.0]: https://github.com/cmartinezs/claude-planning-with-ai/compare/v3.1.0...v3.2.0
[3.1.0]: https://github.com/cmartinezs/claude-planning-with-ai/compare/v3.0.0...v3.1.0
[3.0.0]: https://github.com/cmartinezs/claude-planning-with-ai/compare/v2.4.0...v3.0.0
[2.4.0]: https://github.com/cmartinezs/claude-planning-with-ai/compare/v2.3.0...v2.4.0
[2.3.0]: https://github.com/cmartinezs/claude-planning-with-ai/compare/v2.2.0...v2.3.0
[2.2.0]: https://github.com/cmartinezs/claude-planning-with-ai/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/cmartinezs/claude-planning-with-ai/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/cmartinezs/claude-planning-with-ai/compare/v1.4.0...v2.0.0
[1.4.0]: https://github.com/cmartinezs/claude-planning-with-ai/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/cmartinezs/claude-planning-with-ai/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/cmartinezs/claude-planning-with-ai/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/cmartinezs/claude-planning-with-ai/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/cmartinezs/claude-planning-with-ai/releases/tag/v1.0.0
