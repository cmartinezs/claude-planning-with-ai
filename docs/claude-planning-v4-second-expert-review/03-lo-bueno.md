# Lo bueno

## 1. Dominio funcional y técnico separados

La separación actual es correcta:

- Story/Capability: valor funcional.
- Scope Work Package: porción técnica o disciplinaria.
- Task: unidad atómica ejecutable.

Esto elimina las historias artificiales por API, frontend, infraestructura o agentes.

## 2. Scope mejor definido

`scope` ahora se define como:

> Una unidad estable de ownership y validación que puede recibir Work Packages y posee paths, fuentes, reglas y gates propios.

También incorpora `kind`:

```yaml
kind: application | service | library | infrastructure | documentation | process | compliance | data | operations
```

Esto permite variar los gates según la naturaleza del scope.

Un scope `compliance` no debería heredar automáticamente:

- build;
- unit tests;
- smoke tests;
- Git flow de software.

## 3. Storage separado del runtime

La propuesta distingue:

```text
runtime/
template-pack/
skills/
scripts/
workspace .planning/
```

Responsabilidades:

| Ruta | Responsabilidad |
|---|---|
| `runtime/` | Código ejecutable, schemas y use cases |
| `template-pack/` | Templates y documentación renderizable |
| `skills/` | API conversacional |
| `scripts/` | Tooling del repositorio |
| `.planning/` | Estado del proyecto usuario |

Esta separación corrige la herencia v3 de ubicar scripts dentro de `planning-template/`.

## 4. ChangeSet como entidad central

El ChangeSet ya no es solo una salida de dry-run.

Es un contrato que puede:

- validarse;
- aprobarse;
- aplicarse;
- verificarse;
- rechazarse;
- reintentarse;
- auditarse.

Esto permite que la IA proponga sin controlar directamente la persistencia.

## 5. Skills delgadas

La skill queda limitada a:

- propósito;
- argumentos;
- precondiciones;
- llamada al launcher;
- intervención de IA;
- aprobación;
- stop conditions.

La lógica mecánica queda en el runtime.

## 6. Guías con estado y provenance

Las guías ahora tienen:

```text
generated
reviewed
approved
stale
rejected
```

También registran:

- fuentes;
- fingerprints;
- generator version;
- modelo;
- prompt version;
- fecha;
- revisor;
- aprobación.

La propuesta reconoce que una guía generada con IA no es determinista hasta ser aprobada y versionada.

## 7. Seguridad de generadores

Se consideran:

- path boundaries;
- symlink escape;
- inputs JSON;
- executable y args separados;
- timeouts;
- redacción de secretos;
- hashes;
- aprobación de generadores nuevos.

## 8. Roadmap incremental más maduro

La implementación se divide en:

- Corte -1: dominio y runtime;
- bootstrap;
- scope catalog;
- release aggregate;
- stories y Work Packages;
- tasks;
- checks/reportes;
- skills;
- legacy removal.

Este orden reduce el riesgo de reconstruir una superficie pública sobre contratos inestables.
