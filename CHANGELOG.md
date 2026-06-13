# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

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

[Unreleased]: https://github.com/cmartinezs/claude-planning-with-ai/compare/v1.4.0...HEAD
[1.4.0]: https://github.com/cmartinezs/claude-planning-with-ai/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/cmartinezs/claude-planning-with-ai/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/cmartinezs/claude-planning-with-ai/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/cmartinezs/claude-planning-with-ai/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/cmartinezs/claude-planning-with-ai/releases/tag/v1.0.0
