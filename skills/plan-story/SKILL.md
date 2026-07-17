---
name: plan-story
description: Orchestrate an atomized story: inspect deterministic state with the shared helper, ensure the story integration branch, run the next eligible task through /plan-task, and finalize only after task PRs are merged.
argument-hint: <NNN-slug> <story-NN>  (e.g. 001-user-auth-api story-01)
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
---

Orchestrate an atomized story. A story branch is the integration branch for the story. Each task runs in its own branch and opens a PR into the story branch. Task PRs are merged into the story branch incrementally. Only after all tasks are done and merged does the story branch open the final PR into `git.base_branch`.

`/plan-story` is optional orchestration. `/plan-task` must also be able to create or reuse the story branch when a user starts directly from a task.

Reference workflows:
- `.planning/WORKFLOWS/02-EXECUTION-WORKFLOWS/GENERATE-DOCUMENT.md`
- `.planning/WORKFLOWS/04-SUB-WORKFLOWS/EXECUTE-STORY.md`
- `.planning/WORKFLOWS/04-SUB-WORKFLOWS/CHECK-PHASE-CONTEXT.md`
- `.planning/WORKFLOWS/04-SUB-WORKFLOWS/CHECK-AGNOSTIC-BOUNDARY.md`
- `.planning/WORKFLOWS/03-MAINTENANCE-WORKFLOWS/RECORD-EDGE-CASE.md`

## Arguments

`$ARGUMENTS` — format: `NNN-slug story-NN` (e.g. `001-user-auth-api story-01`)

## Deterministic helper

Use only the current directory's `./.planning/`. Do not search parent directories.

Use the shared script for mechanical story inspection and state updates:

```bash
node .planning/scripts/planning-story.mjs execute-inspect <planning-id> <story-NN> --format markdown
node .planning/scripts/planning-story.mjs execute-start <planning-id> <story-NN> --write
node .planning/scripts/planning-story.mjs execute-done <planning-id> <story-NN> --write
node .planning/scripts/planning-story.mjs execute-finalize <planning-id> <story-NN> --format markdown
```

For a child planning running in a dedicated sibling worktree, pass the worktree prefix explicitly when the current branch does not already include it:

```bash
node .planning/scripts/planning-story.mjs execute-inspect <planning-id> <story-NN> --worktree-prefix <worktree-prefix>
```

The helper must own deterministic work only:
- locate the story file under `.planning/active/<planning-id>/02-deepening/`;
- verify task table rows have matching `task-NN-*.md` files;
- derive the story branch, preserving a worktree prefix when supplied or already present;
- report the first dependency-eligible task;
- report completed task branches that should be deleted locally after task PR merge;
- render done criteria, task verification summaries, and final git/PR command plans;
- update story status in the story file and `01-expansion.md` only when called with `--write`.

The skill still owns human judgment:
- read required workflow/docs context;
- execute `[CHECK-PHASE-CONTEXT]` and `[CHECK-STORY-CONTEXT]`;
- decide whether `gh`/git evidence proves task PRs are merged;
- invoke `/plan-task`;
- evaluate story done evidence and smoke-test freshness;
- request final human developer review before marking the story `DONE`;
- execute `[RECORD-EDGE-CASE]` for blockers, corrections, conflicts, or manual PR gaps.

## Steps

### 0 — Reset session for a new story

Before starting a new story execution, clear the Claude session with `/clear`, then rerun `/plan-story <planning-id> <story-NN>` from the project root. If this invocation is already the resumed context after `/clear` for this exact story, continue. Do not require another `/clear` when rerunning `/plan-story` to continue the same story after a task PR merge or review checkpoint.

### 1 — Inspect story

1. Parse `$ARGUMENTS` to extract planning id and story id.
2. Run:
   ```bash
   node .planning/scripts/planning-story.mjs execute-inspect <planning-id> <story-NN> --format markdown
   ```
   If this is a child planning worktree and the reported story branch lacks the expected `<worktree-prefix>/`, rerun with `--worktree-prefix <worktree-prefix>`.
3. If the helper reports the story is missing, no local `.planning/` exists, or task files are missing, stop. For missing task files, report: "Run `/plan-atomize <planning-id> <story-id>` first. `/plan-story` does not generate task files during execution."
4. Execute `[CHECK-PHASE-CONTEXT]` for the story's area. If it returns `MISSING`, stop and list the `docs/` files that must be read first.

### 2 — Ensure story branch

5. If `execution.requires_git` is `false`, skip branch setup and continue to task orchestration.
6. Execute `[CHECK-STORY-CONTEXT]`.
   - If **ABORT**: stop immediately; report that the user chose to stay on the current story/task branch.
   - If **STASHED**, **COMMITTED**, **COMMITTED_PUSHED**, **STANDBY**, or **OK**: continue.
7. Validate git state before creating or updating branches:
   ```bash
   git status --porcelain
   ```
   If there are uncommitted changes, stop and ask the user to commit, stash, or discard them before starting this story. Do not create branches from a dirty worktree.
8. Ensure the story integration branch exists and is up to date using the branch reported by the helper:
   ```bash
   git fetch origin
   ```
   - If `<story-branch>` exists locally: `git checkout <story-branch>` then `git pull --ff-only origin <story-branch>`.
   - If it exists only on `origin`: `git checkout -b <story-branch> origin/<story-branch>` then `git pull --ff-only origin <story-branch>`.
   - If it does not exist locally or on `origin`: checkout `git.base_branch`, pull it, create `<story-branch>`, and push it.

### 3 — Run next task or finalize

9. If the story status is `TODO`, run:
   ```bash
   node .planning/scripts/planning-story.mjs execute-start <planning-id> <story-NN> --write
   ```
10. Verify task PR integration before choosing the next task:
    - If `gh` is available, check for open task PRs targeting the story branch:
      ```bash
      gh pr list --base <story-branch> --state open
      ```
      If any task PR is open, stop and list it. The next task must not start until the previous task PR is reviewed and merged into `<story-branch>`.
    - If `gh` is unavailable and any prior task is `DONE`, ask the user to confirm that all completed task PRs have been reviewed and merged into `<story-branch>`.
    - After task PRs are confirmed merged, delete corresponding local task branches reported by the helper:
      ```bash
      git checkout <story-branch>
      git pull --ff-only origin <story-branch>
      git branch -d <task-branch>
      ```
      Use `git branch -d` only. If deletion fails because Git does not recognize the branch as merged, stop and report the branch name so the user can confirm whether the PR was actually merged. Do not delete remote task branches here.
11. Rerun `execute-inspect`.
12. If the helper reports a next task, invoke:
    ```bash
    /plan-task <planning-id> <story-id> <task-id>
    ```
    `/plan-task` must compact the session with `/compact` before starting the new task implementation; after compaction, continue with the same task command.
    Then stop. Report that the task PR must be merged into `<story-branch>` and its local task branch deleted before rerunning `/plan-story`.
13. If the helper reports pending tasks blocked by dependencies, stop and list the blocked tasks.
14. If no pending tasks exist, continue to story closure.

### 4 — Close story

15. Execute `[EXECUTE-STORY]` to verify done criteria are met.
    - If `BLOCKED`: execute `[RECORD-EDGE-CASE]` with the unmet criteria and stop.
    - If `DONE`: run `execute-finalize` and present the helper's closeout report plus any fresh story-level smoke-test evidence needed for software projects.
16. Before setting the status or pushing/opening a PR, present:
    - the full `## Done Criteria` section;
    - all task verification summaries;
    - for software projects, smoke-test evidence from the final task run or a fresh story-level run if the task evidence is stale;
    - test evidence metadata for every applicable generated, detected, or manual gate: type, command, parameters, environment, configuration/scripts, output log or CI/report link, and result;
    - the commits that will be pushed.

    Then ask explicitly:

    > "All tasks are complete. Please perform the final human developer code review for this story. Reply with **approved** to mark the story DONE, push the branch, and create the PR, or list the requested corrections."

    Wait for approval before setting story status to `DONE`.
17. If the reviewer requests corrections:
    - execute `[RECORD-EDGE-CASE]` with the requested corrections and the affected story;
    - implement the corrections;
    - rerun relevant task/story verification and refresh the evidence metadata for each impacted gate;
    - for software projects, rerun the smoke test plan when code, build, dependencies, migrations, startup, or configuration changed;
    - present the updated review summary again;
    - wait for a new human review.
18. After approval, run:
    ```bash
    node .planning/scripts/planning-story.mjs execute-done <planning-id> <story-NN> --write
    ```
19. Invoke `/doc-story <planning-id> <story-id>`. If the story area is DO or W this is a silent no-op. Include any files written in the final report.

### 5 — Git finalize

20. If `execution.requires_git` is `false`, skip Git finalize and report that branch, push, PR creation, and branch cleanup were disabled by `.planning/config.yml`.
21. Sync the story branch with the base branch before opening the story PR:
    ```bash
    git fetch origin
    git checkout <story-branch>
    git pull --ff-only origin <story-branch>
    git rebase origin/<base_branch>
    ```
    If the rebase has conflicts: execute `[RECORD-EDGE-CASE]` with the conflicting files, stop, list the conflicts, and ask the user to resolve them before continuing.
22. Push the story branch:
    ```bash
    git push -u origin <story-branch>
    ```
23. Open or reuse a pull request targeting `<base_branch>`:
    ```bash
    gh pr create \
      --title "<story-NN>: <story-name>" \
      --body "Closes story <story-id> of planning <planning-id>." \
      --base <base_branch> \
      --head <story-branch>
    ```
    If a story PR for `<story-branch>` already exists, reuse it instead of creating a duplicate. If `gh` shows that the existing story PR is already merged into `<base_branch>`, continue to local story branch cleanup. If `gh` is not available, execute `[RECORD-EDGE-CASE]` noting that PR creation or PR-state verification had to be completed manually, then print the push URL and instruct the user to open or verify the PR manually.
24. Handle story branch local cleanup:
    - If the story PR is already merged into `<base_branch>` or the user confirms it was merged manually, delete the local story branch now:
      ```bash
      git checkout <base_branch>
      git pull --ff-only origin <base_branch>
      git branch -d <story-branch>
      ```
    - If the story PR is still open, do not delete the branch yet. Report that after the PR is merged into `<base_branch>`, the local story branch must be deleted with the same commands.
    Use `git branch -d`, not a forced delete. Remote branch deletion remains a repository/PR policy action.
25. Report: story completed, N tasks done, all task PRs merged into `<story-branch>`, local task branches cleaned, done criteria satisfied, doc files written, branch `<story-branch>` pushed, story PR URL when git is enabled, and story branch local cleanup status.

> To find the next story, use `/plan-status`, then run `/plan-story <planning-id> <next-story-id>`.
> To decompose a story into atomic task files before executing it, use `/plan-atomize <planning-id> <story-id>`. To execute a single atomic task, use `/plan-task`.
