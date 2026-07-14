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
require_file "planning-template/scripts/generate-test-suite.sh"
require_file "planning-template/scripts/planning-check.mjs"
require_dir "skills"
require_dir "planning-template/WORKFLOWS"

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

if command -v node >/dev/null 2>&1; then
  if node --check "$ROOT/planning-template/scripts/planning-check.mjs" >/dev/null; then
    pass "planning-template/scripts/planning-check.mjs syntax is valid"
  else
    fail "planning-template/scripts/planning-check.mjs has invalid syntax"
  fi
else
  warn "node not installed; skipped planning-check.mjs syntax check"
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
