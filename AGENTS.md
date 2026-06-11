# Repository Guidelines

## Project Structure & Module Organization

This repository contains a Claude Code planning plugin plus its static landing page.

- `.claude-plugin/plugin.json` defines plugin metadata.
- `skills/<command>/SKILL.md` contains the command implementations exposed by the plugin, such as `plan-init`, `plan-scope`, and `us-enrich`.
- `planning-template/` is the template copied into user projects by `/plan-init`; keep workflow docs, tutorials, templates, and glossary files here.
- `scripts/` contains maintenance utilities, currently `migrate-commands.sh`.
- `.page/` is a Next.js/Tailwind landing page. Source lives in `.page/components`, `.page/pages`, and `.page/styles`; static export output is `.page/out`.

## Build, Test, and Development Commands

Run page commands from `.page/`:

```bash
cd .page
npm run dev      # Start local Next.js dev server
npm run build    # Type-check and export the static site
npm run start    # Serve a production Next.js build
npm run lint     # Runs Next lint; currently prompts if ESLint is not configured
```

For plugin content, validate changes by reading the affected `SKILL.md` and checking the copied paths in `planning-template/`.

## Coding Style & Naming Conventions

Use Markdown for plugin and planning workflow content. Keep headings descriptive, command examples fenced, and terminology aligned with `planning-template/GLOSSARY.md`. Skill directories use kebab-case command names, for example `plan-from-epic/`.

The landing page uses TypeScript React components, PascalCase component files, two-space indentation, Tailwind utility classes, and concise component-local data structures.

## Testing Guidelines

There is no automated plugin test suite in this repository. For documentation or workflow changes, manually inspect generated paths and command references for consistency. For `.page` changes, run `npm run build` before handing off. Add focused tests only if introducing executable logic that can be validated outside Claude Code.

## Commit & Pull Request Guidelines

No local Git history is available in this checkout, so use clear, imperative commit messages such as `Update landing page repo links` or `Refine plan-scope workflow docs`.

Pull requests should include a short summary, affected commands or sections, verification steps, and screenshots for `.page` UI changes. Link related issues or planning notes when available.

## Agent-Specific Instructions

Do not edit generated outputs such as `.page/.next` or dependency folders. Prefer source edits in `skills/`, `planning-template/`, or `.page/components`. When changing a command, update related README/tutorial references in the same pass.
