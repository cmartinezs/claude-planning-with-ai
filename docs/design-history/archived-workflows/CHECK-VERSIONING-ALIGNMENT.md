# [CHECK-VERSIONING-ALIGNMENT]

> Archived from `planning-template/WORKFLOWS/04-SUB-WORKFLOWS/`.
>
> This workflow is preserved as design history only. It assumes legacy Phase 5, Phase 8, and Phase 11 document links and is not part of the installed planning template.

Verifies that the versioning strategy defined in Phase 5 is consistently referenced in Phase 8 (Deployment) and Phase 11 (Feedback).

---

## Steps

1. Open the versioning strategy document in Phase 5 output and extract the version format (e.g., `MAJOR.MINOR.PATCH`), pre-release tags (e.g., `alpha`, `beta`), and release trigger rules.
2. Open Phase 8 (Deployment) output and verify:
   - Release tags follow the versioning format from Phase 5.
   - CI/CD pipeline has a stage or step for creating/tagging releases.
3. Open Phase 11 (Feedback) output and verify:
   - Retrospective or feedback templates reference version milestones.
4. Open Phase 6 dev workflow (`commits/`, `pull-requests/`) and verify:
   - Release commit types or PR labels align with versioning conventions.
5. Return: `OK` if aligned; `MISALIGNMENT` + what differs.
