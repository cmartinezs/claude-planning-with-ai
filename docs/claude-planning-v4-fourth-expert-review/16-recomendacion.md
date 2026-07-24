# Recomendación

## Aprobado

- dominio central;
- Release Items tipados;
- scopes globales;
- guías estructuradas;
- DSL como dirección;
- IDs distribuidos;
- paths por primary ID;
- append-by-file;
- ChangeSets para control plane;
- eventos como auditoría;
- separación de runtime storage;
- reportes mutantes por operación;
- trust model;
- Corte -1.2;
- ejecución de spikes.

## Aprobado con correcciones

- DSL;
- hashing;
- display IDs;
- environments;
- Operation state machine;
- skill permissions;
- launcher interno;
- merge protocol.

## No aprobado todavía

- naming definitivo;
- versión definitiva;
- Node versus binario nativo;
- runtime productivo;
- publicación;
- eliminación efectiva de v3;
- vertical slice productivo.

## Próximo movimiento correcto

No crear otra revisión general de arquitectura.

Ejecutar:

```text
Host integration
-> Runtime distribution
-> Canonical core
-> Worktree merge
-> Crash recovery
-> Integrated prototype
```

## Criterio de aprobación del runtime

El runtime productivo puede comenzar cuando:

- naming esté decidido;
- namespace esté demostrado;
- runtime esté seleccionado;
- paths estén probados;
- merge protocol pase fixtures;
- hashing sea reproducible;
- DSL sea ejecutable;
- recovery esté demostrado;
- Operation state machine esté cerrada;
- producto y versión estén decididos;
- exista un prototipo integrado.
