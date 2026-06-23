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
[![Version](https://img.shields.io/badge/version-2.3.0-brightgreen?style=flat-square)](.claude-plugin/plugin.json)
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

`/plan-init` detects your top-level directories, infers the stack (Next.js, Spring Boot, Terraform…), and proposes a short code per area (`WB`, `AP`, `IN`…). Confirm or adjust — then everything is wired up automatically.

---

## Work through the lifecycle

```bash
/plan-new 001-user-auth -- Implement JWT authentication
/plan-expand  001-user-auth          # INITIAL → EXPANSION (identify scopes)
/plan-atomize 001-user-auth scope-01 # optional: atomic tasks (design + impl + unit tests)
/plan-task    001-user-auth scope-01 task-01 # execute one atomic task
/plan-scope   001-user-auth scope-01 # DEEPENING (execute scope tasks)
/plan-done    001-user-auth scope-01 # mark scope complete
/plan-archive 001-user-auth          # audit + move to finished/
```

Or generate a planning directly from existing stories:
```bash
/plan-from-epic 001 path/to/epic/   # 1 story = 1 scope
```

---

## Why this plugin

- **Lifecycle enforcement** — INITIAL → EXPANSION → DEEPENING → COMPLETED. No skipping.
- **Area-aware traceability** — every scope records which directories it touches (`AP`, `WB`, `IN`…).
- **Auto-configured for your project** — `/plan-init` discovers your structure; you confirm.
- **Backlog bridge** — convert existing epics/stories into executable plannings in one command.
- **Atomic task decomposition** — `/plan-atomize` turns a scope into session-sized tasks, each with technical design, implementation steps, and unit tests.
- **Mid-execution adjustments** — enrich, split, or deepen scopes without losing history.
- **Self-checking** — `/plan-validate` audits structure, dependencies, and workflow references at any time.
- **Pure markdown** — no lock-in, readable in any editor, version-controlled with your code.

---

## Commands at a glance

| Group | Commands |
|-------|----------|
| Init | `/plan-init` · `--blank` · `--force` |
| Lifecycle | `/plan-new` · `/plan-expand` · `/plan-scope` · `/plan-done` · `/plan-archive` |
| Atomic tasks | `/plan-atomize` · `/plan-task` · `/plan-task-validate` |
| Status / ideas | `/plan-status` · `/plan-validate` · `/plan-template` |
| Backlog | `/us-new` · `/us-enrich` · `/epic-enrich` · `/plan-from-epic` |
| Adjust | `/plan-enrich-epic` · `/plan-enrich-story` · `/plan-split-story` |

Full flag reference → [`docs/reference.md`](docs/reference.md)

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
