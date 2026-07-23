# Recomendación

## Decisión

La arquitectura corregida puede avanzar al Corte -1.

Antes de escribir runtime productivo debe agregarse:

```text
Corte -1.1 — cerrar contradicciones del contrato
```

## Entregables del Corte -1.1

1. Una sola fuente de verdad para scopes.
2. Guías estructuradas en YAML/JSON.
3. Entidad canónica para Story, Capability y otros Release Items.
4. Modelo de scopes superpuestos y concerns.
5. IDs distribuidos sin colisiones.
6. Revisiones por agregado.
7. Event journal con archivos inmutables.
8. Protocolo transaccional multiarchivo.
9. Launcher raíz en `bin/`.
10. Runtime bundle self-contained.
11. Estrategia histórica para template packs.
12. Schemas de Gate, Blocker, Waiver, Decision, Actor y Deployment Event.
13. Eliminación de mutaciones en `/plan-check`.
14. Unificación de vocabulario `propose/apply/verify`.
15. Separación entre lifecycle, completion y readiness.

## Qué no hacer todavía

No implementar aún:

- ejecución autónoma;
- Git mutante;
- GitHub automation;
- release trains;
- parallel policies;
- recovery complejo;
- backlog externo;
- deployment real;
- agentes end-to-end;
- migración automática v3 a v4.

## Spike prioritario

Construir primero un spike instalable que valide:

```text
plugin
  -> bin launcher
    -> runtime bundle
      -> schemas
        -> workspace init
          -> ChangeSet
            -> apply
              -> verify
```

## Criterio de aprobación del runtime

El runtime puede comenzar cuando:

- no existan fuentes duplicadas;
- todos los estados operativos tengan schema;
- la identidad sea segura en worktrees;
- la atomicidad esté definida;
- el launcher funcione instalado;
- las dependencias estén empaquetadas;
- el journal no cause conflictos sistemáticos;
- el template pack pueda resolverse de forma reproducible.
