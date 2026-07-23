# Mejoras incorporadas

## Estado de las recomendaciones anteriores

| Recomendación anterior | Estado |
|---|---|
| Convertir `Story Group` en la Story real | Incorporada |
| Convertir historias por scope en Work Packages | Incorporada |
| Mover scopes y guías al Project Context | Incorporada |
| YAML/JSON como estado canónico | Incorporada |
| Markdown como proyección | Incorporada |
| Separar blockers del lifecycle | Incorporada |
| Introducir ChangeSets y revisiones | Incorporada |
| Reemplazar doble init por `plan-init` + `plan-config` | Incorporada |
| Tratar `/release` como router | Incorporada |
| Agregar IDs inmutables | Incorporada |
| Crear un launcher estable | Incorporada conceptualmente |
| Comenzar por schemas/runtime, no por skills | Incorporada |

## Corrección del modelo funcional

La arquitectura anterior utilizaba:

```text
release -> scopes -> sibling stories -> tasks
```

La propuesta actual utiliza:

```text
project context
  -> release
    -> story/capability
      -> scope work package
        -> task
```

La Story ahora representa:

- actor;
- necesidad;
- valor;
- comportamiento;
- criterios de aceptación;
- reglas funcionales;
- outcome;
- Definition of Done.

Los Work Packages representan:

- ownership técnico;
- scope;
- diseño;
- contratos;
- dependencias;
- riesgos;
- gates;
- tasks;
- evidencia.

## Corrección del storage

Se incorporó:

```text
.planning/
  config.yml
  plugin.lock.yml
  events.ndjson
  scopes/
  decisions/
  releases/
```

Con entidades estructuradas:

```text
scope.yml
release.yml
story.yml
work-package.yml
task.yml
```

Y Markdown generado:

```text
README.md
TRACEABILITY.md
RELEASE-NOTES.md
RETROSPECTIVE.md
```

## Corrección del lifecycle

Se eliminó `BLOCKED` como reemplazo de estado.

Ahora existen:

- lifecycle;
- blockers;
- risks;
- waivers;
- resolution;
- commitment.

## Corrección de mutaciones

Se incorporó:

```text
inspect -> propose -> validate -> approve -> apply -> verify -> record
```

Con ChangeSets que contienen:

- operation ID;
- base revision;
- idempotency key;
- preconditions;
- file changes;
- commands;
- postconditions;
- approval.

## Corrección del roadmap

El plan ya no comienza creando `skills/release/SKILL.md`.

Comienza por un Corte -1 con:

- dominio;
- schemas;
- storage;
- identidad;
- concurrencia;
- ChangeSets;
- políticas;
- seguridad;
- launcher;
- fixtures;
- pruebas arquitectónicas.

Este cambio de orden es correcto.
