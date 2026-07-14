---
name: plan-test-suite
description: Generate deterministic test-suite matrices for a planning, story, or task. Prefers repository scripts and tooling over AI-generated guesses.
argument-hint: <NNN-slug> [story-NN] [task-NN] [--all]
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
---

Generate or refresh test-suite artifacts for a planning, story, or task. The command must prefer deterministic repository inference and scripts over AI-authored plans so token usage stays low and test evidence remains reproducible.

Reference artifacts:
- `.planning/scripts/generate-test-suite.sh`
- `.planning/SMOKE-TESTS.md`
- `.planning/config.yml`

## Arguments

`$ARGUMENTS` — format: `<NNN-slug> [story-NN] [task-NN] [--all]`

- `NNN-slug` — planning id.
- `story-NN` — optional story id. If omitted, generate the planning-level suite.
- `task-NN` — optional task id. Requires `story-NN`.
- `--all` — generate planning, every atomized story, and every task suite in one pass.

Examples:

```text
/plan-test-suite 001-user-auth
/plan-test-suite 001-user-auth story-01
/plan-test-suite 001-user-auth story-01 task-02
/plan-test-suite 001-user-auth --all
```

## Output Paths

| Scope | Output |
|-------|--------|
| Planning | `.planning/active/<planning-id>/TEST-SUITE.md` |
| Story | `.planning/active/<planning-id>/02-deepening/<story-id>-*/TEST-SUITE.md` |
| Task | `.planning/active/<planning-id>/02-deepening/<story-id>-*/test-suites/<task-id>-<slug>-test-suite.md` |

## Steps

1. Parse `$ARGUMENTS`.
2. Use only the current directory's `./.planning/`. Do not search parent directories.
3. Read `.planning/config.yml` if present. Extract:
   - `project.type` (default: `software`)
   - `execution.requires_tests` (default: `true`)
   - `software.smoke_tests_file` (default: `SMOKE-TESTS.md`)
4. Locate `.planning/active/<planning-id>/`. If it does not exist, stop and report.
5. Prefer the bundled deterministic generator:
   ```bash
   bash .planning/scripts/generate-test-suite.sh --planning <planning-id> [--story <story-id>] [--task <task-id>] [--all]
   ```
   - If the script exists and succeeds, read every generated file and continue at step 7.
   - If the script is missing, write a minimal equivalent artifact manually using the schema in step 6 and report that the workspace should be updated with `/plan-update-version`.
   - If the script fails, report the error. Do not invent commands blindly; inspect repository files and write only evidence-backed entries.
6. Manual fallback schema. For each requested scope, write the output path from the table above with these sections:
   - `# Test Suite — <scope>`
   - `## Scope`
   - `## Quality Gates`
   - `## Independent Acceptance Environment`
   - `## Acceptance Dependency Inventory`
   - `## Coverage And Evidence`
   - `## Gaps To Fill Manually`
7. Ensure the generated `## Quality Gates` includes at least these rows:
   - Unit tests
   - Coverage
   - Integration tests
   - Acceptance / e2e tests
   - Static analysis
   - Code style / formatting
   - Architecture and design guides
   - Runtime smoke
   - Security / dependency scan
   - Mutation / test strength
8. For each gate, prefer existing commands detected from files such as:
   - `package.json`, `pnpm-lock.yaml`, `yarn.lock`, `package-lock.json`
   - `pom.xml`, `mvnw`, `build.gradle*`, `gradlew`
   - `.feature` files and Cucumber/Gherkin dependencies
   - `pyproject.toml`, `requirements.txt`
   - `go.mod`, `Cargo.toml`
   - `docker-compose.yml`, `compose.yml`
   - `sonar-project.properties`, CI workflows, lint/typecheck config, formatter config
9. Architecture and guide review must be explicit. If automated checks exist, list them. Otherwise add a checklist entry to review:
   - DDD aggregate/entity/value-object boundaries
   - Hexagonal ports/adapters and dependency direction
   - DRY and duplication pressure
   - SOLID responsibilities and dependency inversion
   - GoF pattern usage only when it reduces real complexity
   - project-specific guidelines under `docs/`, `.planning/WORKFLOWS/05-SDLC-PHASE-GUIDANCE/`, or linked architecture docs
10. Integration and acceptance gates must prefer isolated environments:
    - Docker Compose, Testcontainers, local emulators, sandbox profiles, in-memory/disposable stores, or fixture services.
    - Shared staging services are acceptable only when local isolation is unavailable and the artifact says so explicitly.
    - The generated artifact must include an `## Acceptance Dependency Inventory` covering every dependency required to execute acceptance tests:
      - internal modules/packages or sibling artifacts that must be built from the same commit
      - databases, schemas, migrations, bootstrap or seed data
      - external HTTP APIs and their fake/mock implementation
      - queues, brokers, topics, event buses, scheduled workers, and async consumers
      - object storage, file systems, caches, search engines, email/SMS/push providers, auth/identity providers, payment providers, and other SaaS dependencies
      - required environment variables, secrets, ports, network aliases, readiness checks, startup order, teardown, and cleanup rules
      - whether each dependency is real disposable infrastructure, Testcontainers, Docker Compose, local fake, WireMock/MockServer, in-memory fixture, or explicitly out of scope
      Any unresolved dependency in this inventory is a blocking gap for acceptance evidence.
    - For Maven services using Cucumber/Gherkin, prefer a dedicated `acceptanceTests` profile. The expected command is:
      ```bash
      ./mvnw -PacceptanceTests verify
      ```
      This profile should package or boot the artifact in isolation and mock external dependencies through local fakes, WireMock, MockServer, Testcontainers, or equivalent fixtures. If `.feature` files or Cucumber/Gherkin dependencies exist but the profile is missing, record that as a gap to implement instead of treating acceptance coverage as complete.
      The generated artifact must include a `## Maven Acceptance Test Configuration` section with a concrete scaffold for:
      - `maven-failsafe-plugin`
      - `**/*AcceptanceIT.java` / `**/*CucumberIT.java` includes
      - packaged artifact path (`target/<finalName>.jar`)
      - `SPRING_PROFILES_ACTIVE=acceptance`
      - environment variables that redirect databases and external services to Testcontainers, WireMock, MockServer, local fakes, or equivalent fixtures
      - a note that `@MockBean` is not acceptable for artifact-level acceptance tests
      If the current planning/story/task needs this missing profile, add or update an implementation task to create it before relying on acceptance evidence.
11. If `project.type` is not `software` or `execution.requires_tests` is `false`, still generate a verification suite, but label automated code gates as `N/A` when no code exists and replace them with documentary, operational, research, or approval evidence.
12. Report:
    - files generated or refreshed
    - commands inferred automatically
    - gates that still need manual completion
    - the next recommended command (`/plan-atomize`, `/plan-task`, `/plan-story`, or `/plan-validate`)

## Integration With Execution

- Run `/plan-test-suite <planning-id> --all` after `/plan-expand` or `/plan-atomize` when a complete test strategy is needed.
- Run `/plan-test-suite <planning-id> <story-id> <task-id>` before `/plan-task` when a task lacks a task-level test suite.
- `/plan-task` should read the task test-suite artifact when present and execute applicable gates before publishing the task PR for review.
