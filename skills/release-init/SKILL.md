---
name: release-init
description: Initialize the .releases/ directory for release planning. Run once per project, independent of /plan-init.
argument-hint: ""
allowed-tools: [Bash, Write]
---

Initialize `.releases/` for release planning. This is a one-time setup command, independent of `/plan-init` — not every project that uses the planning system needs release management.

## Steps

1. Check whether `.releases/` already exists at the project root. If it does, stop: "`.releases/` already initialized — run `/release-status` to see existing releases."

2. Create the `.releases/` directory.

3. Write `.releases/README.md` with the following content:

```markdown
# 🚀 Releases

| Version | Target | Status | Est. Date | Plannings |
|---------|--------|--------|-----------|-----------|
| — | — | — | — | — |
```

4. Report: "`.releases/` initialized. Next step: `/release-new <vX.Y.Z> -- <purpose>`."
