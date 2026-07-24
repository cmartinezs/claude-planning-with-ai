import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(".");
const gate = fs.readFileSync(path.join(root, "scripts/verify-next-generation.sh"), "utf8");
const forbiddenCases = [
  ["legacy-state-detected", "PARTIALLY_APPLIED"],
  ["ulid-example-detected", "OP-01J"],
  ["hybrid-path-detected", "RI0004"],
  ["move-stage-detected", "item move"],
  ["fallback-namespace-detected", "/arc-init"],
  ["node-version-invalid", "Node.js 20+ is required"]
];
for (const [name, sample] of forbiddenCases) {
  if (name === "move-stage-detected") assert.match(gate, /item\[\[:space:\]\]\+move/);
  else assert.match(gate, new RegExp(sample.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), name);
}

assert.match(gate, /node hooks\/tests\/protect-planning-state\.test\.mjs/);
assert.match(gate, /node spikes\/verify-corte-1\.2\.mjs --structure-only/);
console.log("next-generation verifier tests: 6 passed");
