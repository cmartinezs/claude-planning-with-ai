# ⚛️ TASK NN — [Task Name]

> **Status:** TODO
> **Workflow:** [WORKFLOW-NAME]
> **Depends On:** — *(or `task-NN`, comma-separated)*
> [← story file](../story-NN-name.md)

---

## Objective

> *The single deliverable this task produces. One task = one verifiable output.*
> Example: `A persistent reset-token model and repository exist, with expiry and single-use semantics covered by tests.`

[One sentence: what exists after this task that didn't exist before.]

---

## Technical Design

> *Decisions made before implementation. If this section cannot be filled, the task is not ready to execute.*

- **Approach:** [Why this solution and not the obvious alternative — argue the design decision in the context of this story. If the obvious approach is correct, say so explicitly. If alternatives were discarded, name them briefly.]
- **Affected files / components:** [Exact list of files that will be created or modified]
- **Interfaces / contracts:** [What this task exposes to the rest of the story: types, routes, tokens, schemas. "None" if fully internal.]
- **Risk:** [Main risk in this task and how the implementation reduces it. Use "Low — routine change" if appropriate.]
- **Design notes:** [Constraints, invariants, gotchas the implementer must know before touching code]

Example:

- **Approach:** Store hashed reset tokens in the database instead of plaintext tokens or in-memory state, so tokens survive process restarts without exposing the raw token if records leak.
- **Affected files / components:** `api/src/main/.../PasswordResetToken.java`, `api/src/main/.../PasswordResetTokenRepository.java`, `api/src/main/resources/db/migration/V12__password_reset_tokens.sql`
- **Interfaces / contracts:** Internal repository plus service method `createResetToken(email)`; no public API in this task.
- **Risk:** Medium — token expiry and reuse rules are security-sensitive; cover with repository/service tests.
- **Design notes:** Raw tokens are shown only once, stored only as hashes, and must be deleted or marked used after password update.

---

## Implementation Steps

> *Concrete, ordered steps naming real files or components — no abstract verbs.*

1. [Step naming a real file or component]
2. [Step naming a real file or component]

Example:

1. Create `V12__password_reset_tokens.sql` with token hash, user id, expiry, used timestamp, and indexes.
2. Add `PasswordResetToken` entity and repository mapped to the migration fields.
3. Add service tests for token creation, expiry filtering, and used-token rejection.

---

## Verification

> *If the task produces no code (config, assets, docs), list manual verifications instead.*

| # | Verification | How to validate |
|---|-------------|----------------|
| 1 | Repository persists token metadata | Run the repository/service test that saves and reloads a token |
| 2 | Expired and used tokens are rejected | Run tests covering expired token and reused token paths |

### Software Smoke Test Check

> *Required when `.planning/config.yml` has `project.type: software`. Use `.planning/SMOKE-TESTS.md` when it exists. If it does not exist, infer the smoke plan from the repository stack signals, write the inferred commands here before running them, and keep the checks as small and non-destructive as possible.*

| # | Check | How to validate |
|---|-------|----------------|
| 1 | Supporting services are ready | Example: `docker compose up -d db` then confirm the DB health check passes |
| 2 | App compiles and starts | Example: `./mvnw test` or `npm run build` followed by the local start command |
| 3 | Connectivity or schema validation succeeds | Example: app boot applies migrations and connects to the local database |
| 4 | Changed surface responds correctly | Example: call the reset-token endpoint or service smoke path with a test email |
| 5 | No startup regressions are visible | Example: inspect logs for new migration, dependency, or boot failures |

### Database / ORM Consistency Check

> *Required when this task changes database structure, migrations, schema files, seed/bootstrap data, ORM models/entities, generated clients, repositories tied to ORM models, or persistence configuration. If no database or ORM is involved, write `N/A`.*

| # | Check | How to validate |
|---|-------|----------------|
| 1 | Static database-to-ORM consistency is valid | Example: compare `V12__password_reset_tokens.sql` with `PasswordResetToken` fields, indexes, nullability, enum values, and generated artifacts |
| 2 | Local runtime environment starts | Example: start local DB plus app using the project command; ask the human if startup cannot be inferred |
| 3 | Persistence smoke check passes | Example: create a reset token through the service/API and verify the row exists without destructive cleanup |

---

## Done Criteria

- [ ] Reset-token persistence deliverable exists and can be exercised by tests
- [ ] All verification checks listed above pass
- [ ] For software projects, smoke test plan passes: supporting services, app startup, connectivity or schema checks, and changed-surface smoke checks
- [ ] If database structure or ORM artifacts changed, static DB/ORM consistency validation passes and local runtime persistence smoke evidence is captured
- [ ] For git-enabled tasks, implementation was committed, pushed, and published in a task PR before human review
- [ ] Human developer PR review completed; requested corrections, if any, were implemented, pushed to the same PR, and re-reviewed
- [ ] `npm run dev` / `./mvnw test` / equivalent runs without errors
- [ ] No unintended expansion: the task satisfies `[CHECK-ATOMICITY]`

---

> [← story file](../story-NN-name.md)
