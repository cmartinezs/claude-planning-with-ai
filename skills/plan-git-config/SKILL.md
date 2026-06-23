---
name: plan-git-config
description: View or update the git configuration for the planning system (base branch). Use on projects already initialized with /plan-init.
argument-hint: [--base-branch <branch>]
allowed-tools: [Read, Write, Bash]
---

View or update `.planning/config.yml`. Use this on projects where `.planning/` was already initialized before git configuration was introduced.

## Arguments

`$ARGUMENTS` (optional)
- `--base-branch <branch>` — set the base branch (e.g. `--base-branch develop`)
- *(no arguments)* — show current configuration and offer to change it

## Steps

### If `--base-branch <branch>` was given

1. Validate the branch exists locally or on the remote:
   ```bash
   git branch --list <branch>
   git ls-remote --heads origin <branch>
   ```
   If neither finds it: warn the user ("branch not found locally or on origin") but still write the value — it may not exist yet.

2. Write (or overwrite) `.planning/config.yml`:
   ```yaml
   # Planning system configuration — edit as needed.
   # Managed by /plan-git-config.

   git:
     base_branch: <branch>
   ```
   If the file already exists with other keys, preserve them and update only `git.base_branch`.

3. Report: `git.base_branch` set to `<branch>` in `.planning/config.yml`.

---

### If no arguments

1. Check whether `.planning/config.yml` exists.
   - If it exists: read and display it.
   - If it does not exist: report "No git configuration found. Run `/plan-git-config --base-branch <branch>` to set one."

2. Show the current configuration:
   ```
   Current git configuration (.planning/config.yml):
     base_branch: <value>
   ```

3. Ask: "Would you like to change anything?" — accept free-text input or Enter to exit without changes.

4. Apply any requested changes and rewrite the file.
