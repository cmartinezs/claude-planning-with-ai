# Lo feo

## 1. `events.ndjson` como punto de conflicto

Un único archivo:

```text
.planning/events.ndjson
```

es incompatible con múltiples:

- agentes;
- worktrees;
- branches;
- operaciones concurrentes.

Dos ramas pueden agregar líneas diferentes al final del mismo archivo.

Git deberá resolver:

- orden;
- duplicados;
- conflictos;
- timestamps;
- operaciones repetidas.

### Corrección

Eventos inmutables por archivo:

```text
.planning/events/
  2026/
    07/
      01J4E-release-created.json
      01J4F-task-started.json
```

`events.ndjson` puede ser una proyección o export.

## 2. `baseRevision` demasiado global

Una revisión de todo el workspace invalida operaciones por cambios no relacionados.

### Corrección

Usar revisiones por agregado:

```json
{
  "baseRevisions": {
    "projectConfig": "sha256:...",
    "release:R0001": "sha256:...",
    "story:S0001": "sha256:...",
    "workPackage:WP0001": "sha256:...",
    "guide:web:task": "sha256:..."
  }
}
```

Solo debe bloquearse una operación cuando cambia una dependencia leída.

## 3. IDs secuenciales incompatibles con trabajo distribuido

IDs como:

```text
R0001
S0001
WP0001
T0001
```

son legibles, pero pueden colisionar entre worktrees.

Caso:

- Worktree A crea `T0042`.
- Worktree B crea `T0042`.
- Ambos son válidos localmente.
- El conflicto aparece en merge.

### Corrección

```yaml
id: 01J4F0Z9...
display_id: T0042
```

Usar:

- ULID;
- UUIDv7;
- otro identificador distribuido.

El número secuencial queda como etiqueta humana.

## 4. Atomicidad multiarchivo no definida

Un rename atómico no vuelve atómica una operación que cambia:

- release;
- story;
- Work Package;
- task;
- proyecciones;
- eventos.

### Protocolo

```text
.planning/.operations/<operation-id>/
  change-set.json
  before/
  staged/
  operation.yml
```

Estados:

```text
PROPOSED
VALIDATED
APPROVED
APPLYING
APPLIED
VERIFIED
FAILED
ROLLED_BACK
```

## 5. Launcher en ruta incorrecta

La estructura propone:

```text
runtime/bin/claude-planning.mjs
```

Pero para exposición automática del ejecutable se necesita un launcher raíz:

```text
bin/
  claude-planning
```

Puede delegar a:

```text
runtime/bin/claude-planning.mjs
```

Ejemplo conceptual:

```bash
#!/usr/bin/env bash
node "${CLAUDE_PLUGIN_ROOT}/runtime/bin/claude-planning.mjs" "$@"
```

Debe probarse en:

- Linux;
- macOS;
- WSL2;
- Windows nativo o Git Bash.

## 6. Dependencias del runtime no empaquetadas

El runtime probablemente requerirá:

- YAML;
- JSON Schema;
- CLI parsing;
- hashing;
- globbing;
- locks.

No debe asumirse que el gestor del plugin ejecutará `npm install`.

### Corrección

Construir un bundle self-contained:

```text
src/
dist/
  claude-planning.mjs
```

Con:

- esbuild;
- rollup;
- ncc;
- herramienta equivalente.

## 7. Plugin lock sin disponibilidad histórica

Un fingerprint identifica un template pack, pero no garantiza que siga disponible tras actualizar el plugin.

### Alternativas

1. mantener packs históricos en el plugin;
2. guardar snapshot mínimo en workspace;
3. publicar packs inmutables por fingerprint;
4. aceptar validación sin regeneración exacta.

Recomendación:

```text
.planning/vendor/template-packs/<fingerprint>/
```

Guardar solo templates realmente utilizados.

## 8. `/plan-check tests --generate` muta

Un check debería:

- validar;
- reportar;
- proponer;
- fallar.

No debería generar artefactos.

La generación debe vivir en:

```text
/plan-story atomize
/plan-task prepare
/plan-config guide refresh
```

## 9. `dry-run/write` y ChangeSet coexisten

El roadmap todavía usa:

```text
--dry-run
--write
```

mientras el protocolo formal usa:

```text
propose
validate
approve
apply
verify
```

Debe existir un único modelo mental.

CLI recomendada:

```text
claude-planning workspace init propose
claude-planning changeset validate OP-...
claude-planning changeset apply OP-...
claude-planning changeset verify OP-...
```
