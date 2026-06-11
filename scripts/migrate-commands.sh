#!/usr/bin/env bash
# Converts .claude/commands/*.md files (legacy format) to skills/<name>/SKILL.md
# Usage: ./scripts/migrate-commands.sh path/to/source/.claude/commands/

set -euo pipefail

SOURCE_DIR="${1:-}"
SKILLS_DIR="$(cd "$(dirname "$0")/.." && pwd)/skills"

if [[ -z "$SOURCE_DIR" ]]; then
  echo "Usage: $0 path/to/source/.claude/commands/"
  exit 1
fi

if [[ ! -d "$SOURCE_DIR" ]]; then
  echo "Error: $SOURCE_DIR does not exist"
  exit 1
fi

echo "Migrating commands from: $SOURCE_DIR"
echo "Writing skills to:       $SKILLS_DIR"
echo ""

for cmd_file in "$SOURCE_DIR"/*.md; do
  [[ -f "$cmd_file" ]] || continue

  name="$(basename "$cmd_file" .md)"

  # Skip if skill already exists with content beyond the stub
  skill_file="$SKILLS_DIR/$name/SKILL.md"
  if [[ -f "$skill_file" ]] && [[ $(wc -l < "$skill_file") -gt 10 ]]; then
    echo "  SKIP  $name  (skill already exists)"
    continue
  fi

  mkdir -p "$SKILLS_DIR/$name"

  # Read the first non-empty line as description
  description=$(grep -m1 '.' "$cmd_file" | head -c 200)

  # Read the argument-hint from ## Arguments section if present
  arg_hint=$(grep -A2 '## Arguments' "$cmd_file" 2>/dev/null \
    | grep -oP '`\$ARGUMENTS`.*?—.*' | head -1 \
    | sed 's/`\$ARGUMENTS`[^—]*—[[:space:]]*//' \
    | head -c 100 || echo "")

  # Determine relevant allowed-tools based on content
  tools="[Read, Write, Bash, Glob]"
  if grep -qi 'WebFetch\|WebSearch\|web' "$cmd_file" 2>/dev/null; then
    tools="[Read, Write, Bash, Glob, WebFetch]"
  fi

  # Write SKILL.md with frontmatter + original content
  {
    echo "---"
    echo "name: $name"
    echo "description: $description"
    if [[ -n "$arg_hint" ]]; then
      echo "argument-hint: $arg_hint"
    fi
    echo "allowed-tools: $tools"
    echo "---"
    echo ""
    cat "$cmd_file"
  } > "$skill_file"

  echo "  OK    $name  →  skills/$name/SKILL.md"
done

echo ""
echo "Migration complete. Review each SKILL.md and adjust:"
echo "  - description: should be a clear trigger condition (for model-invoked)"
echo "    or a short /help description (for user-invoked slash commands)"
echo "  - argument-hint: shown to the user, e.g. '<NNN-slug> -- <intent>'"
echo "  - allowed-tools: trim to only what the skill actually needs"
