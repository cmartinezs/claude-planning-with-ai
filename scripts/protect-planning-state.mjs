#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BLOCK_MESSAGE = "Direct writes to .planning/** are prohibited.\nUse <product-cli> to produce and apply a ChangeSet.";
const defaultContext = {
  workspaceRoot: path.resolve(process.env.CLAUDE_PROJECT_DIR || process.cwd()),
  approvedLauncher: process.env.PRODUCT_CLI_NAME || "<product-cli>"
};

function deny(reason = BLOCK_MESSAGE) {
  return {
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: reason
    }
  };
}

function nearestExisting(target) {
  let candidate = path.resolve(target);
  while (!fs.existsSync(candidate)) {
    const parent = path.dirname(candidate);
    if (parent === candidate) return candidate;
    candidate = parent;
  }
  return candidate;
}

function realPath(target) {
  return fs.realpathSync.native(nearestExisting(target));
}

function isWithin(target, root) {
  const relative = path.relative(root, target);
  return relative === "" || (relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative));
}

function touchesPlanning(target, context) {
  const planningRoot = path.join(context.workspaceRoot, ".planning");
  const absoluteTarget = path.resolve(context.workspaceRoot, target);
  const realPlanning = realPath(planningRoot);
  return isWithin(absoluteTarget, planningRoot) || isWithin(realPath(absoluteTarget), realPlanning);
}

function inputPath(toolInput) {
  return toolInput?.file_path || toolInput?.path || toolInput?.target_file || null;
}

function hasPlanningToken(command) {
  return /(?:^|[\s"'=(:,;&|])(?:\.\.?[\\/])*\.planning(?:[\\/\s"'=:,;&|)]|$)/i.test(command)
    || /[\\/]\.planning(?:[\\/]|$)/i.test(command);
}

function invokesApprovedLauncher(command, context) {
  const pluginRoot = process.env.CLAUDE_PLUGIN_ROOT;
  const launcherPath = pluginRoot ? path.join(pluginRoot, "bin", context.approvedLauncher) : null;
  return command.split(/[\s;&|()]+/).some((token) => {
    const normalized = token.replace(/^['"]|['"]$/g, "");
    return normalized === context.approvedLauncher
      || (launcherPath && path.resolve(normalized) === path.resolve(launcherPath));
  });
}

function containsWriteOperation(command) {
  return /(?:^|[\s;&|])(?:>|>>|tee|cp|mv|rm|install|mkdir|touch)(?:[\s;&|]|$)/i.test(command)
    || /(?:sed|perl)\s+-[^\n]*i(?:\s|$)/i.test(command)
    || /(?:python|python3|node|deno|ruby|php|npm|npx)\b/i.test(command)
    || /(?:^|[\s;&|])(?:bash|sh|zsh|fish)\b/i.test(command);
}

export function evaluate(payload, context = defaultContext) {
  const toolName = payload?.tool_name;
  const toolInput = payload?.tool_input || {};

  if (toolName === "Write" || toolName === "Edit") {
    const target = inputPath(toolInput);
    return target && touchesPlanning(target, context) ? deny() : null;
  }

  if (toolName === "Bash") {
    const command = String(toolInput.command || "");
    if (hasPlanningToken(command) && !invokesApprovedLauncher(command, context) && containsWriteOperation(command)) return deny();
  }
  return null;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  let input = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk) => { input += chunk; });
  process.stdin.on("end", () => {
    try {
      const result = evaluate(JSON.parse(input));
      if (result) process.stdout.write(JSON.stringify(result));
    } catch (error) {
      process.stdout.write(JSON.stringify(deny(`Unable to evaluate planning-state protection: ${error.message}`)));
    }
  });
}
