#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
fail() { printf 'FAIL: %s\n' "$1" >&2; exit 1; }
pass() { printf 'PASS: %s\n' "$1"; }

command -v node >/dev/null 2>&1 || fail "Node.js 20+ is required"
node -e 'if (Number(process.versions.node.split(".")[0]) < 20) process.exit(1)' || fail "Node.js 20+ is required"

(cd "$ROOT" && node hooks/tests/protect-planning-state.test.mjs)
(cd "$ROOT" && node spikes/tests/verify-corte-1.2.test.mjs)
(cd "$ROOT" && node scripts/tests/verify-next-generation.test.mjs)
(cd "$ROOT" && node spikes/verify-corte-1.2.mjs --structure-only)

for required in hooks/hooks.json package.json scripts/protect-planning-state-hook.sh scripts/protect-planning-state.mjs; do
  [[ -f "$ROOT/$required" ]] || fail "$required is missing"
done
[[ -x "$ROOT/scripts/protect-planning-state-hook.sh" ]] || fail "planning hook wrapper is not executable"

manifest_count="$(find "$ROOT/spikes" -mindepth 2 -maxdepth 2 -name spike.json | wc -l | tr -d ' ')"
[[ "$manifest_count" == 6 ]] || fail "six spike manifests are required"
if rg -n 'decision_record|PARTIALLY_APPLIED|OP-01J|01J-|RI0004|/<acronym>-init|/arc-init' "$ROOT/docs/plugin-redesign-release-flow"; then
  fail "legacy identity, state or namespace drift detected"
fi
if rg -n 'item[[:space:]]+move|change parent_id' "$ROOT/docs/plugin-redesign-release-flow"; then
  fail "mutable parent operation detected"
fi
if rg -n 'bash scripts/verify-plugin\.sh' "$ROOT/docs/plugin-redesign-release-flow/01-arquitectura-objetivo.md" "$ROOT/docs/plugin-redesign-release-flow/02-mapa-comandos-skills.md" "$ROOT/docs/plugin-redesign-release-flow/03-plan-incremental.md" "$ROOT/docs/plugin-redesign-release-flow/07-estructura-plugin-v4.md" "$ROOT/docs/plugin-redesign-release-flow/08-corte-1-1-contratos-runtime.md" "$ROOT/docs/plugin-redesign-release-flow/09-corte-1-2-spikes-producto-runtime.md" "$ROOT/docs/plugin-redesign-release-flow/10-corte-1-2-contratos-ejecucion.md"; then
  fail "next-generation documentation still uses the v3 verifier"
fi

node -e 'const p=require("./package.json"); if (!p.engines || p.engines.node !== ">=20") process.exit(1)' --input-type=commonjs --no-warnings 2>/dev/null || fail "package.json must require Node >=20"
for manifest in "$ROOT"/spikes/*/spike.json; do
  node -e 'const fs=require("fs"); const m=JSON.parse(fs.readFileSync(process.argv[1],"utf8")); if ("decision_record" in m || ![...(m.pass_criteria||[]), ...(m.fail_criteria||[])].every(c => ["PENDING","PASSED","FAILED","NOT_APPLICABLE"].includes(c.status))) process.exit(1)' "$manifest" || fail "invalid spike criteria in $manifest"
done
pass "next-generation contract verification passed"
