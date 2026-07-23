# Lo feo

## 1. `/release` puede convertirse en un comando dios

La propuesta afirma que cada comando tiene una responsabilidad única, pero `/release` se encarga de:

- configurar contexto;
- crear;
- planificar;
- modificar;
- consultar;
- liberar;
- finalizar.

Eso no es una única responsabilidad.

Puede existir como fachada pública, pero debe declararse como router:

```text
/release = public command router
```

Internamente debería delegar a use cases independientes:

```text
release-init
release-create
release-plan
release-query
release-transition
release-finalize
scope-configure
story-manage
```

El `SKILL.md` de `/release` debería:

1. parsear intención;
2. resolver subcomando;
3. delegar;
4. presentar resultado.

No debería contener todo el lifecycle.

## 2. Existen dos inicializaciones

El flujo propone:

```text
/plan-init
/release init
```

Esto contradice el objetivo de simplificación.

El usuario no debería decidir qué init necesita.

Propuesta:

```text
/plan-init
```

realiza bootstrap y configuración inicial completa.

Para modificaciones posteriores:

```text
/plan-config
```

administra:

- scopes;
- Git;
- documentación;
- comandos;
- autonomía;
- guides.

`release init` debería desaparecer.

## 3. Markdown está siendo tratado como base de datos

La propuesta asigna a scripts la escritura y el parseo de Markdown para:

- estados;
- tablas;
- índices;
- dependencias;
- secuencia;
- orquestación.

Esto puede ser determinista en condiciones controladas, pero es frágil:

- el usuario puede editar tablas;
- un agente puede reformatearlas;
- existen múltiples representaciones equivalentes;
- los enlaces cambian al renombrar;
- los parsers pueden perder formato;
- los merges de grafos son conflictivos.

Recomendación:

```text
release.yml
story.yml
work-package.yml
task.yml
```

como estado canónico.

Markdown generado:

```text
README.md
TRACEABILITY.md
REPORT.md
RELEASE-NOTES.md
```

Principio:

> YAML o JSON es el estado. Markdown es una proyección humana.

## 4. El determinismo todavía es parcial

Una guía generada con IA no se vuelve determinista automáticamente.

Solo se vuelve una entrada determinista después de ser:

- congelada;
- validada;
- aprobada;
- versionada.

Estados recomendados:

```yaml
guide_status:
  - generated
  - reviewed
  - approved
  - stale
  - rejected
```

Provenance mínimo:

```yaml
provenance:
  sources: [...]
  source_fingerprints: [...]
  generator_version: ...
  model: ...
  prompt_version: ...
  approved_by: ...
  approved_at: ...
```

Una guía no aprobada no debería habilitar atomización automática en modo estricto.

## 5. `dry-run` no es una transacción

La secuencia:

```text
dry-run
write
```

no protege contra concurrencia.

Caso problemático:

1. Agente A inspecciona una release.
2. Agente B modifica la release.
3. Agente A ejecuta el plan antiguo.
4. Se sobrescriben cambios o quedan índices incoherentes.

Se necesita:

```text
inspect -> propose -> validate -> apply -> verify
```

El plan debe incluir:

```json
{
  "operation_id": "OP-...",
  "workspace_revision": "sha256:...",
  "preconditions": [],
  "changes": [],
  "commands": [],
  "expected_postconditions": []
}
```

`apply` debe fallar si la revisión cambió.

También se requieren:

- escrituras atómicas;
- idempotency key;
- optimistic locking;
- operation journal;
- rollback técnico;
- validación post-write.

## 6. Inconsistencia sobre ubicación de scripts

La propuesta afirma que scripts y templates se leen desde la instalación del plugin.

Sin embargo, el contrato utiliza:

```text
node .planning/scripts/release.mjs
```

Debe existir un único contrato.

Alternativas:

```text
node <plugin-install>/scripts/release.mjs
```

o un launcher estable:

```text
claude-planning release ...
```

La mejor opción es el launcher.

El usuario y las skills no deberían conocer rutas internas de instalación.

## 7. Template pack sin lock robusto

No copiar el template pack evita duplicación, pero afecta reproducibilidad.

Al clonar el repo en otra máquina puede existir:

- otra versión del plugin;
- otro schema;
- otro template pack;
- otra renderización.

Debe existir:

```text
.planning/plugin.lock.yml
```

Ejemplo:

```yaml
plugin:
  version: 4.0.0
  schema_version: 4
  template_pack:
    id: default
    version: 4.0.0
    fingerprint: sha256:...
```

El plugin debe poder leer artefactos creados con revisiones anteriores compatibles del schema.
