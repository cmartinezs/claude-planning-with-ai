---
name: plan-task
description: Execute one atomic planning task by using the shared planning-task stage script for deterministic inspection, git setup, status updates, publish/PR automation, correction commits, and closeout while keeping implementation, verification judgment, and human review in the skill.
argument-hint: <NNN-slug> <story-NN> <task-NN>
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
---

Execute exactly one atomic task end to end. Use the shared script for repeatable stages and keep contextual implementation, verification judgment, and human review in this skill.

## Arguments

`$ARGUMENTS` — format: `NNN-slug story-NN task-NN`.

## Stage Contract

The first script argument is always the stage:

```bash
node .planning/scripts/planning-task.mjs inspect <planning-id> <story-id> <task-id>
node .planning/scripts/planning-task.mjs readiness <planning-id> <story-id> <task-id>
node .planning/scripts/planning-task.mjs git-setup <planning-id> <story-id> <task-id> [--execute]
node .planning/scripts/planning-task.mjs start <planning-id> <story-id> <task-id> [--write]
node .planning/scripts/planning-task.mjs publish <planning-id> <story-id> <task-id> [--file <path>] [--execute]
node .planning/scripts/planning-task.mjs correction <planning-id> <story-id> <task-id> [--file <path>] [--execute]
node .planning/scripts/planning-task.mjs closeout <planning-id> <story-id> <task-id> [--write]
```

`git-setup`, `publish`, and `correction` only run git/gh commands with `--execute`. `start` and `closeout` only mutate planning markdown with `--write`.

## Steps

1. Before starting a new task implementation, compact the Claude session with `/compact`. If this turn is already the resumed context for this exact task after compaction, continue. Do not replace this with `/clear`; `/clear` is reserved for starting a new story.
2. Parse `$ARGUMENTS`.
3. Verify `.planning/scripts/planning-task.mjs` exists. If missing, stop and ask the user to update the planning template with `/plan-update-version` or `/plan-init --force`.
4. Run inspection and readiness:
   ```bash
   node .planning/scripts/planning-task.mjs inspect <planning-id> <story-id> <task-id>
   node .planning/scripts/planning-task.mjs readiness <planning-id> <story-id> <task-id>
   ```
   Stop on blockers. Resolve warnings that are required by project policy, especially missing test suite, logging policy, affected-files allowlist, or dependency status.
5. If `execution.requires_git` is true, run git setup as a plan first:
   ```bash
   node .planning/scripts/planning-task.mjs git-setup <planning-id> <story-id> <task-id>
   ```
   Confirm the commands and touched branch names, then rerun with `--execute`. If git is disabled, skip this stage.
6. Mark execution started:
   ```bash
   node .planning/scripts/planning-task.mjs start <planning-id> <story-id> <task-id> --write
   ```
7. Implement the task from the task file's Objective, Technical Design, Frontend Design Plan, Backend/API Design Plan, Implementation Steps, Verification, and Done Criteria. For frontend/UI tasks (`Frontend task: Yes`, WB area, or equivalent wording), execute the full design-to-code path before real integration: confirm the view description and UI/UX principles, create or update the wireframe/representation, build the functional mockup with local/static state first, then implement components according to the documented pattern, page logic, business logic, external communication/services/APIs/libs, and reuse/modify/create decisions. For backend/API tasks (`Backend/API task: Yes`, AP area, or equivalent wording), first verify `Style/coding guide source` points to existing project guidance or to an already completed prerequisite guide task; if it does not, stop and ask the user for the guide or create/execute the prerequisite guide task before implementation. Then implement according to the documented functional design, technical design, contracts, layer boundaries, data/persistence design, external communication/services/APIs/libs, reuse/modify/create decisions, and guide compliance checks for the backend language/framework. For code tasks, use the configured logging mechanism and preserve correlation/trace behavior. For DB/ORM tasks, include static schema-to-model consistency and local runtime persistence smoke evidence. For review-only tasks (`Review-only: Yes`, `review-only`, or equivalent wording), do not treat chat as the durable output: fill `## Summary Evidence` in the task file with reviewed scope, inspected evidence, conclusion, and follow-up. If the review needs more detail, create or update a longer artifact and link it from `## Summary Evidence`; use `.md` for prose, and fenced snippets with language labels such as ` ```ts `, ` ```java `, or ` ```sql ` when code is the evidence.
8. Run the generated task test suite gates, smoke plan, and any task-specific verification. For every applicable generated, detected, or manually supplied test gate, leave durable evidence in the task file or a linked Markdown artifact. Evidence must include the test type (`unit`, `integration`, `acceptance`, `e2e`, `smoke`, `static-analysis`, `style`, `architecture`, `security`, `mutation`, or manual verification), exact command, parameters or profiles, environment, relevant configuration and scripts, output log or CI/report link, result, and why any generated-suite gate was skipped as non-applicable. If the user ran tests manually, inspect or request the same evidence fields before treating the test as proof.
9. Run contract/traceability checks that require judgment: agnostic boundary, glossary/traceability updates, and any PDR-worthy accepted cross-cutting decision.
10. Publish implementation for review:
   ```bash
   node .planning/scripts/planning-task.mjs publish <planning-id> <story-id> <task-id>
   ```
   Review the staging allowlist. Add `--file <path>` for approved extra files only. After approval, rerun with `--execute`. Do not use `git add -A` or `git add .`.
11. Ask for human developer PR review. If corrections are requested, implement them, rerun verification, and publish the correction on the same task branch:
    ```bash
    node .planning/scripts/planning-task.mjs correction <planning-id> <story-id> <task-id> --file <path> --execute
    ```
    Repeat until the human review is approved.
12. After approval, mark task closeout:
    ```bash
    node .planning/scripts/planning-task.mjs closeout <planning-id> <story-id> <task-id> --write
    ```
13. Invoke `/doc-task <planning-id> <story-id> <task-id>`. If git is enabled, publish the closeout metadata with the same `publish` stage or a focused manual commit using only the task/story/doc files.
14. Report implementation summary, verification evidence, Summary Evidence artifacts for review-only tasks, task branch, PR target, closeout status, docs written, and next task. Remind the user to merge the task PR into the story branch and delete the local task branch with `git branch -d` after merge.

The script owns deterministic parsing, branch derivation, git/gh command generation or execution, staging allowlists, commit message derivation, task/story status updates, and closeout checkbox updates. This skill owns implementation, design corrections, test/smoke judgment, human review, and semantic workflow decisions.
