#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const cwd = process.cwd();
const args = process.argv.slice(2);
const stage = args.shift();
const positional = [];
let format = 'markdown';
let write = false;
let planningId = '';
let version = '';
let target = '';
let date = '';

function usage() {
  return `Usage:
  node .planning/scripts/planning-from-release.mjs inspect <release-file> [--format markdown|json]
  node .planning/scripts/planning-from-release.mjs bridge <release-file> --planning-id <NNN-slug> [--write] [--format markdown|json]
  node .planning/scripts/planning-from-release.mjs seed-release <release-file> --version <vX.Y.Z> --target <YYYY-QN-MN-WN> --date <YYYY-MM-DD> [--write] [--format markdown|json]

Turns a release source document into deterministic planning handoff artifacts. The script writes only in the current workspace's .planning/ and .releases/ directories.`;
}

for (let i = 0; i < args.length; i += 1) {
  const arg = args[i];
  if (arg === '--format') {
    format = args[i + 1] || '';
    i += 1;
  } else if (arg === '--write') write = true;
  else if (arg === '--planning-id') {
    planningId = args[i + 1] || '';
    i += 1;
  } else if (arg === '--version') {
    version = args[i + 1] || '';
    i += 1;
  } else if (arg === '--target') {
    target = args[i + 1] || '';
    i += 1;
  } else if (arg === '--date') {
    date = args[i + 1] || '';
    i += 1;
  } else if (arg === '-h' || arg === '--help' || arg === 'help') {
    console.log(usage());
    process.exit(0);
  } else positional.push(arg);
}

if (!['markdown', 'json'].includes(format)) fail(`Invalid --format: ${format}`);
if (!['inspect', 'bridge', 'seed-release'].includes(stage || '')) fail(`Invalid stage: ${stage || '(missing)'}`, { help: usage() });

function fail(message, details = {}) {
  if (format === 'json') console.log(JSON.stringify({ ok: false, error: message, ...details }, null, 2));
  else {
    console.error(`ERROR: ${message}`);
    if (details.help) console.error(`\n${details.help}`);
  }
  process.exit(1);
}

function rel(file) {
  return path.relative(cwd, file).replaceAll(path.sep, '/') || '.';
}

function resolveInsideCwd(file) {
  const resolved = path.resolve(cwd, file);
  const relative = path.relative(cwd, resolved);
  if (relative.startsWith('..') || path.isAbsolute(relative)) fail(`Path must be inside the current workspace: ${file}`);
  return resolved;
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function writeFile(file, text, touched) {
  touched.push(rel(file));
  if (!write) return;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
}

function exists(file) {
  return fs.existsSync(file);
}

function isDir(file) {
  return exists(file) && fs.statSync(file).isDirectory();
}

function slugify(value) {
  return String(value || 'release')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'release';
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function firstHeading(text) {
  const match = /^#\s+(.+)$/m.exec(text);
  return match ? cleanInline(match[1]) : '';
}

function cleanInline(value) {
  return String(value || '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function section(text, names) {
  const alternatives = names.map(escapeRegex).join('|');
  const match = new RegExp(`^##\\s+(?:\\d+\\.\\s*)?(?:${alternatives})(?:\\s+.*)?$`, 'im').exec(text);
  if (!match) return '';
  const start = match.index + match[0].length;
  const rest = text.slice(start);
  const next = /^##\s+/im.exec(rest);
  return (next ? rest.slice(0, next.index) : rest).trim();
}

function bulletLines(block) {
  return block.split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^[-*]\s+\S/.test(line))
    .map((line) => cleanInline(line.replace(/^[-*]\s+/, '').replace(/^\[[ xX]\]\s+/, '')));
}

function checkboxLines(block) {
  return block.split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^[-*]\s+\[[ xX]\]\s+\S/.test(line))
    .map((line) => cleanInline(line.replace(/^[-*]\s+\[[ xX]\]\s+/, '')));
}

function headingItems(block) {
  return block.split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^#{3,6}\s+\S/.test(line))
    .map((line) => cleanInline(line.replace(/^#{3,6}\s+/, '')));
}

function tableRows(block) {
  return block.split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith('|') && line.endsWith('|'))
    .filter((line) => !/^\|\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|$/.test(line))
    .map((line) => line.slice(1, -1).split('|').map((cell) => cleanInline(cell)));
}

function listFromSection(text, names) {
  const block = section(text, names);
  const rows = tableRows(block);
  if (rows.length > 1) {
    const header = rows[0].map((cell) => cell.toLowerCase());
    const hasHeader = header.some((cell) => /^(id|us|story|user story|historia|titulo|title|name|nombre|capacidad|capability|dependencia|dependency|criterio|criterion|decision|item)$/.test(cell));
    const firstUseful = hasHeader
      ? header.findIndex((cell) => /^(id|us|story|user story|historia|titulo|title|name|nombre|capacidad|capability|dependencia|dependency|criterio|criterion|decision|item)$/.test(cell))
      : 0;
    const index = firstUseful >= 0 ? firstUseful : 0;
    return rows.slice(hasHeader ? 1 : 0)
      .map((row) => row[index] || row.find(Boolean) || '')
      .filter(Boolean);
  }
  return [...bulletLines(block), ...headingItems(block)].filter(Boolean);
}

function inferAreas(text) {
  const candidates = new Map([
    ['docs', 'documentation'],
    ['web', 'frontend'],
    ['api', 'backend/api'],
    ['agents', 'agent runtime'],
    ['infra', 'infrastructure'],
    ['db', 'database'],
    ['database', 'database'],
    ['mobile', 'mobile'],
    ['cli', 'cli'],
  ]);
  const areas = [];
  for (const [key, label] of candidates) {
    const pattern = new RegExp(`(?:\`${escapeRegex(key)}\/?\`|\\b${escapeRegex(key)}\\/)`, 'i');
    if (pattern.test(text)) areas.push({ area: key, label });
  }
  const topDirs = fs.readdirSync(cwd, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.') && !['node_modules', 'target', 'dist', 'build'].includes(entry.name))
    .map((entry) => entry.name);
  for (const dir of topDirs) {
    if (areas.some((item) => item.area === dir)) continue;
    if (new RegExp(`(?:\`${escapeRegex(dir)}\/?\`|\\b${escapeRegex(dir)}\\/)`, 'i').test(text)) {
      areas.push({ area: dir, label: 'workspace area' });
    }
  }
  return areas;
}

function discoverChildWorkspaces() {
  return fs.readdirSync(cwd, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
    .map((entry) => entry.name)
    .filter((dir) => isDir(path.join(cwd, dir, '.planning')))
    .sort()
    .map((dir) => ({
      dir,
      active: listPlanningDirs(path.join(cwd, dir, '.planning', 'active')),
      finished: listPlanningDirs(path.join(cwd, dir, '.planning', 'finished')),
    }));
}

function listPlanningDirs(root) {
  if (!isDir(root)) return [];
  return fs.readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function gateLines(text) {
  const lines = text.split(/\r?\n/);
  const gates = [];
  let inFence = false;
  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    if (/^\s*(\/|node\s|npm\s|pnpm\s|yarn\s|git\s|gh\s)/.test(line)) continue;
    const clean = cleanInline(line.replace(/^[-*]\s+/, '').replace(/^\|\s*/, ''));
    if (/^(\/|node\s|npm\s|pnpm\s|yarn\s|git\s|gh\s)/.test(clean)) continue;
    if (!clean) continue;
    if (/\b(NOT READY|Pendiente|Pending|Bloquead[ao]|Blocked|BLOCKER|NO-GO|unresolved|sin resolver)\b/i.test(clean)) {
      gates.push(clean);
    }
  }
  return [...new Set(gates)].slice(0, 40);
}

function parseRelease(file) {
  const text = read(file);
  const title = firstHeading(text) || path.basename(file, '.md');
  const releaseMatch = title.match(/\b(R\d+|v\d+\.\d+\.\d+|release[-\s]+\d+)\b/i) || path.basename(file).match(/\b(release-\d+|R\d+)\b/i);
  const purpose = section(text, ['Objective', 'Objetivo', 'Purpose', 'Proposito', 'Resumen ejecutivo']);
  const scope = listFromSection(text, ['Scope', 'Alcance', 'Included Scope', 'Alcance incluido']);
  const exclusions = listFromSection(text, ['Exclusions', 'Exclusiones', 'Out of Scope', 'Fuera de alcance']);
  const includedStories = listFromSection(text, ['Included User Stories', 'User Stories incluidas', 'US incluidas', 'Historias incluidas', 'Included stories']);
  const proposedStories = listFromSection(text, ['Proposed User Stories', 'US propuestas', 'Historias propuestas', 'Proposed stories']);
  const dependencies = listFromSection(text, ['Dependencies', 'Dependencias', 'Prerequisites', 'Precondiciones']);
  const doneCriteria = [
    ...checkboxLines(section(text, ['Done Criteria', 'Definition of Done', 'Criterios de cierre', 'Criterios'])),
    ...bulletLines(section(text, ['Done Criteria', 'Definition of Done', 'Criterios de cierre', 'Criterios'])),
  ].filter(Boolean);
  const validation = listFromSection(text, ['Validation', 'Validacion', 'Validation Checks', 'Pruebas de validacion']);
  const areas = inferAreas(text);
  const gates = gateLines(text);
  const childWorkspaces = discoverChildWorkspaces();
  return {
    source: rel(file),
    releaseKey: releaseMatch ? cleanInline(releaseMatch[1]) : '',
    title,
    slug: slugify(title.replace(/\b(R\d+|v\d+\.\d+\.\d+|release[-\s]+\d+)\b/ig, '')),
    purpose: cleanInline(purpose.split(/\r?\n/).find((line) => line.trim() && !line.trim().startsWith('>')) || title),
    scope,
    exclusions,
    includedStories,
    proposedStories,
    dependencies,
    doneCriteria,
    validation,
    areas,
    gates,
    childWorkspaces,
  };
}

function requirePlanningRoot() {
  const root = path.join(cwd, '.planning');
  if (!isDir(root)) fail('No .planning/ directory found in the current workspace. Run /plan-init first.');
  return root;
}

function areaCode(area) {
  const last = area.toLowerCase().split('/').filter(Boolean).pop() || area.toLowerCase();
  if (/(api|backend|server)/.test(last)) return 'AP';
  if (/(web|frontend|ui|client)/.test(last)) return 'WB';
  if (/(docs|documentation|doc)/.test(last)) return 'DO';
  if (/(infra|infrastructure|terraform|deploy)/.test(last)) return 'IN';
  if (/(agent|agents|ai|ml)/.test(last)) return 'AG';
  if (/(db|database)/.test(last)) return 'DB';
  return last.replace(/[^a-z0-9]/g, '').slice(0, 2).toUpperCase() || 'AR';
}

function bridgeArtifacts(data, id) {
  const planningRoot = requirePlanningRoot();
  if (!/^\d{3}-[a-z0-9][a-z0-9-]*$/.test(id)) fail('Invalid --planning-id. Use NNN-slug, for example 008-assessment-creation.');
  const dir = path.join(planningRoot, 'active', id);
  if (exists(dir)) fail(`Planning already exists: ${rel(dir)}`);
  const areas = data.areas.length > 0 ? data.areas : [{ area: 'planning', label: 'coordination' }];
  const storyRows = areas.map((item, index) => {
    const number = String(index + 1).padStart(2, '0');
    return `| ${number} | ${slugify(`${item.area}-coordination-brief`)} | ${areaCode(item.area)} | ${index === 0 ? '—' : '01'} | M | — | TODO |`;
  });
  const impactRows = areas.map((item) => `| ${areaCode(item.area)} | \`${item.area}/\` | ☑ | Coordinate child-owned implementation brief for ${item.label}. |`);
  const linkedRows = data.childWorkspaces.length > 0
    ? data.childWorkspaces.map((child) => `| ../<worktree-prefix> | <worktree-prefix>/story-NN-${slugify(child.dir)} | ${child.dir}/.planning | ${child.dir}/ owns implementation | Active: ${child.active.join(', ') || 'none'}; finished: ${child.finished.join(', ') || 'none'} | TODO |`)
    : ['| — | — | — | No child .planning/ workspaces detected | — | — |'];
  const files = [];
  files.push({
    path: path.join(dir, '00-initial.md'),
    text: `# INITIAL: ${data.title}

> **Status:** Initial
> [← planning/README.md](../../README.md)

---

## Intent

Coordinate implementation planning for ${data.title}.

## Why

Source release document ${data.source} is ready to become executable work. This parent planning keeps release coordination separate from child implementation ownership.

## Approximate Scope

${areas.map((item) => `- [ ] \`${item.area}/\` — ${item.label}`).join('\n')}
- [ ] \`.planning/\` — parent coordination, readiness gates, and child handoff briefs

## Initiator

- **Requested by:** human
- **Date:** ${new Date().toISOString().slice(0, 10)}
- **Related planning (if continuation):** none

## Source

- Release source: ${data.source}
- Release key: ${data.releaseKey || 'not detected'}

## Supersedes

*(none)*

## Next Step

- [ ] Review readiness gates in 01-expansion.md
- [ ] Create child-owned plannings from release-briefs/ in the relevant workspace
- [ ] Seed .releases/ only after version, target period, and estimated date are known

### Open Questions

${data.gates.length > 0 ? data.gates.map((gate) => `- [ ] ${gate}`).join('\n') : '*None detected by deterministic scan.*'}

---

> [← planning/README.md](../../README.md)
`,
  });
  files.push({
    path: path.join(dir, '01-expansion.md'),
    text: `# EXPANSION: ${data.title}

> **Status:** Expansion
> [← planning/README.md](../../README.md)

---

## Story Summary

| # | Story | SDLC Phase(s) | Depends On | Risk | External Issue | Status |
|---|-------|--------------|------------|------|----------------|--------|
${storyRows.join('\n')}

---

## Release Source

- Source: ${data.source}
- Release key: ${data.releaseKey || 'not detected'}
- Purpose: ${data.purpose}

## Readiness Gates

${data.gates.length > 0 ? data.gates.map((gate) => `- [ ] ${gate}`).join('\n') : '- [x] No blocking gate detected by deterministic scan.'}

## Included Source Stories

${data.includedStories.length > 0 ? data.includedStories.map((item) => `- ${item}`).join('\n') : '- Not detected.'}

## Proposed Or Missing Source Stories

${data.proposedStories.length > 0 ? data.proposedStories.map((item) => `- [ ] ${item}`).join('\n') : '- None detected.'}

## Dependency Map

\`\`\`mermaid
flowchart LR
${areas.map((item, index) => `    S01[Release coordination] --> S${String(index + 2).padStart(2, '0')}[${item.area} brief]`).join('\n') || '    S01[Release coordination]'}
\`\`\`

## Impact per Repository Area

| Code | Area | Affected? | What changes |
|------|------|----------|-------------|
${impactRows.join('\n')}
| W | \`.planning/\` | ☑ | Parent release coordination only; child implementation remains child-owned. |

## Linked Child Plannings

| Child Worktree | Child Branch | Child Planning | Ownership | Sync Notes | Status |
|----------------|--------------|----------------|-----------|------------|--------|
${linkedRows.join('\n')}

## Notes

- This bridge is generated from a release source document. Treat generated child briefs as handoff inputs, not as implementation authority.
- Do not write child implementation tasks in this parent planning when a child workspace has its own .planning/.
- Enrich source stories before atomization when readiness gates mention missing DoD, technical notes, or NOT READY stories.

## Risk Register

| ID | Risk | Impact | Likelihood | Mitigation | Owner | Status |
|----|------|--------|------------|------------|-------|--------|
| R-01 | Release source has ambiguous ownership across areas | M | M | Use child briefs and create owner-specific child plannings before implementation | Release owner | Open |

## External Issue Mapping

| Story | External System | External ID / URL | Sync Notes |
|-------|-----------------|-------------------|------------|
| — | — | — | — |

---

> [← planning/README.md](../../README.md)
`,
  });
  files.push({
    path: path.join(dir, 'TRACEABILITY.md'),
    text: `# Traceability: ${data.title}

| Source | Planning Artifact | Status |
|--------|-------------------|--------|
| ${data.source} | 00-initial.md | Generated |
| ${data.source} | 01-expansion.md | Generated |
| ${data.source} | release-briefs/ | Generated |
`,
  });
  for (const item of areas) {
    files.push({
      path: path.join(dir, 'release-briefs', `${slugify(item.area)}.md`),
      text: childBrief(data, item),
    });
  }
  return { dir, files };
}

function childBrief(data, item) {
  return `# Child Planning Brief: ${item.area}

## Source

- Release source: ${data.source}
- Release: ${data.title}
- Area: ${item.area}

## Ownership

Create or update implementation planning in the workspace that owns \`${item.area}/\`. This parent bridge should not carry child implementation tasks.

## Scope Signals

${data.scope.length > 0 ? data.scope.map((entry) => `- ${entry}`).join('\n') : '- No explicit scope bullets detected.'}

## Exclusions

${data.exclusions.length > 0 ? data.exclusions.map((entry) => `- ${entry}`).join('\n') : '- None detected.'}

## Dependencies And Gates

${[...data.dependencies, ...data.gates].length > 0 ? [...data.dependencies, ...data.gates].map((entry) => `- [ ] ${entry}`).join('\n') : '- [x] No dependency or gate detected by deterministic scan.'}

## Done Criteria Signals

${data.doneCriteria.length > 0 ? data.doneCriteria.map((entry) => `- [ ] ${entry}`).join('\n') : '- No explicit Done Criteria detected.'}

## Validation Signals

${data.validation.length > 0 ? data.validation.map((entry) => `- [ ] ${entry}`).join('\n') : '- No explicit validation bullets detected.'}

## Next Step

Run the child workspace planning command that matches the source material:

- Use /plan-from-epic when the release points to ready source stories.
- Use /us-enrich before atomization when source stories are NOT READY or missing DoD/technical notes.
- Use /plan-atomize only after the child planning owns clear stories.
`;
}

function runInspect(file) {
  return { ok: true, stage: 'inspect', release: parseRelease(file) };
}

function runBridge(file) {
  const data = parseRelease(file);
  if (!planningId) fail('Missing --planning-id <NNN-slug>.');
  const artifacts = bridgeArtifacts(data, planningId);
  const touched = [];
  for (const artifact of artifacts.files) writeFile(artifact.path, artifact.text, touched);
  return {
    ok: true,
    stage: 'bridge',
    write,
    planning: rel(artifacts.dir),
    files: touched,
    message: write ? `Bridge planning created at ${rel(artifacts.dir)}.` : `Dry run only. Rerun with --write to create ${rel(artifacts.dir)}.`,
  };
}

function runSeedRelease(file) {
  requirePlanningRoot();
  const data = parseRelease(file);
  if (!/^v\d+\.\d+\.\d+$/.test(version)) fail('Missing or invalid --version <vX.Y.Z>.');
  if (!/^\d{4}-Q[1-4]-M[1-3]-W[1-4]$/.test(target)) fail('Missing or invalid --target <YYYY-QN-MN-WN>.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) fail('Missing or invalid --date <YYYY-MM-DD>.');
  const releasesDir = path.join(cwd, '.releases');
  const releaseFile = path.join(releasesDir, `${version}.md`);
  if (exists(releaseFile)) fail(`Release file already exists: ${rel(releaseFile)}`);
  const touched = [];
  writeFile(path.join(releasesDir, 'README.md'), releasesReadme(version, target, date), touched);
  writeFile(releaseFile, seededRelease(version, target, date, data), touched);
  return {
    ok: true,
    stage: 'seed-release',
    write,
    files: touched,
    message: write ? `Seeded .releases/${version}.md from ${data.source}.` : 'Dry run only. Rerun with --write to seed .releases/.',
  };
}

function releasesReadme(nextVersion, targetValue, estimatedDate) {
  const readme = path.join(cwd, '.releases', 'README.md');
  const row = `| [${nextVersion}](${nextVersion}.md) | ${targetValue} | DRAFT | ${estimatedDate} | 0/0 |`;
  if (exists(readme)) {
    const current = read(readme);
    if (current.includes(`[${nextVersion}](${nextVersion}.md)`)) return current;
    const lines = current.split(/\r?\n/);
    const placeholder = lines.findIndex((line) => /^\|\s*—\s*\|\s*—\s*\|\s*—\s*\|\s*—\s*\|\s*—\s*\|/.test(line.trim()));
    if (placeholder >= 0) {
      lines[placeholder] = row;
      return lines.join('\n');
    }
    const lastTable = lines.reduce((last, line, index) => line.trim().startsWith('|') ? index : last, -1);
    if (lastTable >= 0) lines.splice(lastTable + 1, 0, row);
    else lines.push('', '| Version | Target | Status | Est. Date | Plannings |', '|---------|--------|--------|-----------|-----------|', row);
    return lines.join('\n');
  }
  return `# Releases

| Version | Target | Status | Est. Date | Plannings |
|---------|--------|--------|-----------|-----------|
${row}
`;
}

function seededRelease(nextVersion, targetValue, estimatedDate, data) {
  return `# Release ${nextVersion}

> **Status:** DRAFT
> **Target:** ${targetValue}
> **Estimated Date:** ${estimatedDate}
> [← .releases/README.md](README.md)

---

## Purpose

${data.purpose}

## Source Release

- ${data.source}
- Source title: ${data.title}
- Source key: ${data.releaseKey || 'not detected'}

## Scope

${data.scope.length > 0 ? data.scope.map((item) => `- ${item}`).join('\n') : '- Not detected in source.'}

## Included Plannings

| # | Planning | Summary | Status |
|---|----------|---------|--------|
| — | — | — | — |

## Readiness Gates

${data.gates.length > 0 ? data.gates.map((item) => `- [ ] ${item}`).join('\n') : '- [x] No blocking gate detected by deterministic scan.'}

## Done Criteria

${data.doneCriteria.length > 0 ? data.doneCriteria.map((item) => `- [ ] ${item}`).join('\n') : '- [ ] All included plannings are COMPLETED'}

## Release Notes

*(pending)*

---

> [← .releases/README.md](README.md)
`;
}

const sourceFile = positional[0] ? resolveInsideCwd(positional[0]) : '';
if (!sourceFile) fail('Missing <release-file>.', { help: usage() });
if (!exists(sourceFile)) fail(`Release file not found: ${positional[0]}`);

const report = stage === 'inspect'
  ? runInspect(sourceFile)
  : stage === 'bridge'
    ? runBridge(sourceFile)
    : runSeedRelease(sourceFile);

if (format === 'json') console.log(JSON.stringify(report, null, 2));
else {
  if (report.stage === 'inspect') {
    const data = report.release;
    console.log(`# Release Source Inspection\n`);
    console.log(`Source: ${data.source}`);
    console.log(`Title: ${data.title}`);
    console.log(`Release key: ${data.releaseKey || 'not detected'}`);
    console.log(`Affected areas: ${data.areas.map((item) => item.area).join(', ') || 'not detected'}`);
    console.log(`Included stories: ${data.includedStories.length}`);
    console.log(`Proposed stories: ${data.proposedStories.length}`);
    console.log(`Readiness gates: ${data.gates.length}`);
    if (data.childWorkspaces.length > 0) {
      console.log(`Child workspaces: ${data.childWorkspaces.map((item) => item.dir).join(', ')}`);
    }
    if (data.gates.length > 0) {
      console.log(`\n## Gates`);
      for (const gate of data.gates) console.log(`- ${gate}`);
    }
  } else {
    console.log(report.message);
    for (const file of report.files) console.log(`- ${file}`);
  }
}
