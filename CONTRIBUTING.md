# Contributing to Planning with AI

Thanks for your interest. Contributions are welcome — bug reports, fixes, new skills, workflow improvements, and landing page changes.

## Before you start

Read [`docs/developer-guide.md`](docs/developer-guide.md) first. It covers the repository structure, the SKILL.md format, how `planning-template/` works, and the marker comment system that `plan-init` relies on.

## Setup

```bash
git clone git@github.com:cmartinezs/claude-planning-with-ai.git
ln -s $(pwd)/claude-planning-with-ai ~/.claude/plugins/claude-planning-with-ai
```

No build step. The symlink makes your clone available to Claude Code immediately.

## What needs updating when you change things

### A skill (`skills/*/SKILL.md`)
- `README.md` — command tables
- `planning-template/TUTORIAL/reference.md` — command reference inside the template
- `.page/components/Commands.tsx` — if the command is user-facing
- `CLAUDE.md` — if an architectural constraint changed

### A workflow (`planning-template/WORKFLOWS/`)
- `WORKFLOWS/README.md` — table and Mermaid diagram
- Any skills that invoke the workflow
- `04-SUB-WORKFLOWS/README.md` if it's a sub-workflow

### `planning-template/` (anything the user gets)
- Test by running `/plan-init` in a scratch directory
- Verify marker comments (`<!-- AREAS-TABLE -->`, `<!-- AREAS-REF -->`, `<!-- MATRIX-HEADER -->`) resolve correctly
- Verify `plan-new` + `plan-expand` still produce valid files

### The landing page (`.page/`)
- Run `npm run build` in `.page/` and fix any errors before submitting

## Testing

There is no automated test runner. Validate by:

1. Reading the affected `SKILL.md` and tracing its references manually
2. Running the command in a live Claude Code session against a real project
3. For landing page changes: `cd .page && npm run build`

## Pull requests

- One logical change per PR
- Imperative present-tense commit messages: `Add plan-template skill`, `Fix area code collision on identically-named dirs`
- Describe *why* in the PR body, not just what changed
- If your change affects the user-visible lifecycle or commands, update the landing page and docs in the same PR

## Reporting issues

Open an issue describing:
- What command you ran (exact invocation)
- What you expected
- What actually happened (paste the output)
- Your Claude Code version and OS

## License

By contributing, you agree that your contributions will be licensed under the same [MIT License](LICENSE) as the project. The copyright notice in `LICENSE` reflects the original author; contributors are credited in the git history.
