---
name: plan-story
description: Orchestrate an atomized story: ensure the story integration branch, run the next eligible task through /plan-task, and finalize the story only after task PRs are merged.
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

## Steps

### 1 — Locate story and config

1. Parse `$ARGUMENTS` to extract planning id and story id.
2. Read `.planning/config.yml` and extract `git.base_branch` (default: `main` if file or key is absent), `project.type` (default: `software`), `execution.requires_git` (default: `true`), and `software.smoke_tests_file` (default: `SMOKE-TESTS.md`).
3. Read `.planning/active/<planning-id>/02-deepening/<story-id>-*.md`. If it doesn't exist, stop and report.
4. Derive the story integration branch name from the story filename: `story-NN-<slug>.md` → `story-NN-<slug>`.
   - If this is a child planning running in a dedicated sibling worktree, derive `<worktree-prefix>` from the worktree directory name and prefix the branch: `<worktree-prefix>/story-NN-<slug>`.
   - Preserve an existing worktree prefix if the branch already has one. The prefix must appear before the rest of the branch name.
5. Verify the story is atomized: a folder `02-deepening/<story-id>-*/` exists and contains `task-NN-*.md` files.
   - If not atomized, stop and report: "Run `/plan-atomize <planning-id> <story-id>` first. `/plan-story` does not generate task files during execution."
   - For each row in the `## Tasks` table, verify that its linked `task-NN-*.md` file exists under the story subfolder. If any file is missing, stop and suggest `/plan-task-validate <planning-id> <story-id>` or rerun `/plan-atomize` after fixing the story.
6. Execute `[CHECK-PHASE-CONTEXT]` for the story's area — verify required `docs/` contracts exist and have been read.
   - If `MISSING`: stop and list which `docs/` files must be read first.

### 2 — Ensure story branch

7. If `execution.requires_git` is `false`, skip branch setup and continue to task orchestration.
8. Execute `[CHECK-STORY-CONTEXT]`.
   - If **ABORT**: stop immediately; report that the user chose to stay on the current story/task branch.
   - If **STASHED**, **COMMITTED**, **COMMITTED_PUSHED**, **STANDBY**, or **OK**: continue.
9. Validate git state before creating or updating branches:
   ```bash
   git status --porcelain
   ```
   If there are uncommitted changes, stop and ask the user to commit, stash, or discard them before starting this story. Do not create branches from a dirty worktree.
10. Ensure the story integration branch exists and is up to date:
   ```bash
   git fetch origin
   ```
   - If `<story-branch>` exists locally: `git checkout <story-branch>` then `git pull --ff-only origin <story-branch>`.
   - If it exists only on `origin`: `git checkout -b <story-branch> origin/<story-branch>` then `git pull --ff-only origin <story-branch>`.
   - If it does not exist locally or on `origin`: checkout `git.base_branch`, pull it, create `<story-branch>`, and push it.

### 3 — Run next task or finalize

11. Set story status to `IN PROGRESS` in the story file if it is currently `TODO`.
12. Verify task PR integration before choosing the next task:
   - If `gh` is available, check for open task PRs targeting the story branch:
     ```bash
     gh pr list --base <story-branch> --state open
     ```
     If any task PR is open, stop and list it. The next task must not start until the previous task PR is reviewed and merged into `<story-branch>`.
   - If `gh` is unavailable and any prior task is `DONE`, ask the user to confirm that all completed task PRs have been reviewed and merged into `<story-branch>`.
   - After task PRs are confirmed merged, delete the corresponding local task branches before starting the next task:
     ```bash
     git checkout <story-branch>
     git pull --ff-only origin <story-branch>
     git branch -d <task-branch>
     ```
     Apply this to each local branch that matches a completed task for this story, for example `<story-branch>/task-NN-<slug>` or `<worktree-prefix>/story-NN-<slug>/task-NN-<slug>` for child worktrees. If a task branch does not exist locally, skip it. Use `git branch -d` only; do not force-delete. If a local task branch exists but cannot be deleted because Git does not recognize it as merged, stop and report the branch name so the user can confirm whether the PR was actually merged. Do not delete remote task branches here; that remains a PR/repository policy action.
13. Find the first task whose status is not `DONE` and whose `Depends On` tasks are all `DONE`.
   - If found: invoke `/plan-task <planning-id> <story-id> <task-id>`, then stop. Report that the task PR must be merged into `<story-branch>` and its local task branch deleted before rerunning `/plan-story` for the next task.
   - If pending tasks exist but dependencies are not `DONE`, stop and list the blocked tasks.
   - If no pending tasks exist, continue to story closure.

14. Execute `[EXECUTE-STORY]` to verify done criteria are met.
   - If `BLOCKED`: execute `[RECORD-EDGE-CASE]` with the unmet criteria and stop.
   - If `DONE`: before setting the status or pushing/opening a PR, present:
     - the full `## Done Criteria` section of the story file
     - all task verification summaries
     - for software projects, smoke-test evidence from the final task run or a fresh story-level run if the task evidence is stale
     - the commits that will be pushed

     Then ask explicitly:

     > "All tasks are complete. Please perform the final human developer code review for this story. Reply with **approved** to mark the story DONE, push the branch, and create the PR, or list the requested corrections."

   Wait for approval before setting story status to `DONE` in the story file.

   If the reviewer requests corrections:
   - execute `[RECORD-EDGE-CASE]` with the requested corrections and the affected story
   - implement the corrections
   - rerun relevant task/story verification
   - for software projects, rerun the smoke test plan when code, build, dependencies, migrations, startup, or configuration changed
   - present the updated review summary again
   - wait for a new human review

   Do not mark the story `DONE`, push, or create a PR before approval.
15. Invoke `/doc-story <planning-id> <story-id>`. If the story area is DO or W this is a silent no-op. Include any files written in the final report.

### Git finalize

After the story is marked DONE and the human developer review has approved push/PR:

16. If `execution.requires_git` is `false`, skip Git finalize and report that branch, push, PR creation, and branch cleanup were disabled by `.planning/config.yml`.

17. Sync the story branch with the base branch before opening the story PR:
   ```bash
   git fetch origin
   git checkout <story-branch>
   git pull --ff-only origin <story-branch>
   git rebase origin/<base_branch>
   ```
   If the rebase has conflicts: execute `[RECORD-EDGE-CASE]` with the conflicting files, stop, list the conflicts, and ask the user to resolve them before continuing.
18. Push the story branch:
    ```bash
    git push -u origin <story-branch>
    ```
19. Open or reuse a pull request targeting `<base_branch>`:
    ```bash
    gh pr create \
      --title "<story-NN>: <story-name>" \
      --body "Closes story <story-id> of planning <planning-id>." \
      --base <base_branch> \
      --head <story-branch>
    ```
    If a story PR for `<story-branch>` already exists, reuse it instead of creating a duplicate. If `gh` shows that the existing story PR is already merged into `<base_branch>`, continue to local story branch cleanup in step 20. If `gh` is not available, execute `[RECORD-EDGE-CASE]` noting that PR creation or PR-state verification had to be completed manually, then print the push URL and instruct the user to open or verify the PR manually.

20. Handle story branch local cleanup:
    - If the story PR is already merged into `<base_branch>` or the user confirms it was merged manually, delete the local story branch now:
      ```bash
      git checkout <base_branch>
      git pull --ff-only origin <base_branch>
      git branch -d <story-branch>
      ```
    - If the story PR is still open, do not delete the branch yet. Report that after the PR is merged into `<base_branch>`, the local story branch must be deleted with the same commands:
      ```bash
      git checkout <base_branch>
      git pull --ff-only origin <base_branch>
      git branch -d <story-branch>
      ```
    Use `git branch -d`, not a forced delete. If deletion fails, report that the branch is not recognized as merged locally and ask the user to confirm the story PR merge state. Remote branch deletion is left to the repository/PR workflow.
21. Report: story completed, N tasks done, all task PRs merged into `<story-branch>`, local task branches cleaned, done criteria satisfied, doc files written, branch `<story-branch>` pushed, story PR URL when git is enabled, and story branch local cleanup status.

> To find the next story, use `/plan-status`, then run `/plan-story <planning-id> <next-story-id>`.
> To decompose a story into atomic task files before executing it, use `/plan-atomize <planning-id> <story-id>`. To execute a single atomic task, use `/plan-task`.
