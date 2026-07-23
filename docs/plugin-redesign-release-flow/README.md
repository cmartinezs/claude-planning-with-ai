# Propuesta de rediseno: flujo centrado en releases

Fecha: 2026-07-22

## Objetivo

Reordenar el plugin para que la unidad principal de planificacion sea la release. Cada release se organiza por scopes configurables del proyecto; cada scope contiene sus propias historias de usuario, y cada historia contiene una o mas tareas tecnicas. Cuando una capacidad afecta mas de un scope, se modela como un grupo de historias relacionadas, por ejemplo `story-01-a` en un scope y `story-01-b` en otro. Las historias y tareas deben mantener su formato actual en lo esencial, pero el flujo publico debe ser mas claro, con menos comandos visibles y con mas trabajo mecanico delegado a scripts deterministas.

Esta propuesta asume un corte limpio para v4.0.0. Antes de publicar la version, confirmar el numero exacto contra `CHANGELOG.md` y los manifests, pero el diseno no mantiene compatibilidad hacia atras con los comandos ni carpetas anteriores.

## Orden de lectura

1. [Diagnostico](00-diagnostico.md)
2. [Arquitectura objetivo](01-arquitectura-objetivo.md)
3. [Configuracion inicial de release](04-release-init-configuracion.md)
4. [Guias por scope para tasks y tests](05-scope-task-guides.md)
5. [Eliminacion legacy](06-eliminacion-legacy.md)
6. [Mapa de comandos y skills](02-mapa-comandos-skills.md)
7. [Plan incremental](03-plan-incremental.md)

## Tesis inicial

El plugin no necesita mas comandos de primer nivel. Necesita menos comandos, mas etapas explicitas y una separacion mas fuerte entre:

- scripts deterministas que leen, validan y mutan Markdown;
- skills finas que orquestan, piden aprobacion y acotan el trabajo no determinista;
- decisiones humanas cuando hay ambiguedad real de producto, alcance, arquitectura o release.

La propuesta inicial reduce el flujo publico a una familia central de release/scope/story/task/check/report y trata los comandos actuales como material de referencia, no como API que deba conservarse.
