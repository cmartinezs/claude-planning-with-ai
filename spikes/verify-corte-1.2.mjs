#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const requiredSpikes = [
  "host-integration",
  "runtime-node20",
  "canonical-core",
  "worktree-merge",
  "transaction-recovery",
  "integrated-prototype"
];
const allowedStates = new Set([
  "PLANNED",
  "IN_PROGRESS",
  "PASSED",
  "FAILED",
  "INCONCLUSIVE",
  "DECISION_ACCEPTED_WITH_LIMITATIONS"
]);
const structureOnly = process.argv.includes("--structure-only");
const errors = [];

function addError(message) {
  errors.push(message);
}

function hasValue(value) {
  return value !== null && value !== undefined && value !== "";
}

for (const spikeId of requiredSpikes) {
  const spikeRoot = path.join(root, spikeId);
  const manifestPath = path.join(spikeRoot, "spike.json");

  try {
    const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
    if (manifest.id !== spikeId) addError(`${spikeId}: id must match directory`);
    if (!allowedStates.has(manifest.status)) addError(`${spikeId}: invalid status`);
    if (typeof manifest.critical !== "boolean") addError(`${spikeId}: critical is required`);
    if (typeof manifest.waivable !== "boolean") addError(`${spikeId}: waivable is required`);
    for (const field of ["hypothesis", "scope", "non_goals", "timebox", "prototype_location", "reusable_or_disposable", "inputs", "fault_model", "decision_record"]) {
      if (!(field in manifest)) addError(`${spikeId}: ${field} is required`);
    }
    if (!Array.isArray(manifest.pass_criteria) || manifest.pass_criteria.length === 0) addError(`${spikeId}: pass_criteria required`);
    if (!Array.isArray(manifest.fail_criteria) || manifest.fail_criteria.length === 0) addError(`${spikeId}: fail_criteria required`);

    for (const criterion of [...(manifest.pass_criteria || []), ...(manifest.fail_criteria || [])]) {
      if (!hasValue(criterion.id) || !hasValue(criterion.severity) || typeof criterion.waivable !== "boolean") {
        addError(`${spikeId}: every criterion requires id, severity and waivable`);
      }
      if (criterion.severity === "critical" && criterion.waivable === false && manifest.status === "DECISION_ACCEPTED_WITH_LIMITATIONS") {
        addError(`${spikeId}: critical non-waivable criterion cannot be accepted with limitations`);
      }
    }

    for (const field of ["evidence", "fixtures", "tests"]) {
      if (!Array.isArray(manifest[field])) addError(`${spikeId}: ${field} must be an array`);
    }
    for (const field of ["adr", "decision", "result"]) {
      if (!(field in manifest)) addError(`${spikeId}: ${field} is required`);
    }

    if (!structureOnly && !["PASSED", "DECISION_ACCEPTED_WITH_LIMITATIONS"].includes(manifest.status)) {
      addError(`${spikeId}: status ${manifest.status} does not close the spike`);
    }
    if (!structureOnly && manifest.status === "DECISION_ACCEPTED_WITH_LIMITATIONS") {
      if (!hasValue(manifest.adr) || !hasValue(manifest.decision) || !hasValue(manifest.result)) {
        addError(`${spikeId}: limited acceptance requires ADR, decision and result`);
      }
    }
  } catch (error) {
    addError(`${spikeId}: ${error.code === "ENOENT" ? "spike.json is missing" : error.message}`);
  }
}

if (errors.length > 0) {
  console.error(`Corte -1.2 verification failed (${errors.length} issue(s))`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(structureOnly ? "Corte -1.2 structure verification passed" : "Corte -1.2 verification passed");
}
