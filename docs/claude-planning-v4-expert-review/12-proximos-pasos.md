# Próximos pasos

## Prioridad 1 — Corregir el modelo

Reemplazar:

```text
release -> scopes -> sibling stories -> tasks
```

por:

```text
release -> story -> scope work packages -> tasks
```

Esta es la corrección más importante.

## Prioridad 2 — Separar estado y documentación

Crear archivos canónicos estructurados.

Tratar Markdown como proyección generada.

## Prioridad 3 — Formalizar mutaciones

Diseñar:

- ChangeSet;
- revision locking;
- atomic writes;
- idempotencia;
- event journal;
- verify post-apply.

## Prioridad 4 — Resolver contradicciones de UX

Eliminar doble init.

Definir claramente si `/release` es:

- fachada;
- router;
- gestor;
- dominio.

## Prioridad 5 — Configurar políticas

Hacer configurables:

- secuencia de releases;
- lanes;
- autonomía;
- aprobación;
- scopes;
- comandos;
- gates;
- concurrencia;
- deployment model.

## Prioridad 6 — Probar el núcleo

Crear pruebas para:

- transiciones de estado;
- ciclos de dependencias;
- generación de IDs;
- idempotencia;
- staleness;
- concurrencia;
- escrituras atómicas;
- path boundaries;
- compatibilidad cross-platform;
- generación reproducible;
- ausencia legacy.

## Prioridad 7 — Implementar un vertical slice

Primer vertical slice recomendado:

```text
plan-init
  -> config estructurada
  -> scope catalog
  -> release create
  -> story create
  -> work package create
  -> task create
  -> check
  -> report
```

Sin:

- ejecución autónoma;
- Git;
- gh;
- recovery;
- backlog externo;
- deployment.

## Criterio de éxito

La documentación principal debería poder explicar el plugin así:

```text
1. Inicializa el proyecto.
2. Configura scopes y políticas.
3. Crea una release.
4. Define stories o capabilities.
5. Divide cada story en work packages por scope.
6. Atomiza cada work package en tasks.
7. Ejecuta operaciones mediante ChangeSets.
8. Verifica gates y evidencia.
9. Libera y registra deployment.
10. Finaliza y genera retrospectiva.
```

Si vuelve a ser necesaria una tabla de comandos similares, el diseño aún no es suficientemente simple.
