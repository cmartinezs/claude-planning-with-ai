# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

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

[Unreleased]: https://github.com/cmartinezs/claude-planning-with-ai/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/cmartinezs/claude-planning-with-ai/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/cmartinezs/claude-planning-with-ai/releases/tag/v1.0.0
