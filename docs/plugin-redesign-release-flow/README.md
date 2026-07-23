# Propuesta de rediseno v4: runtime centrado en releases

Fecha: 2026-07-22

## Objetivo

Reordenar el plugin para que la unidad publica de entrega sea la release, sin convertirla en una coleccion de comandos sueltos ni en una base de datos Markdown. El modelo v4 debe ser:

```text
project context -> release -> story/capability -> scope work package -> task
```

La story/capability representa valor funcional observable. Cuando una capacidad afecta varios frentes, no se divide en "historias hermanas"; se conserva como una sola story y se descompone en work packages por scope. Cada work package contiene el diseno, contratos, riesgos, gates y tasks tecnicas del scope propietario.

El flujo publico debe ser mas claro, con menos comandos visibles, una identidad estable, estado canonico estructurado, Markdown como proyeccion humana y trabajo mecanico delegado a un runtime determinista.

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

## Tesis corregida

El plugin no necesita mas comandos de primer nivel. Necesita un runtime con:

- modelo de dominio explicito;
- schemas para config, lock, scopes, releases, stories, work packages, tasks, ChangeSets, eventos y guias;
- protocolo `inspect -> propose -> validate -> approve -> apply -> verify -> record`;
- launcher estable que resuelve instalacion, template pack, schemas y workspace;
- scripts deterministas que leen y mutan estado estructurado;
- skills finas que orquestan, piden aprobacion y acotan el trabajo no determinista;
- decisiones humanas cuando hay ambiguedad real de producto, alcance, arquitectura o release.

La propuesta reduce el flujo publico diario a `plan-init`, `plan-config`, `release`, `plan-story`, `plan-task`, `plan-check`, `plan-report` y `plan-decision`, con `plan-update-version` como comando de mantenimiento del plugin/template pack. Los comandos actuales son material de referencia para rescatar capacidades, no API que deba conservarse.
