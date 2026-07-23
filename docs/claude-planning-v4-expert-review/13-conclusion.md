# Conclusión

La v4 tiene una tesis sólida, pero todavía conserva una deformación del modelo anterior.

Está usando `story` como contenedor técnico por scope y luego introduce `Story Group` para recuperar la capacidad funcional que perdió.

La corrección es directa:

> El Story Group debe ascender y convertirse en la verdadera User Story o Capability.

Las actuales historias hermanas deben convertirse en:

> Scope Work Packages o Scope Slices.

Con esa corrección, más:

- almacenamiento estructurado;
- IDs estables;
- protocolo transaccional de mutación;
- optimistic locking;
- event journal;
- scopes globales versionados;
- políticas configurables;
- ejecución segura;

el plugin dejaría de ser solamente más simple.

Podría convertirse en un runtime de planificación:

- reproducible;
- auditable;
- determinista;
- extensible;
- preparado para múltiples agentes;
- independiente de un stack específico;
- usable tanto en software como en otros tipos de proyectos.

## Decisión final recomendada

**Aprobar la dirección estratégica de la v4.**

**No aprobar todavía el modelo exacto para implementación.**

Ejecutar primero el Corte -1 y corregir el dominio antes de comenzar a construir skills, scripts o migraciones.
