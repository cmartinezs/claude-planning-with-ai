# Quinta revisión experta del rediseño next-generation

## Propósito

Este paquete contiene la quinta evaluación arquitectónica del rediseño next-generation del plugin actualmente llamado `claude-planning-with-ai`.

La revisión se realizó sobre:

```text
e4254f050f18b1df77d47e4d12ce19c8a004c247
Incorporate fourth redesign review
```

Commit base de la cuarta revisión:

```text
40525f510277a30625dd2c5fd4734226640d5a24
```

Ruta principal analizada:

```text
docs/plugin-redesign-release-flow/
```

Documento nuevo principal:

```text
docs/plugin-redesign-release-flow/
10-corte-1-2-contratos-ejecucion.md
```

## Naturaleza de esta revisión

Esta revisión no abre una nueva ronda de rediseño.

Su objetivo es cerrar de forma definitiva las inconsistencias residuales y ordenar el paso desde documentación a evidencia ejecutable.

Las instrucciones de este paquete son normativas:

```text
MUST       = obligatorio
MUST NOT   = prohibido
SHOULD     = recomendado salvo justificación documentada
MAY        = opcional
```

Cuando un documento indique “cambiar”, “eliminar”, “agregar” o “adoptar”, la acción debe ejecutarse exactamente como se describe antes de iniciar los spikes.

## Veredicto

La arquitectura está cerrada en lo sustancial.

Se aprueba:

- dominio;
- storage canónico;
- agregados separados;
- ChangeSets;
- event journal;
- DSL;
- canonicalización;
- Execution Contexts;
- Deployment Environments;
- orden general de spikes.

Antes de iniciar los spikes deben aplicarse ocho correcciones obligatorias:

1. eliminar definitivamente el fallback `/acronym-*`;
2. restringir `allowed-tools`;
3. bloquear escrituras directas a `.planning/**`;
4. limitar `DECISION_ACCEPTED_WITH_LIMITATIONS`;
5. corregir la state machine de operaciones;
6. eliminar la validación circular del Corte -1.2;
7. completar el Corte 0;
8. corregir el criterio de salida del Corte -1.1.

Además, se cierran cinco decisiones de producto:

1. producto nuevo `1.0.0`;
2. Node.js 20+;
3. UUIDv7;
4. display IDs deterministas e inmutables;
5. relación padre-hijo inmutable.

## Regla de congelamiento

Después de aplicar las correcciones de esta revisión:

```text
NO realizar otra revisión arquitectónica general.
NO agregar nuevas decisiones abiertas.
NO iniciar el runtime productivo.
SÍ ejecutar los spikes.
SÍ revisar únicamente evidencia.
```

## Orden de lectura

1. [Resumen ejecutivo](01-resumen-ejecutivo.md)
2. [Estado de incorporación](02-estado-incorporacion.md)
3. [Fallback y namespace](03-fallback-namespace.md)
4. [Permisos y allowed-tools](04-permisos-allowed-tools.md)
5. [Protección de `.planning`](05-proteccion-planning.md)
6. [Gating de spikes](06-gating-spikes.md)
7. [State machine de operaciones](07-state-machine-operaciones.md)
8. [Validación del Corte -1.2](08-validacion-corte-1-2.md)
9. [Correcciones del roadmap](09-correcciones-roadmap.md)
10. [Producto y versionado](10-producto-versionado.md)
11. [Runtime Node.js 20+](11-runtime-node20.md)
12. [UUIDv7 e identidad](12-uuidv7-identidad.md)
13. [Display IDs](13-display-ids.md)
14. [Relaciones padre-hijo](14-relaciones-padre-hijo.md)
15. [Spikes definitivos](15-spikes-definitivos.md)
16. [Matriz de implementación obligatoria](16-matriz-implementacion.md)
17. [Criterio de cierre](17-criterio-cierre.md)
18. [Conclusión](18-conclusion.md)

## Uso esperado

Este paquete debe utilizarse como:

- entrada para el agente que corregirá la documentación;
- checklist de aceptación;
- contrato de congelamiento;
- definición del Corte -1.2;
- base de los ADRs;
- criterio para aprobar o rechazar cada spike.
