# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Changed

- Refreshed public docs and metadata to align with the current story-based command model (`/plan-story`, `story-NN`) and remove active references to the old `/plan-scope` workflow.
- Updated command reference coverage for the current 44 commands, including agents, documentation, release, recovery, and maintenance commands.
- Added general-project language to the user guide and planning task template so non-software work can use verification evidence instead of only unit-test language.
- Archived legacy SDLC-specific sub-workflows from the installed planning template and marked `docs/superpowers/` as historical design material.

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

[Unreleased]: https://github.com/cmartinezs/claude-planning-with-ai/compare/v2.4.0...HEAD
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
