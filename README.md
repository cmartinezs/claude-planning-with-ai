<div align="center">

<pre>
██████╗ ██╗      █████╗ ███╗   ██╗███╗   ██╗██╗███╗   ██╗ ██████╗                       
██╔══██╗██║     ██╔══██╗████╗  ██║████╗  ██║██║████╗  ██║██╔════╝                       
██████╔╝██║     ███████║██╔██╗ ██║██╔██╗ ██║██║██╔██╗ ██║██║  ███╗   · with AI ·        
██╔═══╝ ██║     ██╔══██║██║╚██╗██║██║╚██╗██║██║██║╚██╗██║██║   ██║                      
██║     ███████╗██║  ██║██║ ╚████║██║ ╚████║██║██║ ╚████║╚██████╔╝   Claude Code Plugin 
╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═══╝╚═╝╚═╝  ╚═══╝ ╚═════╝                       
</pre>

**Structured lifecycle planning for software projects**

[![License: MIT](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![Version](https://img.shields.io/badge/version-3.10.5-brightgreen?style=flat-square)](.claude-plugin/plugin.json)
[![Platform](https://img.shields.io/badge/Claude%20Code-plugin-7C3AED?style=flat-square)](https://claude.ai/code)
[![Storage](https://img.shields.io/badge/storage-plain%20markdown-6B7280?style=flat-square)](planning-template/)
[![Author](https://img.shields.io/badge/author-cmartinezs-0EA5E9?style=flat-square)](https://cmartinezs.github.io)
[![Landing](https://img.shields.io/badge/landing-cmartinezs.github.io%2Fclaude--planning--with--ai-brand?style=flat-square)](https://cmartinezs.github.io/claude-planning-with-ai/)

</div>

---

## Install

From within Claude Code, add the marketplace and install the plugin:

```
/plugin marketplace add cmartinezs/claude-planning-with-ai
/plugin install claude-planning-with-ai@cmartinezs
```

Or from your terminal:

```bash
claude plugin marketplace add cmartinezs/claude-planning-with-ai
claude plugin install claude-planning-with-ai@cmartinezs
```

To update to the latest version later:

```bash
claude plugin update claude-planning-with-ai@cmartinezs
```

---

## First run

```bash
# Scan your project, propose area codes, scaffold .planning/
/plan-init
```

`/plan-init` initializes `.planning/` in the current directory only. It detects top-level directories there, infers the stack (Next.js, Spring Boot, Terraform…), and proposes a short code per area (`WB`, `AP`, `IN`…). In monorepos, initialize the parent and each independently managed child artifact separately; when git is enabled, run child plannings from dedicated sibling worktrees such as `../<worktree-prefix>`.

---

## Work through the lifecycle

```bash
/plan-new 001-user-auth -- Implement JWT authentication
/plan-expand  001-user-auth           # INITIAL → EXPANSION (identify stories)
/plan-atomize 001-user-auth story-01  # optional: atomic tasks (design + impl + verification)
/plan-task    001-user-auth story-01 task-01  # execute one atomic task
/plan-story   001-user-auth story-01  # DEEPENING (execute story tasks)
/plan-done    001-user-auth story-01  # mark story complete
/plan-retrospective 001-user-auth     # generate final retrospective
/plan-archive 001-user-auth           # audit + move to finished/
```

Or generate a planning directly from existing stories:
```bash
/plan-from-epic 001 path/to/epic/   # 1 user story = 1 planning story
```

---

## Why this plugin

- **Lifecycle enforcement** — INITIAL → EXPANSION → DEEPENING → COMPLETED. No skipping.
- **Area-aware traceability** — every story records which directories it touches (`AP`, `WB`, `IN`…).
- **Auto-configured for your project** — `/plan-init` discovers your structure; you confirm.
- **Monorepo-safe planning** — commands use the current directory's `.planning/`; parent plans coordinate child plannings without absorbing child implementation work, and git-enabled child plannings run in their own sibling worktrees.
- **Backlog bridge** — convert existing epics/stories into executable plannings in one command.
- **Atomic task decomposition** — `/plan-atomize` turns a story into session-sized tasks, each with technical design, implementation steps, verification, generated test-suite gates, and software smoke tests when applicable.
- **Software logging policy** — code tasks follow `.planning/LOGGING.md`, including correlation/trace context, criticality-based levels, safe context, and stack-specific logger selection when no mechanism exists.
- **Deterministic test-suite generation** — `/plan-test-suite` writes planning/story/task test matrices from repository tooling first: unit, coverage, integration, acceptance, static analysis, style, architecture guide review, smoke, security, and mutation gates.
- **Layered git workflow** — story branches start from `git.base_branch`; each task gets its own sibling branch with a `--task-...` suffix and PR into the story branch; child worktree branches keep the worktree prefix before `story-...`; task PRs merge incrementally into the story branch; final story PRs target the base branch; merged task/story branches are cleaned locally.
- **Mid-execution adjustments** — enrich, split, or deepen stories without losing history. Switching context triggers git-state validation and safe alternatives (stash, WIP commit, STANDBY).
- **Self-checking** — `/plan-validate` audits structure, dependencies, and workflow references at any time.
- **Pure markdown** — no lock-in, readable in any editor, version-controlled with your code.

---

## Commands at a glance

| Group | Commands |
|-------|----------|
| Init | `/plan-init` · `--blank` · `--force` · `/plan-git-config` · `/plan-smoke-config` |
| Lifecycle | `/plan-new` · `/plan-expand` · `/plan-story` · `/plan-done` · `/plan-archive` |
| Atomic tasks | `/plan-atomize` · `/plan-task` · `/plan-task-validate` · `/plan-test-suite` |
| Status / ideas | `/plan-status` · `/plan-validate` · `/plan-template` · `/plan-health` · `/plan-decision` |
| Backlog | `/us-new` · `/us-enrich` · `/us-split` · `/us-status` · `/epic-enrich` · `/plan-from-epic` |
| Adjust | `/plan-enrich-epic` · `/plan-enrich-story` · `/plan-split-story` · `/plan-story-skip` · `/plan-merge` |
| Automation | `/plan-run` · `/plan-agent-plan` · `/plan-agent-execute` · `/plan-agent-validate` |
| Docs | `/doc-generate` · `/doc-task` · `/doc-story` · `/plan-audit-docs` |
| Releases | `/release-init` · `/release-new` · `/release-add` · `/release-remove` · `/release-status` |
| Recovery / reports | `/plan-retry` · `/plan-rollback` · `/plan-edge-case` · `/plan-retrospective` · `/plan-update-version` · `/plan-standup` · `/plan-report` · `/plan-history` · `/plan-clone` · `/plan-export` · `/plan-doctor` |

Full flag reference → [`docs/reference.md`](docs/reference.md)

### Similar commands

| Need | Use |
|------|-----|
| Enrich a backlog story before planning | `/us-enrich` |
| Enrich a story already inside `.planning/active/` | `/plan-enrich-story` |
| Add missing stories to a product backlog container | `/epic-enrich` |
| Add missing stories to an active planning | `/plan-enrich-epic` |
| Split a backlog story | `/us-split` |
| Split an active planning story | `/plan-split-story` |
| Check the whole `.planning/` system | `/plan-health` |
| Validate one planning in detail | `/plan-validate` |
| Record a cross-cutting planning decision | `/plan-decision` |
| Generate test gates for a plan/story/task | `/plan-test-suite` |
| Record something unexpected for the final retro | `/plan-edge-case` |
| Generate the final planning retrospective | `/plan-retrospective` |
| Upgrade an older `.planning/` workspace after a major plugin change | `/plan-update-version 1.4.0 2.0.0` |
| Check current planning state | `/plan-status` |
| Audit generated documentation | `/plan-audit-docs` |
| Audit this plugin checkout | `/plan-doctor` |

---

## Docs

| | |
|--|--|
| [Landing page](https://cmartinezs.github.io/claude-planning-with-ai/) | Commands, tutorials and interactive training |
| [User guide](docs/user-guide.md) | Concepts, flows, and worked examples |
| [Developer guide](docs/developer-guide.md) | Architecture, skill format, how to extend |
| [Command reference](docs/reference.md) | All commands, flags, and the installed structure |

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). The plugin is entirely markdown — no build step, no test runner. The fastest way to understand the architecture is [`docs/developer-guide.md`](docs/developer-guide.md).

## License

[MIT](LICENSE) — free to use, fork, and modify. Attribution required.

Made by [Carlos Martínez](https://cmartinezs.github.io).
