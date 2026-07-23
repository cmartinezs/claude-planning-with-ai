# Propuesta de rediseno v4: ARC Flow

Fecha: 2026-07-22

## Objetivo

Reordenar el plugin bajo una identidad nueva y reconocible: `ARC Flow` (`ARC`: Agentic Release Coordination). La unidad publica de entrega es la release, sin convertirla en una coleccion de comandos sueltos ni en una base de datos Markdown. El modelo v4 debe ser:

```text
project context -> release -> release item -> scope work package -> task
```

El Release Item representa una unidad entregable tipada: user story, capability, defect, enabler, spike, compliance, migration u operational work. Cuando un item afecta varios frentes, no se divide en "historias hermanas"; se conserva como un solo item y se descompone en work packages por scope. Cada work package contiene el diseno, contratos, riesgos, gates, referencias de guia y tasks tecnicas del scope propietario.

El flujo publico debe ser mas claro, con menos comandos visibles, una identidad estable, estado canonico estructurado, Markdown como proyeccion humana y trabajo mecanico delegado a un runtime determinista.

La superficie publica deja de usar prefijos genericos `claude-*` o `plan-*`. Las skills visibles usan el prefijo `arc-` y el launcher ejecutable es `arcflow`, por ejemplo `/arc-init` llama a `arcflow workspace init`.

Esta propuesta asume un corte limpio para v4.0.0. Antes de publicar la version, confirmar el numero exacto contra `CHANGELOG.md` y los manifests, pero el diseno no mantiene compatibilidad hacia atras con los comandos ni carpetas anteriores.

## Orden de lectura

1. [Diagnostico](00-diagnostico.md)
2. [Arquitectura objetivo](01-arquitectura-objetivo.md)
3. [Mapa de comandos y skills](02-mapa-comandos-skills.md)
4. [Plan incremental](03-plan-incremental.md)
5. [Configuracion inicial del proyecto](04-release-init-configuracion.md)
6. [Guias por scope para tasks y tests](05-scope-task-guides.md)
7. [Eliminacion legacy](06-eliminacion-legacy.md)
8. [Estructura completa del plugin v4](07-estructura-plugin-v4.md)
9. [Corte -1.1: contratos residuales del runtime](08-corte-1-1-contratos-runtime.md)

## Tesis corregida

El plugin no necesita mas comandos de primer nivel. Necesita un runtime con:

- modelo de dominio explicito;
- schemas para config, lock, scopes, releases, release items, work packages, tasks, ChangeSets, operaciones, eventos y guias;
- protocolo `inspect -> propose -> validate -> approve -> stage -> apply -> verify -> record`;
- launcher estable que resuelve instalacion, template pack, schemas y workspace;
- scripts deterministas que leen y mutan estado estructurado;
- skills finas que orquestan, piden aprobacion y acotan el trabajo no determinista;
- decisiones humanas cuando hay ambiguedad real de producto, alcance, arquitectura o release.

La propuesta reduce el flujo publico diario a `arc-init`, `arc-config`, `arc-release`, `arc-item`, `arc-task`, `arc-check`, `arc-report` y `arc-decision`, con `arc-update` como comando de mantenimiento del plugin/template pack. Los comandos actuales son material de referencia para rescatar capacidades, no API que deba conservarse.

La segunda revision experta aprueba avanzar al Corte -1, pero exige cerrar antes el [Corte -1.1](08-corte-1-1-contratos-runtime.md): fuente unica de scopes, guias YAML ejecutables, Release Items tipados, IDs distribuidos, eventos por archivo, revisiones por agregado, atomicidad multiarchivo, launcher raiz y bundle self-contained.
