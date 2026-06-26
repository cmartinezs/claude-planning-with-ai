# [CHECK-DEVWORKFLOW-CONSISTENCY]

> Archived from `planning-template/WORKFLOWS/04-SUB-WORKFLOWS/`.
>
> This workflow is preserved as design history only. It assumes a legacy `06-development/workflow/` document structure and is not part of the installed planning template.

Verifies that the four dev workflow templates in `06-development/workflow/` are mutually consistent.

---

## Steps

1. Open all four sub-area files: `branches/`, `commits/`, `pull-requests/`, `cicd/`.
2. Verify that commit types referenced in `pull-requests/` match those defined in `commits/`.
3. Verify that branch names used in `cicd/` triggers match the strategy defined in `branches/`.
4. Verify that the PR merge strategy (squash/merge/rebase) is compatible with the branch strategy (GitFlow vs Trunk-Based).
5. Verify that CI/CD environment names (`dev`, `staging`, `prod` or equivalents) are used consistently across all four files.
6. Verify that all navigation links in these files are correct (no broken `[text](path)` references).
7. Return: `OK` if consistent; `INCONSISTENCY` + list if not.
