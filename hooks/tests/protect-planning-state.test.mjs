import assert from "node:assert/strict";
import { mkdtemp, mkdir, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { evaluate } from "../../scripts/protect-planning-state.mjs";

const root = await mkdtemp(path.join(os.tmpdir(), "planning-hook-test-"));
await mkdir(path.join(root, ".planning"));
await writeFile(path.join(root, "outside.txt"), "ok");
await symlink(path.join(root, ".planning"), path.join(root, "planning-link"));

function run(toolName, toolInput) {
  return evaluate({ tool_name: toolName, tool_input: toolInput }, {
    workspaceRoot: root,
    approvedLauncher: "product-cli"
  });
}

const denied = (result) => result?.hookSpecificOutput?.permissionDecision === "deny";

assert.equal(denied(run("Write", { file_path: ".planning/config.yml" })), true, "write-direct-file");
assert.equal(denied(run("Edit", { file_path: path.join(root, ".planning/config.yml") })), true, "edit-direct-file");
assert.equal(denied(run("Bash", { command: "echo x > .planning/config.yml" })), true, "bash-redirect");
assert.equal(denied(run("Bash", { command: "echo x | tee .planning/config.yml" })), true, "bash-tee");
assert.equal(denied(run("Bash", { command: "cp source .planning/config.yml" })), true, "bash-cp");
assert.equal(denied(run("Bash", { command: "mv source .planning/config.yml" })), true, "bash-mv");
assert.equal(denied(run("Bash", { command: "rm .planning/config.yml" })), true, "bash-rm");
assert.equal(denied(run("Write", { file_path: "planning-link/config.yml" })), true, "symlink-escape");
assert.equal(denied(run("Bash", { command: "product-cli changeset apply .planning/config.yml" })), false, "launcher-allowed");
assert.equal(denied(run("Bash", { command: "cat .planning/config.yml" })), false, "read-allowed");

console.log("protect-planning-state: 10 tests passed");
