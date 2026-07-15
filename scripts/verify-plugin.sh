#!/usr/bin/env bash
set -u

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
failures=0
warnings=0

fail() {
  printf 'FAIL: %s\n' "$1"
  failures=$((failures + 1))
}

warn() {
  printf 'WARN: %s\n' "$1"
  warnings=$((warnings + 1))
}

pass() {
  printf 'PASS: %s\n' "$1"
}

require_file() {
  local path="$1"
  if [[ -f "$ROOT/$path" ]]; then
    pass "$path exists"
  else
    fail "$path is missing"
  fi
}

require_dir() {
  local path="$1"
  if [[ -d "$ROOT/$path" ]]; then
    pass "$path exists"
  else
    fail "$path is missing"
  fi
}

require_file ".claude-plugin/plugin.json"
require_file "README.md"
require_file "docs/reference.md"
require_file "docs/commands.yml"
require_file "planning-template/README.md"
require_file "planning-template/config.yml"
require_file "planning-template/PDR-TEMPLATE.md"
require_file "planning-template/LOGGING.md"
require_file "planning-template/scripts/doc-generate.mjs"
require_file "planning-template/scripts/generate-test-suite.sh"
require_file "planning-template/scripts/planning-mutate.mjs"
require_file "planning-template/scripts/planning-init.mjs"
require_file "planning-template/scripts/planning-check.mjs"
require_file "planning-template/scripts/planning-report.mjs"
require_file "planning-template/scripts/planning-atomize.mjs"
require_file "planning-template/scripts/planning-story.mjs"
require_file "planning-template/scripts/planning-task.mjs"
require_file "planning-template/scripts/release.mjs"
require_file "planning-template/scripts/update-version.mjs"
require_dir "skills"
require_dir "planning-template/WORKFLOWS"

for mutate_impl in \
  "planning-archive.mjs" \
  "planning-clone.mjs" \
  "planning-done.mjs" \
  "planning-merge.mjs" \
  "planning-rollback.mjs" \
  "planning-retry.mjs" \
  "planning-story-skip.mjs"; do
  require_file "planning-template/scripts/$mutate_impl"
done

while IFS= read -r skill_dir; do
  skill_name="$(basename "$skill_dir")"
  skill_file="$skill_dir/SKILL.md"

  if [[ ! -f "$skill_file" ]]; then
    fail "skills/$skill_name/SKILL.md is missing"
    continue
  fi

  if ! grep -q "^name: $skill_name$" "$skill_file"; then
    fail "skills/$skill_name/SKILL.md name does not match directory"
  fi

  for field in description argument-hint allowed-tools; do
    if ! grep -q "^$field:" "$skill_file"; then
      fail "skills/$skill_name/SKILL.md missing frontmatter field: $field"
    fi
  done

  if ! grep -q "name: $skill_name$" "$ROOT/docs/commands.yml"; then
    fail "docs/commands.yml missing command: $skill_name"
  fi
done < <(find "$ROOT/skills" -mindepth 1 -maxdepth 1 -type d | sort)

while IFS= read -r source; do
  if [[ ! -f "$ROOT/$source" ]]; then
    fail "docs/commands.yml references missing source: $source"
  fi
done < <(grep -E '^[[:space:]]+source: ' "$ROOT/docs/commands.yml" | sed 's/^[[:space:]]*source: //')

for workflow_dir in \
  "planning-template/WORKFLOWS/01-PLANNING-WORKFLOWS" \
  "planning-template/WORKFLOWS/02-EXECUTION-WORKFLOWS" \
  "planning-template/WORKFLOWS/03-MAINTENANCE-WORKFLOWS" \
  "planning-template/WORKFLOWS/04-SUB-WORKFLOWS" \
  "planning-template/WORKFLOWS/05-SDLC-PHASE-GUIDANCE" \
  "planning-template/WORKFLOWS/06-PROJECT-GUIDANCE"; do
  require_dir "$workflow_dir"
done

for template_check in \
  "Risk Register|planning-template/_template/01-expansion.md" \
  "External Issue|planning-template/_template/01-expansion.md" \
  "## Risk|planning-template/_template/02-deepening/story-NN-name.md" \
  "**Risk:**|planning-template/_template/02-deepening/task-NN-name.md" \
  "## Summary Evidence|planning-template/_template/02-deepening/task-NN-name.md" \
  "## Frontend Design Plan|planning-template/_template/02-deepening/task-NN-name.md" \
  "## Backend/API Design Plan|planning-template/_template/02-deepening/task-NN-name.md" \
  "### Logging / Observability|planning-template/_template/02-deepening/task-NN-name.md" \
  "### Generated Test Suite|planning-template/_template/02-deepening/task-NN-name.md" \
  "## Test Suite|planning-template/_template/02-deepening/story-NN-name.md"; do
  needle="${template_check%%|*}"
  path="${template_check#*|}"
  if ! grep -Fq "$needle" "$ROOT/$path"; then
    fail "$path missing expected marker: $needle"
  fi
done

if [[ -f "$ROOT/planning-template/_template/pdr-NNN-title.md" ]]; then
  fail "planning-template/_template/pdr-NNN-title.md should not exist; PDRs are optional and use planning-template/PDR-TEMPLATE.md"
fi

if grep -REq 'row\.[A-Za-z0-9_]+-[A-Za-z0-9_-]+' "$ROOT/planning-template/scripts"; then
  fail "planning-template/scripts contains dashed table column access with dot notation; use row['column-name']"
else
  pass "planning-template/scripts uses bracket notation for dashed table columns"
fi

if command -v node >/dev/null 2>&1; then
  if node --check "$ROOT/planning-template/scripts/doc-generate.mjs" >/dev/null; then
    pass "planning-template/scripts/doc-generate.mjs syntax is valid"
  else
    fail "planning-template/scripts/doc-generate.mjs has invalid syntax"
  fi

  if node --check "$ROOT/planning-template/scripts/planning-check.mjs" >/dev/null; then
    pass "planning-template/scripts/planning-check.mjs syntax is valid"
  else
    fail "planning-template/scripts/planning-check.mjs has invalid syntax"
  fi

  if node --check "$ROOT/planning-template/scripts/planning-report.mjs" >/dev/null; then
    pass "planning-template/scripts/planning-report.mjs syntax is valid"
  else
    fail "planning-template/scripts/planning-report.mjs has invalid syntax"
  fi

  if node --check "$ROOT/planning-template/scripts/planning-atomize.mjs" >/dev/null; then
    pass "planning-template/scripts/planning-atomize.mjs syntax is valid"
  else
    fail "planning-template/scripts/planning-atomize.mjs has invalid syntax"
  fi

  if node --check "$ROOT/planning-template/scripts/planning-story.mjs" >/dev/null; then
    pass "planning-template/scripts/planning-story.mjs syntax is valid"
  else
    fail "planning-template/scripts/planning-story.mjs has invalid syntax"
  fi

  if node --check "$ROOT/planning-template/scripts/planning-task.mjs" >/dev/null; then
    pass "planning-template/scripts/planning-task.mjs syntax is valid"
  else
    fail "planning-template/scripts/planning-task.mjs has invalid syntax"
  fi

  if node --check "$ROOT/planning-template/scripts/planning-mutate.mjs" >/dev/null; then
    pass "planning-template/scripts/planning-mutate.mjs syntax is valid"
  else
    fail "planning-template/scripts/planning-mutate.mjs has invalid syntax"
  fi

  if node --check "$ROOT/planning-template/scripts/planning-init.mjs" >/dev/null; then
    pass "planning-template/scripts/planning-init.mjs syntax is valid"
  else
    fail "planning-template/scripts/planning-init.mjs has invalid syntax"
  fi

  for mutate_impl in \
    "planning-archive.mjs" \
    "planning-clone.mjs" \
    "planning-done.mjs" \
    "planning-merge.mjs" \
    "planning-rollback.mjs" \
    "planning-retry.mjs" \
    "planning-story-skip.mjs"; do
    if node --check "$ROOT/planning-template/scripts/$mutate_impl" >/dev/null; then
      pass "planning-template/scripts/$mutate_impl mutation implementation syntax is valid"
    else
      fail "planning-template/scripts/$mutate_impl has invalid syntax"
    fi
  done

  if node --check "$ROOT/planning-template/scripts/release.mjs" >/dev/null; then
    pass "planning-template/scripts/release.mjs syntax is valid"
  else
    fail "planning-template/scripts/release.mjs has invalid syntax"
  fi

  if node --check "$ROOT/planning-template/scripts/update-version.mjs" >/dev/null; then
    pass "planning-template/scripts/update-version.mjs syntax is valid"
  else
    fail "planning-template/scripts/update-version.mjs has invalid syntax"
  fi

  tmpdir="$(mktemp -d)"
  mkdir -p "$tmpdir/.planning/scripts" "$tmpdir/.planning/active/001-demo/02-deepening" "$tmpdir/.planning/WORKFLOWS"
  cp "$ROOT/planning-template/scripts/planning-check.mjs" "$tmpdir/.planning/scripts/planning-check.mjs"
  cp "$ROOT/planning-template/scripts/planning-report.mjs" "$tmpdir/.planning/scripts/planning-report.mjs"
  cp "$ROOT/planning-template/scripts/planning-story.mjs" "$tmpdir/.planning/scripts/planning-story.mjs"
  cp "$ROOT/planning-template/scripts/planning-task.mjs" "$tmpdir/.planning/scripts/planning-task.mjs"
  printf '# Workflows\n\n| Workflow | Purpose |\n|----------|---------|\n| [GENERATE-DOCUMENT](02-EXECUTION-WORKFLOWS/GENERATE-DOCUMENT.md) | Generate implementation output |\n' > "$tmpdir/.planning/WORKFLOWS/README.md"
  printf 'project:\n  type: software\nexecution:\n  requires_git: false\n' > "$tmpdir/.planning/config.yml"
  printf '# Demo\n\n## Intent\nDemo\n' > "$tmpdir/.planning/active/001-demo/00-initial.md"
  printf '# Traceability\n' > "$tmpdir/.planning/active/001-demo/TRACEABILITY.md"
  printf '# Demo\n\n## Story Summary\n\n| # | Story | SDLC Phase(s) | Depends On | Risk | External Issue | Status |\n|---|---|---|---|---|---|---|\n| 01 | assessment-creation-ui | WB | - | M | - | TODO |\n\n## External Issue Mapping\n\n| Story | External Issue |\n|-------|----------------|\n| story-02 | - |\n' > "$tmpdir/.planning/active/001-demo/01-expansion.md"
  printf '# Story 01\n\n> **Status:** TODO\n\n## Objective\nDemo\n\n## Tasks\n\n| # | Task | Status | Workflow | Depends On |\n|---|---|---|---|---|\n| 01 | [Build UI](story-01-assessment-creation-ui/task-01-build-ui.md) | TODO |  | - |\n| 02 | [Review UI evidence](story-01-assessment-creation-ui/task-02-review-ui-evidence.md) | TODO |  | - |\n| 03 | [Build API endpoint](story-01-assessment-creation-ui/task-03-build-api-endpoint.md) | TODO |  | - |\n\n## Done Criteria\n\n- [ ] Demo\n\n## Area\n\nWB\n' > "$tmpdir/.planning/active/001-demo/02-deepening/story-01-assessment-creation-ui.md"
  mkdir -p "$tmpdir/.planning/active/001-demo/02-deepening/story-01-assessment-creation-ui"
  ui_task="$tmpdir/.planning/active/001-demo/02-deepening/story-01-assessment-creation-ui/task-01-build-ui.md"
  printf '# Task 01 - Build UI\n\n> **Status:** TODO\n\n## Objective\nBuild UI.\n\n## Technical Design\n- **Approach:** Build the existing assessment page UI with static fixture state before wiring real activity.\n- **Review-only:** No\n- **Affected files / components:** `web/src/pages/AssessmentPage.tsx`, `web/src/services/assessmentClient.ts`\n- **Interfaces / contracts:** Page component props plus assessment client contract.\n- **Risk:** Medium - layout may hide validation feedback on small screens.\n- **Design notes:** Keep API wiring behind the service client.\n\n## Frontend Design Plan\n- **Frontend task:** Yes\n- **Idea to implementation path:** Assessment creation intent -> form UX concept -> ASCII wireframe -> static fixture markup -> React component implementation -> build and smoke verification.\n- **View description:** User sees an assessment form with title, rubric selector, item editor, save action, loading state, empty rubric state, inline error state, and responsive single-column mobile layout.\n- **UI/UX principles:** Clear visual hierarchy, visible validation feedback, consistent form spacing, keyboard reachable controls, screen-reader labels, and disabled save while invalid.\n- **Wireframe / representation:**\n\n```text\n+-------------------------------+\n| Assessment form               |\n| Title [____________________]  |\n| Rubric [Select v]             |\n| Items [Add] [Save]            |\n| Feedback region               |\n+-------------------------------+\n```\n\n- **Functional mockup before real activity:** Render the page with local fixture state and disabled external submit before connecting the assessment client.\n- **Component pattern:** Reuse existing form field and button components; create an `AssessmentForm` container that owns local form state and emits a submit event.\n- **Page logic layer:** Page route loads fixture/default state, tracks loading/error/save states, and orchestrates submit transitions.\n- **Business logic layer:** Validation and derived disabled state live in a form model helper instead of presentation markup.\n- **External communication layer:** `assessmentClient` wraps the API call, maps errors to UI messages, and remains replaceable for tests.\n- **Reuse / modify / create decision:** Reuse shared controls, create the page container, create the service client, and modify no existing unrelated component.\n\n### Software Smoke Test Check\nRun the frontend build smoke.\n\n### Logging / Observability\nUse existing correlation trace handling where events are emitted.\n\n### Generated Test Suite\nGenerated test-suite gate is reviewed.\n\n## Implementation Steps\n- Build UI.\n\n## Verification\n- Run build smoke.\n\n## Done Criteria\n- [ ] Build smoke passes and human review is complete.\n- [ ] Correlation trace logging remains unchanged.\n- [ ] Generated test-suite quality gate reviewed.\n- [ ] Frontend Design Plan captures idea-to-code flow, UI/UX principles, mockup, layers, service/API decisions, and reuse/create choices.\n' > "$ui_task"
  review_task="$tmpdir/.planning/active/001-demo/02-deepening/story-01-assessment-creation-ui/task-02-review-ui-evidence.md"
  printf '# Task 02 - Review UI evidence\n\n> **Status:** TODO\n\n## Objective\nReview UI evidence.\n\n## Technical Design\n- **Approach:** Read-only review of existing UI evidence.\n- **Review-only:** Yes\n- **Affected files / components:** None - review only.\n- **Interfaces / contracts:** None.\n- **Risk:** Low - false conclusion if evidence is incomplete.\n- **Design notes:** Keep output in Summary Evidence.\n\n## Implementation Steps\n1. Inspect the existing UI evidence.\n2. Write Summary Evidence.\n\n## Verification\n| # | Verification | How to validate |\n|---|-------------|----------------|\n| 1 | Evidence summary exists | Read Summary Evidence |\n\n### Software Smoke Test Check\nReview-only smoke gate is manual.\n\n### Logging / Observability\nCorrelation trace logging is unchanged; review confirms no code changed.\n\n### Generated Test Suite\nGenerated test-suite quality gate reviewed; no executable code added.\n\n## Summary Evidence\n- **Reviewed scope:** Story UI evidence and task notes.\n- **Evidence artifact:** Inline Markdown summary in this task.\n- **Conclusion:** Accepted for smoke fixture.\n- **Code snippets:**\n\n```ts\nconst reviewed = true;\n```\n\n## Done Criteria\n- [ ] Build smoke passes or is documented as review-only N/A, and human review is complete.\n- [ ] Correlation trace logging remains unchanged.\n- [ ] Generated test-suite quality gate reviewed.\n' > "$review_task"
  api_task="$tmpdir/.planning/active/001-demo/02-deepening/story-01-assessment-creation-ui/task-03-build-api-endpoint.md"
  printf '# Task 03 - Build API endpoint\n\n> **Status:** TODO\n\n## Objective\nBuild API endpoint.\n\n## Technical Design\n- **Approach:** Add the assessment creation endpoint through the existing controller/use-case pattern.\n- **Review-only:** No\n- **Affected files / components:** `api/src/main/java/demo/AssessmentController.java`, `api/src/main/java/demo/CreateAssessmentHandler.java`\n- **Interfaces / contracts:** `POST /api/v1/assessments` request/response DTOs.\n- **Risk:** Medium - validation and ownership errors must map to stable response codes.\n- **Design notes:** Follow the project Java API guideline.\n\n## Backend/API Design Plan\n- **Backend/API task:** Yes\n- **Style/coding guide source:** `docs/gradeops-ai-java-guidelines/` and `.planning/WORKFLOWS/05-SDLC-PHASE-GUIDANCE/AREA-AP-api.md`.\n- **Functional design:** Authenticated teacher submits assessment data, receives accepted request id, invalid input returns validation errors, duplicate client request remains idempotent through the request key, and ownership is enforced.\n- **Technical design:** Spring MVC controller delegates to an application handler, domain rules stay in the use case, exceptions map through the existing global handler, and logs preserve correlation id.\n- **Contract definition:** `POST /api/v1/assessments` accepts `CreateAssessmentRequest`, returns `202` with `AssessmentAcceptedResponse`, returns `422` for validation failures, requires auth header, and keeps DTO field names backward compatible.\n- **Layer design:** Controller handles HTTP mapping, handler orchestrates use case, validator enforces business invariants, and mapper isolates DTO conversion.\n- **Data and persistence design:** No database or ORM changes; no schema, migration, entity, table, column, generated client, or repository changes are involved.\n- **External communication:** No external service call; auth context is read from the existing security adapter and errors map to API problem responses.\n- **Reuse / modify / create decision:** Reuse global exception handler, modify controller routing, create request/response DTOs only if missing.\n- **Guide compliance checks:** Run `./mvnw test`, project checkstyle if configured, and review changed Java files against the Java guideline checklist.\n\n### Software Smoke Test Check\nRun API build and endpoint smoke.\n\n### Logging / Observability\nCorrelation trace logging is preserved by the controller and handler.\n\n### Generated Test Suite\nGenerated test-suite gate is reviewed.\n\n## Implementation Steps\n- Build API endpoint.\n\n## Verification\n- Run API tests.\n\n## Done Criteria\n- [ ] API smoke passes and human review is complete.\n- [ ] Correlation trace logging remains unchanged.\n- [ ] Generated test-suite quality gate reviewed.\n- [ ] Backend/API Design Plan captures guide source, functional and technical design, contracts, layers, communication, and guide compliance checks.\n' > "$api_task"
  validation_output="$(cd "$tmpdir" && node .planning/scripts/planning-check.mjs validate 001-demo --format markdown 2>&1)"
  if grep -Fq "story file has no row in Story Summary" <<< "$validation_output"; then
    fail "planning-check.mjs does not derive Story Summary IDs from the numeric # column"
  else
    pass "planning-check.mjs derives Story Summary IDs from the numeric # column"
  fi
  report_output="$(cd "$tmpdir" && node .planning/scripts/planning-report.mjs report 001-demo --output markdown 2>&1)"
  if grep -Fq "| story-01 | WB |" <<< "$report_output"; then
    pass "planning-report.mjs renders area from Story Summary SDLC Phase(s)"
  else
    fail "planning-report.mjs does not render area from Story Summary SDLC Phase(s)"
  fi
  story_output="$(cd "$tmpdir" && node .planning/scripts/planning-story.mjs planning-add-story 001-demo --title 'Second UI story' --area WB --write 2>&1)"
  if grep -Fq "| 02 | second-ui-story | WB |" "$tmpdir/.planning/active/001-demo/01-expansion.md" \
    && ! awk '/^## External Issue Mapping/{flag=1} flag && /second-ui-story/{found=1} END{exit found ? 0 : 1}' "$tmpdir/.planning/active/001-demo/01-expansion.md"; then
    pass "planning-story.mjs inserts new stories inside Story Summary only"
  else
    fail "planning-story.mjs inserted a new story outside Story Summary"
    printf '%s\n' "$story_output"
  fi
  validation_output="$(cd "$tmpdir" && node .planning/scripts/planning-check.mjs validate 001-demo --format markdown 2>&1)"
  if grep -Fq "missing DB/ORM" <<< "$validation_output"; then
    fail "planning-check.mjs treats explicit no-database task notes as DB/ORM changes"
  else
    pass "planning-check.mjs ignores explicit no-database task notes for DB/ORM gates"
  fi
  cp "$review_task" "$review_task.bak"
  perl -0pi -e 's/\n## Summary Evidence\n.*?\n## Done Criteria\n/\n## Done Criteria\n/s' "$review_task"
  review_validation_output="$(cd "$tmpdir" && node .planning/scripts/planning-check.mjs validate 001-demo --format markdown 2>&1)"
  if grep -Fq "review-only task missing concrete Summary Evidence" <<< "$review_validation_output"; then
    pass "planning-check.mjs requires Summary Evidence for review-only tasks"
  else
    fail "planning-check.mjs allowed a review-only task without Summary Evidence"
    printf '%s\n' "$review_validation_output"
  fi
  mv "$review_task.bak" "$review_task"
  cp "$ui_task" "$ui_task.bak"
  perl -0pi -e 's/\n## Frontend Design Plan\n.*?\n### Software Smoke Test Check\n/\n### Software Smoke Test Check\n/s' "$ui_task"
  frontend_validation_output="$(cd "$tmpdir" && node .planning/scripts/planning-check.mjs validate 001-demo --format markdown 2>&1)"
  if grep -Fq "frontend task missing complete Frontend Design Plan" <<< "$frontend_validation_output"; then
    pass "planning-check.mjs requires Frontend Design Plan for frontend tasks"
  else
    fail "planning-check.mjs allowed a frontend task without Frontend Design Plan"
    printf '%s\n' "$frontend_validation_output"
  fi
  mv "$ui_task.bak" "$ui_task"
  cp "$api_task" "$api_task.bak"
  perl -0pi -e 's/\n## Backend\/API Design Plan\n.*?\n### Software Smoke Test Check\n/\n### Software Smoke Test Check\n/s' "$api_task"
  backend_validation_output="$(cd "$tmpdir" && node .planning/scripts/planning-check.mjs validate 001-demo --format markdown 2>&1)"
  if grep -Fq "backend/API task missing complete Backend/API Design Plan" <<< "$backend_validation_output"; then
    pass "planning-check.mjs requires Backend/API Design Plan for backend/API tasks"
  else
    fail "planning-check.mjs allowed a backend/API task without Backend/API Design Plan"
    printf '%s\n' "$backend_validation_output"
  fi
  mv "$api_task.bak" "$api_task"
  task_output="$(cd "$tmpdir" && node .planning/scripts/planning-task.mjs inspect 001-demo story-01 task-01 2>&1)"
  if grep -Fq 'task=`story-01-assessment-creation-ui--task-01-build-ui`' <<< "$task_output" \
    && ! grep -Fq 'task=`story-01-assessment-creation-ui/task-01-build-ui`' <<< "$task_output"; then
    pass "planning-task.mjs derives git-compatible sibling task branch names"
  else
    fail "planning-task.mjs derives nested task branch names that conflict with story refs"
    printf '%s\n' "$task_output"
  fi
  rm -rf "$tmpdir"
else
  warn "node not installed; skipped deterministic script syntax checks"
fi

if bash -n "$ROOT/planning-template/scripts/generate-test-suite.sh"; then
  pass "planning-template/scripts/generate-test-suite.sh syntax is valid"
else
  fail "planning-template/scripts/generate-test-suite.sh has invalid syntax"
fi

if command -v rg >/dev/null 2>&1; then
  unknown_commands="$(rg -o '`/(plan|doc|release|us|epic)-[a-z0-9-]+' "$ROOT/README.md" "$ROOT/docs/reference.md" "$ROOT/planning-template/TUTORIAL" \
    | sed 's/^.*`//' \
    | sort -u \
    | while read -r command; do
        name="${command#/}"
        if ! grep -q "name: $name$" "$ROOT/docs/commands.yml"; then
          printf '%s\n' "$command"
        fi
      done)"
  if [[ -n "$unknown_commands" ]]; then
    warn "commands referenced in public docs but absent from docs/commands.yml:"
    printf '%s\n' "$unknown_commands"
  fi
else
  warn "rg not installed; skipped public command reference scan"
fi

if [[ "$failures" -gt 0 ]]; then
  printf '\nPlugin verification failed: %d failure(s), %d warning(s)\n' "$failures" "$warnings"
  exit 1
fi

printf '\nPlugin verification passed: 0 failure(s), %d warning(s)\n' "$warnings"
