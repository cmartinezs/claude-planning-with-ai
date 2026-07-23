# Recomendación

## Estado de aprobación

| Área | Decisión |
|---|---|
| Release → Item → Work Package → Task | Aprobado |
| Scopes globales | Aprobado |
| Guías YAML | Aprobado con DSL pendiente |
| ChangeSets | Aprobado conceptualmente |
| Eventos por archivo | Aprobado con retención pendiente |
| Operaciones multiarchivo | Aprobado con recovery pendiente |
| IDs distribuidos | Aprobado; paths pendientes |
| Concurrencia worktrees | No cerrada |
| Naming ARC Flow | No aprobado |
| Runtime Node | No cerrado |
| Runtime productivo | No aprobado |
| Spikes técnicos | Aprobados |

## No crear otra reestructuración general

La arquitectura principal ya está suficientemente documentada.

Ampliar el Corte -1.1 con:

1. naming y namespace;
2. runtime prerequisite;
3. canonical paths;
4. merge protocol;
5. control plane versus work product;
6. DSL;
7. catálogos;
8. canonical hashing;
9. audit log versus event sourcing;
10. Git y retención;
11. trust model;
12. report semantics.

## Orden recomendado

1. resolver naming provisional;
2. construir plugin mínimo;
3. probar Node/no Node;
4. probar dos worktrees;
5. probar crash recovery;
6. definir canonical hashing;
7. demostrar DSL ejecutable;
8. actualizar Corte -1.1;
9. iniciar runtime vertical slice.
